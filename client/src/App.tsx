import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from './stores/useGameStore';
import { SplashScreen } from './components/views/SplashScreen';
import { WelcomeModal } from './components/views/WelcomeModal';
import { HomeView } from './components/views/HomeView';
import { Planet3DView } from './components/views/Planet3DView';
import { SpaceHangarView } from './components/views/SpaceHangarView';
import { SpaceShowroomView } from './components/views/SpaceShowroomView';
import { AsteroidRunnerGame } from './components/game/AsteroidRunnerGame';
import { VercelHeader } from './components/ui/VercelHeader';
import { VercelBottomNav, VercelTab } from './components/ui/VercelBottomNav';
import { TenStageLessonRunner } from './components/lesson/TenStageLessonRunner';
import { PLANETS_DATA } from './data/planetsData';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { getPlayLimitStatus, useParentZoneStore } from './stores/useParentZoneStore';
import { initializeCameraRestore } from './services/personalization/cameraCapture';
import { initializeParentGate } from './services/personalization/parentGate';
import { initializePersonalizationFoundation } from './services/personalization/personalizationLifecycle';
import { parentFeatureFlags } from './config/parentFeatureFlags';

const reviewToolsEnabled = import.meta.env.DEV || parentFeatureFlags.demoAccess;
const AudioDebugOverlay = reviewToolsEnabled ? React.lazy(() => import('./components/dev/AudioDebugOverlay').then((module) => ({ default: module.AudioDebugOverlay }))) : null;
const DevFloatingButton = reviewToolsEnabled ? React.lazy(() => import('./components/dev/DevFloatingButton').then((module) => ({ default: module.DevFloatingButton }))) : null;
const DevGodModeModal = reviewToolsEnabled ? React.lazy(() => import('./components/dev/DevGodModeModal').then((module) => ({ default: module.DevGodModeModal }))) : null;
const PerformanceOverlay = reviewToolsEnabled ? React.lazy(() => import('./components/dev/PerformanceOverlay').then((module) => ({ default: module.PerformanceOverlay }))) : null;

