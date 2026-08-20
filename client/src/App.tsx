import React, { useState, useEffect } from 'react';
import { useGameStore } from './stores/useGameStore';
import { SplashScreen } from './components/views/SplashScreen';
import { WelcomeModal } from './components/views/WelcomeModal';
import { HomeView } from './components/views/HomeView';
import { IslandMapView } from './components/views/IslandMapView';
import { ProfileView } from './components/views/ProfileView';
import { CanvasMiniGame } from './components/game/CanvasMiniGame';
import { VercelHeader } from './components/ui/VercelHeader';
import { VercelBottomNav, VercelTab } from './components/ui/VercelBottomNav';
import { TenStageLessonRunner } from './components/lesson/TenStageLessonRunner';
import { DemoStyleSwitcher } from './components/ui/DemoStyleSwitcher';

export const App: React.FC = () => {
  const { hasSeenFTUE, setFTUESeen, loadFromLocalStorage, demoStyleMode } = useGameStore();

  const [isSplashing, setIsSplashing] = useState(true);
  const [showFTUEModal, setShowFTUEModal] = useState(false);
  const [activeTab, setActiveTab] = useState<VercelTab>('home');
  const [isLessonRunning, setIsLessonRunning] = useState(false);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  const handleSplashFinish = () => {
    setIsSplashing(false);
    if (!hasSeenFTUE) {
      setShowFTUEModal(true);
    }
  };

  const handleStartFTUE = () => {
    setFTUESeen();
    setShowFTUEModal(false);
    setActiveTab('map');
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'NovaStars';
      case 'map':
        return 'Đảo 1: Đảo Dũng Cảm';
      case 'minigame':
        return 'Thử Thách Phi Thuyền';
      case 'profile':
        return 'Hồ Sơ Anh Hùng';
      default:
        return 'NovaStars';
    }
  };

  // Outer desktop background
  const getOuterBg = () => {
    if (demoStyleMode === 'sunnyclay') return 'bg-gradient-to-b from-sky-200 via-sky-100 to-indigo-100';
    if (demoStyleMode === 'gloss3d') return 'bg-[#030712]';
    if (demoStyleMode === 'neopop') return 'bg-[#fef08a]';
    return 'bg-gradient-to-br from-indigo-200 via-sky-100 to-pink-100';
  };

  // Inner App shell background
  const getShellClass = () => {
    if (demoStyleMode === 'sunnyclay') return 'bg-gradient-to-b from-[#e0f2fe] via-[#f0fdf4] to-[#fefce8] text-slate-800 sm:border-x-2 sm:border-sky-200 sm:shadow-2xl';
    if (demoStyleMode === 'gloss3d') return 'bg-slate-950 text-white sm:border-x sm:border-slate-800 sm:shadow-2xl';
    if (demoStyleMode === 'neopop') return 'bg-[#fef9c3] text-slate-900 sm:border-x-3 sm:border-slate-900 sm:shadow-[8px_8px_0_0_#0f172a]';
    return 'bg-gradient-to-b from-indigo-50/90 via-sky-50/90 to-rose-50/90 text-slate-900 sm:border-x sm:border-white sm:shadow-[0_20px_50px_rgba(99,102,241,0.15)]';
  };

  return (
    <div className={`h-[100dvh] w-full ${getOuterBg()} flex items-center justify-center overflow-hidden transition-colors duration-300`}>
      {/* Unified App Shell */}
      <div className={`w-full h-[100dvh] max-w-2xl ${getShellClass()} flex flex-col overflow-hidden relative transition-all duration-300`}>
        
        {/* Top Demo Style Switcher Banner */}
        {!isSplashing && !isLessonRunning && <DemoStyleSwitcher />}

        {/* Splash Screen */}
        {isSplashing ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <>
            {/* Header */}
            {!isLessonRunning && <VercelHeader title={getHeaderTitle()} />}

            {/* Dynamic Views */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
              {activeTab === 'home' && (
                <HomeView 
                  onNavigateToMap={() => setActiveTab('map')}
                  onNavigateToMiniGame={() => setActiveTab('minigame')}
                />
              )}
              {activeTab === 'map' && (
                <IslandMapView onStartLessonZero={() => setIsLessonRunning(true)} />
              )}
              {activeTab === 'minigame' && (
                <div className="flex-1 p-3 sm:p-6 overflow-y-auto pb-20 bg-slate-900">
                  <CanvasMiniGame />
                </div>
              )}
              {activeTab === 'profile' && <ProfileView />}
            </main>

            {/* Bottom Navigation Bar */}
            {!isLessonRunning && (
              <VercelBottomNav
                activeTab={activeTab}
                onChangeTab={(tab) => setActiveTab(tab)}
              />
            )}

            {/* First-Time User Experience (FTUE) Welcome Modal */}
            {showFTUEModal && (
              <WelcomeModal onStart={handleStartFTUE} />
            )}

            {/* 10-Stage Universal Lesson Runner */}
            {isLessonRunning && (
              <TenStageLessonRunner onClose={() => setIsLessonRunning(false)} />
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default App;


