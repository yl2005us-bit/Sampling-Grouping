import React, { useState, useRef, useMemo } from 'react';
import { Upload, Trash2, Users, FileText, Plus, AlertCircle, Wand2 } from 'lucide-react';
import { NameItem } from '../types';
import { generateId, parseCSV, MOCK_NAMES } from '../utils/helpers';

interface InputSectionProps {
  names: NameItem[];
  setNames: (names: NameItem[]) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ names, setNames }) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Identify duplicates
  const duplicateValues = useMemo(() => {
    const counts: Record<string, number> = {};
    names.forEach(n => {
      counts[n.value] = (counts[n.value] || 0) + 1;
    });
    return Object.keys(counts).filter(key => counts[key] > 1);
  }, [names]);

  const handleManualAdd = () => {
    if (!inputText.trim()) return;
    
    // Split by new lines or commas if pasted
    const newEntries = inputText
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newItems: NameItem[] = newEntries.map(name => ({
      id: generateId(),
      value: name
    }));

    setNames([...names, ...newItems]);
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rawNames = parseCSV(text);
      const newItems: NameItem[] = rawNames.map(name => ({
        id: generateId(),
        value: name
      }));
      setNames([...names, ...newItems]);
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddMockData = () => {
    const newItems: NameItem[] = MOCK_NAMES.map(name => ({
      id: generateId(),
      value: name
    }));
    setNames([...names, ...newItems]);
  };

  const removeDuplicates = () => {
    const uniqueMap = new Map();
    const uniqueItems: NameItem[] = [];
    
    names.forEach(item => {
      if (!uniqueMap.has(item.value)) {
        uniqueMap.set(item.value, true);
        uniqueItems.push(item);
      }
    });
    
    setNames(uniqueItems);
  };

  const clearAll = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      setNames([]);
    }
  };

  const removeName = (id: string) => {
    setNames(names.filter(n => n.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Area */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            新增參與者
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            請貼上名單（每行一個姓名）或上傳 CSV 檔案。
          </p>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="陳小明&#10;林美華&#10;張志強..."
          className="w-full flex-1 min-h-[150px] p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none font-mono text-sm"
        />

        <div className="grid grid-cols-2 gap-3">
           <button
            onClick={handleAddMockData}
            className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded-lg border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            載入範例名單 (20人)
          </button>
          
          <button
            onClick={handleManualAdd}
            disabled={!inputText.trim()}
            className="col-span-2 sm:col-span-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            加入名單
          </button>
          
          <input
            type="file"
            accept=".csv,.txt"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="col-span-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            上傳 CSV 檔案
          </button>
        </div>
      </div>

      {/* List Preview */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full max-h-[600px] lg:max-h-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            目前名單
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
              {names.length} 人
            </span>
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
             {duplicateValues.length > 0 && (
              <button
                onClick={removeDuplicates}
                className="flex-1 sm:flex-none text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 text-xs font-bold flex items-center justify-center gap-1 px-3 py-1.5 rounded transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                移除重複 ({names.length - names.length + duplicateValues.length > 0 ? '多筆' : ''})
              </button>
            )}
            {names.length > 0 && (
              <button
                onClick={clearAll}
                className="flex-1 sm:flex-none text-red-500 hover:text-red-600 text-xs font-medium flex items-center justify-center gap-1 px-3 py-1.5 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                清空
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-2">
          {names.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Users className="w-12 h-12 mb-2 opacity-20" />
              <p>尚未新增任何名單</p>
            </div>
          ) : (
            names.map((name) => {
               const isDuplicate = duplicateValues.includes(name.value);
               return (
                <div
                    key={name.id}
                    className={`flex justify-between items-center p-3 rounded-lg group transition-colors border ${
                        isDuplicate 
                        ? 'bg-amber-50 border-amber-200 hover:bg-amber-100' 
                        : 'bg-slate-50 border-transparent hover:bg-indigo-50 hover:border-indigo-100'
                    }`}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`font-medium truncate ${isDuplicate ? 'text-amber-700' : 'text-slate-700'}`}>
                            {name.value}
                        </span>
                        {isDuplicate && (
                            <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
                                重複
                            </span>
                        )}
                    </div>
                    <button
                    onClick={() => removeName(name.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1"
                    >
                    <Trash2 className="w-4 h-4" />
                    </button>
                </div>
               )
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default InputSection;