export const App: React.FC = () => {
  const { hasSeenFTUE, setFTUESeen, loadFromLocalStorage, isLessonRunning, startLesson, closeLesson, activePlanetId } = useGameStore();

  const [isSplashing, setIsSplashing] = useState(true);
  const [showFTUEModal, setShowFTUEModal] = useState(false);
  const [activeTab, setActiveTab] = useState<VercelTab>('home');
  const [limitBlocked, setLimitBlocked] = useState(false);
  const [limitReason, setLimitReason] = useState<'curfew' | 'daily_limit'>('daily_limit');
  const [timeWarning, setTimeWarning] = useState<string | null>(null);
  const [eyeBreakSeconds, setEyeBreakSeconds] = useState(0);
  const lastInteraction = useRef(Date.now()); const continuousStart = useRef(Date.now()); const warningsShown = useRef(new Set<number>());
  const recordUsageTick = useParentZoneStore((state) => state.recordUsageTick);
  const activeChildProfile = useParentZoneStore((state) => state.profiles.find((profile) => profile.id === state.activeProfileId));
  const showDevTools = reviewToolsEnabled;

  useEffect(() => {
    loadFromLocalStorage();
    initializeParentGate();
    initializeCameraRestore();
  }, [loadFromLocalStorage]);

  useEffect(() => {
    if (!activeChildProfile?.id) return;
    void initializePersonalizationFoundation(activeChildProfile.id).catch((error) => {
      if (import.meta.env.DEV) console.warn('Personalization media reconciliation failed.', error);
    });
  }, [activeChildProfile?.id]);

  useEffect(() => {
    if (!activeChildProfile) return;
    useGameStore.setState((state) => ({ user: { ...state.user, id: activeChildProfile.id, name: activeChildProfile.name, grade: activeChildProfile.grade ?? state.user.grade, avatar: activeChildProfile.avatar } }));
  }, [activeChildProfile?.id, activeChildProfile?.name, activeChildProfile?.grade, activeChildProfile?.avatar]);

  useEffect(() => {
    const interact = () => { if (Date.now() - lastInteraction.current > 60_000) continuousStart.current = Date.now(); lastInteraction.current = Date.now(); };
    window.addEventListener('pointerdown', interact); window.addEventListener('keydown', interact);
    const checkLimit = () => {
      const status = getPlayLimitStatus();
      if (!isLessonRunning && activeTab !== 'minigame' && activeTab !== 'parent') {
        setLimitBlocked(status.blocked);
        setLimitReason(status.reason);
      }
    };
    checkLimit();
    const timer = window.setInterval(() => {
      const engaged = Date.now() - lastInteraction.current <= 60_000;
      if (!document.hidden && activeTab !== 'parent' && engaged) recordUsageTick();
      checkLimit();
      const status = getPlayLimitStatus(); const remaining = Math.ceil(status.allowedMinutes - status.usedMinutes);
      if ((remaining === 5 || remaining === 1) && !warningsShown.current.has(remaining)) { warningsShown.current.add(remaining); setTimeWarning(`Còn ${remaining} phút sử dụng hôm nay.`); window.setTimeout(()=>setTimeWarning(null),5000); }
      if (engaged && activeTab !== 'parent' && Date.now() - continuousStart.current >= 20 * 60_000) { setEyeBreakSeconds(20); continuousStart.current = Date.now(); }
    }, 60_000);
    return () => { window.clearInterval(timer); window.removeEventListener('pointerdown', interact); window.removeEventListener('keydown', interact); };
  }, [activeTab, isLessonRunning, recordUsageTick]);

  useEffect(() => { if (eyeBreakSeconds<=0)return;const timer=window.setInterval(()=>setEyeBreakSeconds(value=>Math.max(0,value-1)),1000);return()=>window.clearInterval(timer);},[eyeBreakSeconds>0]);

  const navigate = (tab: VercelTab) => {
    if (tab !== 'parent' && tab !== 'home') {
      const status = getPlayLimitStatus();
      if (status.blocked) {
        setLimitBlocked(true);
        setLimitReason(status.reason);
        return;
      }
    }
    setLimitBlocked(false);
    setActiveTab(tab);
  };

  const handleSplashFinish = () => {
    setIsSplashing(false);
    if (!hasSeenFTUE) {
      setShowFTUEModal(true);
    }
  };

  const handleStartFTUE = () => {
    setFTUESeen();
    setShowFTUEModal(false);
    navigate('planet');
  };

  const currentPlanet = PLANETS_DATA.find((p) => p.id === activePlanetId) || PLANETS_DATA[0];

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Trung tâm chỉ huy';
      case 'planet':
        return currentPlanet.titleVi;
      case 'showroom':
        return 'Phòng Duyệt 3D';
      case 'hangar':
        return 'Xưởng Tàu Không Gian';
      case 'minigame':
        return 'Vượt Dải Thiên Thạch';
      case 'parent':
        return 'Góc Phụ Huynh';
      default:
        return 'Hành Tinh Tri Thức';
    }
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#030712] flex items-center justify-center overflow-hidden transition-colors duration-300 select-none overscroll-none">
      {/* Unified App Shell (Deep Cosmic Navy) */}
      <div className="w-full h-full max-w-2xl bg-[#050814] text-white sm:border sm:border-sky-500/30 sm:shadow-[0_0_60px_rgba(56,189,248,0.25)] flex flex-col overflow-hidden relative transition-all duration-300">
        {showDevTools && AudioDebugOverlay && <React.Suspense fallback={null}><AudioDebugOverlay /></React.Suspense>}
        
        {/* Splash Screen */}
        {isSplashing ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <>
            {/* Cosmic Header */}
            {!isLessonRunning && activeTab !== 'minigame' && activeTab !== 'parent' && (
              <VercelHeader
                title={getHeaderTitle()}
              />
            )}

            {/* Dynamic Views or Fullscreen Lesson Runner */}
            {!isLessonRunning ? (
              <>
                <main className="flex-1 flex flex-col overflow-hidden relative">
                  {activeTab === 'home' && (
                    <HomeView 
                      onNavigateToMap={() => navigate('planet')}
                      onNavigateToMiniGame={() => navigate('minigame')}
                    />
                  )}
                  {activeTab === 'planet' && (
                    <Planet3DView onStartLesson={(nodeId) => startLesson(nodeId)} />
                  )}
                  {activeTab === 'showroom' && (
                    <SpaceShowroomView onClose={() => setActiveTab('home')} />
                  )}
                  {activeTab === 'hangar' && (
                    <SpaceHangarView />
                  )}
                  {activeTab === 'minigame' && (
                    <AsteroidRunnerGame onExit={() => navigate('home')} />
                  )}
                  {activeTab === 'parent' && <ParentDashboard />}
                </main>

                {/* Bottom Navigation Bar */}
                {activeTab !== 'minigame' && (
                  <VercelBottomNav
                    activeTab={activeTab}
                    onChangeTab={navigate}
                  />
                )}

                {/* First-Time User Experience (FTUE) Welcome Modal */}
                {showFTUEModal && (
                  <WelcomeModal onStart={handleStartFTUE} />
                )}
                {limitBlocked && activeTab !== 'parent' && (
                  <div className="absolute inset-0 z-[80] flex items-center justify-center bg-slate-950/95 p-6 text-center backdrop-blur">
                    <div className="max-w-sm rounded-3xl border border-indigo-500/40 bg-slate-900 p-6">
                      <div className="text-4xl">🌙</div>
                      <h2 className="mt-3 text-xl font-black text-white">Đến giờ nghỉ rồi</h2>
                      <p className="mt-2 text-sm text-slate-300">{limitReason === 'curfew' ? 'Đang trong khung giờ nghỉ 21:30–06:00.' : 'Con đã dùng hết thời gian hôm nay.'} Hoạt động đang chơi luôn được hoàn thành trước khi màn hình này xuất hiện.</p>
                      <button onClick={() => navigate('parent')} className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-black text-slate-950">Phụ huynh mở cài đặt</button>
                    </div>
                  </div>
                )}
                {timeWarning && <div className="absolute left-1/2 top-20 z-[75] -translate-x-1/2 rounded-2xl border border-amber-400 bg-amber-950/95 px-5 py-3 text-sm font-black text-amber-200 shadow-xl">{timeWarning}</div>}
                {eyeBreakSeconds>0 && activeTab!=='parent' && <div className="absolute inset-0 z-[79] flex items-center justify-center bg-slate-950/95 p-6 text-center"><div className="max-w-sm"><div className="text-5xl">👀</div><h2 className="mt-3 text-xl font-black">Nghỉ mắt 20 giây</h2><p className="mt-2 text-sm text-slate-300">Nhìn ra xa, chớp mắt nhẹ và thả lỏng vai. Còn {eyeBreakSeconds} giây.</p>{import.meta.env.VITE_ENABLE_PENDING_HEALTH_CONTENT==='true'&&<p className="mt-2 text-xs text-amber-300">Bản nháp chờ hậu kiểm: nhắm mắt và xoa nhẹ vùng quanh hốc mắt, không ấn vào nhãn cầu; dừng nếu khó chịu.</p>}</div></div>}
              </>
            ) : (
              /* 10-Stage Universal Lesson Runner */
              <div className="flex-1 flex flex-col overflow-hidden relative">
                <TenStageLessonRunner onClose={closeLesson} />
              </div>
            )}

            {/* Dev God Mode Global Elements */}
            {showDevTools && DevFloatingButton && activeTab !== 'minigame' && activeTab !== 'parent' && <React.Suspense fallback={null}><DevFloatingButton /></React.Suspense>}
            {showDevTools && DevGodModeModal && activeTab !== 'minigame' && activeTab !== 'parent' && <React.Suspense fallback={null}><DevGodModeModal onOpenShowroom={() => navigate('showroom')} /></React.Suspense>}
            {showDevTools && PerformanceOverlay && <React.Suspense fallback={null}><PerformanceOverlay /></React.Suspense>}
          </>
        )}

      </div>
    </div>
  );
};

export default App;
