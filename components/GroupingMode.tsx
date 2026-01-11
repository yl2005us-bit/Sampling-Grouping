import React, { useState } from 'react';
import { Users, Shuffle, Layers, Download, Divide } from 'lucide-react';
import { NameItem, GroupResult } from '../types';
import { shuffleArray } from '../utils/helpers';

interface GroupingModeProps {
  names: NameItem[];
}

type GroupMethod = 'BY_SIZE' | 'BY_COUNT';

const GroupingMode: React.FC<GroupingModeProps> = ({ names }) => {
  const [method, setMethod] = useState<GroupMethod>('BY_SIZE');
  const [inputValue, setInputValue] = useState<number>(3); // Acts as Size or Count depending on method
  const [groups, setGroups] = useState<GroupResult[]>([]);
  const [lastGenerated, setLastGenerated] = useState<number | null>(null);

  const generateGroups = () => {
    if (names.length === 0) return;

    const shuffled = shuffleArray<NameItem>(names);
    const newGroups: GroupResult[] = [];
    
    if (method === 'BY_SIZE') {
        const size = Math.max(1, Math.floor(inputValue));
        for (let i = 0; i < shuffled.length; i += size) {
            newGroups.push({
                id: newGroups.length + 1,
                members: shuffled.slice(i, i + size)
            });
        }
    } else {
        // By Count (Distribute evenly)
        const count = Math.max(1, Math.min(names.length, Math.floor(inputValue)));
        
        // Initialize groups
        for (let i = 0; i < count; i++) {
            newGroups.push({ id: i + 1, members: [] });
        }
        
        // Distribute like cards
        shuffled.forEach((person, index) => {
            newGroups[index % count].members.push(person);
        });
    }

    setGroups(newGroups);
    setLastGenerated(Date.now());
  };

  const downloadGroups = () => {
    if (groups.length === 0) return;
    
    let content = "組別,姓名\n";
    groups.forEach(group => {
      group.members.forEach(member => {
        content += `第 ${group.id} 組,${member.value}\n`;
      });
    });

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grouping_result_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
          {/* Method Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
             <button
               onClick={() => setMethod('BY_SIZE')}
               className={`px-3 py-1.5 rounded-md transition-all ${method === 'BY_SIZE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                依每組人數
             </button>
             <button
               onClick={() => setMethod('BY_COUNT')}
               className={`px-3 py-1.5 rounded-md transition-all ${method === 'BY_COUNT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                依總組數
             </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {method === 'BY_SIZE' ? '每組幾人' : '共分幾組'}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                    type="number"
                    min="1"
                    max={names.length || 100}
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    className="w-28 pl-9 pr-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-center font-medium"
                />
                <div className="absolute left-3 top-2.5 text-slate-400">
                    {method === 'BY_SIZE' ? <Users className="w-4 h-4"/> : <Divide className="w-4 h-4"/>}
                </div>
              </div>
              <span className="text-slate-500 text-sm">{method === 'BY_SIZE' ? '人 / 組' : '組'}</span>
            </div>
          </div>
          
          <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>

          <div className="text-sm text-slate-500">
            總人數: <span className="font-bold text-slate-800">{names.length}</span>
            {names.length > 0 && (
                <span className="ml-2 bg-slate-50 px-2 py-1 rounded text-slate-600">
                    {method === 'BY_SIZE' 
                        ? `預計分為 ${Math.ceil(names.length / Math.max(1, inputValue))} 組` 
                        : `平均每組約 ${Math.floor(names.length / Math.max(1, inputValue))} ~ ${Math.ceil(names.length / Math.max(1, inputValue))} 人`
                    }
                </span>
            )}
          </div>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <button
            onClick={generateGroups}
            disabled={names.length === 0}
            className="flex-1 lg:flex-none bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            產生分組
          </button>
          {groups.length > 0 && (
             <button
               onClick={downloadGroups}
               className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors flex items-center gap-2"
               title="下載 CSV"
             >
               <Download className="w-4 h-4" />
               <span className="hidden sm:inline">下載名單</span>
             </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {groups.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
            <Layers className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">準備分組</p>
            <p className="text-sm">設定條件後點擊產生</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            {groups.map((group, index) => (
              <div 
                key={`${group.id}-${lastGenerated}`}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">
                        {group.id}
                    </div>
                    第 {group.id} 組
                  </h3>
                  <span className="text-xs font-semibold text-slate-400 px-2 py-1 bg-white rounded border border-slate-200">
                    {group.members.length} 人
                  </span>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {group.members.map(member => (
                      <li key={member.id} className="flex items-center gap-2 text-slate-700 text-sm">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {member.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupingMode;
