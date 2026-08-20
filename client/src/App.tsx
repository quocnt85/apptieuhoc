import React, { useState, useEffect } from 'react';
import { useGameStore } from './stores/useGameStore';
import { SplashScreen } from './components/views/SplashScreen';
import { WelcomeModal } from './components/views/WelcomeModal';
import { HomeView } from './components/views/HomeView';
import { IslandMapView } from './components/views/IslandMapView';
import { ProfileView } from './components/views/ProfileView';
import { VercelHeader } from './components/ui/VercelHeader';
import { VercelBottomNav, VercelTab } from './components/ui/VercelBottomNav';
import { TenStageLessonRunner } from './components/lesson/TenStageLessonRunner';

export const App: React.FC = () => {
  const { hasSeenFTUE, setFTUESeen, loadFromLocalStorage } = useGameStore();

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
      case 'profile':
        return 'Hồ Sơ Anh Hùng';
      default:
        return 'NovaStars';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b1329] flex items-center justify-center p-0 sm:p-4">
      {/* Mobile Device Frame Container (Phone Shell) */}
      <div className="w-full max-w-[430px] h-screen sm:h-[880px] sm:max-h-[92vh] bg-white sm:rounded-[40px] shadow-2xl sm:border-[6px] sm:border-slate-700/60 flex flex-col overflow-hidden relative">
        
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
                <HomeView onNavigateToMap={() => setActiveTab('map')} />
              )}
              {activeTab === 'map' && (
                <IslandMapView onStartLessonZero={() => setIsLessonRunning(true)} />
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
