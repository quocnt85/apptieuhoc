import React, { useState, useEffect } from 'react';
import { useGameStore } from './stores/useGameStore';
import { SplashScreen } from './components/views/SplashScreen';
import { WelcomeModal } from './components/views/WelcomeModal';
import { HomeView } from './components/views/HomeView';
import { Planet3DView } from './components/views/Planet3DView';
import { SpaceHangarView } from './components/views/SpaceHangarView';
import { ProfileView } from './components/views/ProfileView';
import { CanvasMiniGame } from './components/game/CanvasMiniGame';
import { VercelHeader } from './components/ui/VercelHeader';
import { VercelBottomNav, VercelTab } from './components/ui/VercelBottomNav';
import { TenStageLessonRunner } from './components/lesson/TenStageLessonRunner';

export const App: React.FC = () => {
  const { hasSeenFTUE, setFTUESeen, loadFromLocalStorage, isLessonRunning, startLesson, closeLesson } = useGameStore();

  const [isSplashing, setIsSplashing] = useState(true);
  const [showFTUEModal, setShowFTUEModal] = useState(false);
  const [activeTab, setActiveTab] = useState<VercelTab>('home');

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
    setActiveTab('planet');
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Hành Tinh Tri Thức';
      case 'planet':
        return 'Tinh Cầu Dũng Khí 3D';
      case 'hangar':
        return 'Xưởng Tàu Không Gian';
      case 'profile':
        return 'Hồ Sơ Phi Hành Gia';
      default:
        return 'Hành Tinh Tri Thức';
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#030712] flex items-center justify-center overflow-hidden transition-colors duration-300 select-none">
      {/* Unified App Shell (Deep Cosmic Navy) */}
      <div className="w-full h-[100dvh] max-w-2xl bg-[#050814] text-white sm:border sm:border-sky-500/30 sm:shadow-[0_0_60px_rgba(56,189,248,0.25)] flex flex-col overflow-hidden relative transition-all duration-300">
        
        {/* Splash Screen */}
        {isSplashing ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <>
            {/* Cosmic Header */}
            {!isLessonRunning && <VercelHeader title={getHeaderTitle()} />}

            {/* Dynamic Views or Fullscreen Lesson Runner */}
            {!isLessonRunning ? (
              <>
                <main className="flex-1 flex flex-col overflow-hidden relative">
                  {activeTab === 'home' && (
                    <HomeView 
                      onNavigateToMap={() => setActiveTab('planet')}
                      onNavigateToMiniGame={() => setActiveTab('planet')}
                    />
                  )}
                  {activeTab === 'planet' && (
                    <Planet3DView onStartLesson={(nodeId) => startLesson(nodeId)} />
                  )}
                  {activeTab === 'hangar' && (
                    <SpaceHangarView />
                  )}
                  {activeTab === 'profile' && <ProfileView />}
                </main>

                {/* Bottom Navigation Bar */}
                <VercelBottomNav
                  activeTab={activeTab}
                  onChangeTab={(tab) => setActiveTab(tab)}
                />

                {/* First-Time User Experience (FTUE) Welcome Modal */}
                {showFTUEModal && (
                  <WelcomeModal onStart={handleStartFTUE} />
                )}
              </>
            ) : (
              /* 10-Stage Universal Lesson Runner */
              <div className="flex-1 flex flex-col overflow-hidden relative">
                <TenStageLessonRunner onClose={closeLesson} />
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default App;
