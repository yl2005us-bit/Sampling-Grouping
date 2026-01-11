import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, Award, Settings, CheckCircle2 } from 'lucide-react';
import { NameItem } from '../types';

interface LotteryModeProps {
  names: NameItem[];
}

const LotteryMode: React.FC<LotteryModeProps> = ({ names }) => {
  const [currentDisplay, setCurrentDisplay] = useState<string>('準備好了嗎?');
  const [isAnimating, setIsAnimating] = useState(false);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [history, setHistory] = useState<NameItem[]>([]);
  const [winner, setWinner] = useState<NameItem | null>(null);

  // Derived state for available candidates
  const availableCandidates = allowRepeats
    ? names
    : names.filter(n => !history.some(h => h.id === n.id));

  const startDraw = useCallback(() => {
    if (availableCandidates.length === 0) return;

    setIsAnimating(true);
    setWinner(null);

    let duration = 0;
    const totalDuration = 2000; // 2 seconds spin
    const intervalTime = 50; // Update every 50ms

    const interval = setInterval(() => {
      duration += intervalTime;
      // Show random name from full list for effect, even if filtering
      const randomPreview = names[Math.floor(Math.random() * names.length)];
      setCurrentDisplay(randomPreview.value);

      if (duration >= totalDuration) {
        clearInterval(interval);
        // Pick actual winner from available candidates
        const finalWinner = availableCandidates[Math.floor(Math.random() * availableCandidates.length)];
        setCurrentDisplay(finalWinner.value);
        setWinner(finalWinner);
        setHistory(prev => [finalWinner, ...prev]);
        setIsAnimating(false);
      }
    }, intervalTime);
  }, [names, availableCandidates]);

  const resetHistory = () => {
    setHistory([]);
    setWinner(null);
    setCurrentDisplay('準備好了嗎?');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Main Draw Area */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center flex-1 min-h-[400px] relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white opacity-50 z-0"></div>

          <div className="z-10 text-center">
            <h2 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-4">
              {isAnimating ? '抽籤中...' : winner ? '中獎者!' : '幸運抽籤'}
            </h2>

            <div className={`text-5xl md:text-7xl font-bold mb-8 transition-all duration-300 ${isAnimating ? 'scale-105 text-slate-400 blur-[1px]' : 'scale-100 text-slate-800'}`}>
              {currentDisplay}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={startDraw}
                disabled={isAnimating || availableCandidates.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-200 transition-all flex items-center gap-2 transform active:scale-95"
              >
                <Play className={`w-6 h-6 ${isAnimating ? 'animate-spin' : ''}`} />
                {isAnimating ? '抽出幸運兒...' : '開始抽籤'}
              </button>
            </div>

            {!allowRepeats && availableCandidates.length === 0 && names.length > 0 && (
              <p className="mt-4 text-amber-600 font-medium">所有人選都已被抽出！</p>
            )}
            {!allowRepeats && names.length === 0 && (
              <p className="mt-4 text-slate-400">請先在輸入頁面新增名單</p>
            )}
          </div>
        </div>

        {/* Settings Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={allowRepeats}
                  onChange={(e) => setAllowRepeats(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <span className="text-sm font-medium text-slate-700">允許重複中獎</span>
            </label>
          </div>

          <div className="text-sm text-slate-500">
            候選池: <span className="font-bold text-indigo-600">{availableCandidates.length}</span> / {names.length}
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full lg:max-h-[600px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            中獎紀錄
          </h3>
          {history.length > 0 && (
            <button
              onClick={resetHistory}
              className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              title="重置紀錄"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
          {history.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              <p className="text-sm">尚無中獎者</p>
            </div>
          ) : (
            history.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                  {history.length - index}
                </div>
                <div className="flex-1 font-medium text-slate-700">{item.value}</div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LotteryMode;
