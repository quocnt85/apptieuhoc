import React, { useEffect } from 'react';
import { useGameStore } from './stores/useGameStore';
import { Header } from './components/ui/Header';
import { BottomNav } from './components/ui/BottomNav';
import { WorldMap } from './components/world/WorldMap';
import { QuestionExplorer } from './components/questions/QuestionExplorer';
import { CanvasMiniGame } from './components/game/CanvasMiniGame';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { SettingsView } from './components/settings/SettingsView';
import { InteractiveQuizPlayer } from './components/game/InteractiveQuizPlayer';

export const App: React.FC = () => {
  const { activeTab, activeQuestion, setActiveQuestion, loadFromLocalStorage } = useGameStore();

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Header */}
      <Header />

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-4">
        {activeTab === 'world' && <WorldMap />}
        {activeTab === 'explore' && <QuestionExplorer />}
        {activeTab === 'practice' && <CanvasMiniGame />}
        {activeTab === 'parent' && <ParentDashboard />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Interactive Modal Player for Questions */}
      {activeQuestion && (
        <InteractiveQuizPlayer
          question={activeQuestion}
          onClose={() => setActiveQuestion(null)}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default App;
