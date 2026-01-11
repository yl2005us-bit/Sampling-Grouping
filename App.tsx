import React, { useState } from 'react';
import { Upload, Gift, Users } from 'lucide-react';
import InputSection from './components/InputSection';
import LotteryMode from './components/LotteryMode';
import GroupingMode from './components/GroupingMode';
import { NameItem, AppMode } from './types';

const App: React.FC = () => {
  const [names, setNames] = useState<NameItem[]>([]);
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.INPUT);

  const renderContent = () => {
    switch (currentMode) {
      case AppMode.INPUT:
        return <InputSection names={names} setNames={setNames} />;
      case AppMode.LOTTERY:
        return <LotteryMode names={names} />;
      case AppMode.GROUPING:
        return <GroupingMode names={names} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-indigo-200 shadow-md">
              L
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              幸運分組 (LuckyGroup)
            </span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setCurrentMode(AppMode.INPUT)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentMode === AppMode.INPUT
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">輸入名單</span>
            </button>
            <button
              onClick={() => setCurrentMode(AppMode.LOTTERY)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentMode === AppMode.LOTTERY
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">幸運抽籤</span>
            </button>
            <button
              onClick={() => setCurrentMode(AppMode.GROUPING)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentMode === AppMode.GROUPING
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">自動分組</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-[calc(100vh-8rem)]">
             {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
