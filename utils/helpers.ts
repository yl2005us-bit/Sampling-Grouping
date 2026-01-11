import { NameItem } from '../types';

export const MOCK_NAMES = [
  "陳小明", "林美華", "張志強", "李淑芬", "王建國", 
  "吳雅婷", "劉冠宇", "蔡欣怡", "楊家豪", "許雅雯", 
  "鄭志偉", "謝佳穎", "洪志明", "郭怡君", "曾國華", 
  "邱佩珊", "廖志強", "賴俊宏", "徐淑惠", "周建志"
];

// Fisher-Yates Shuffle
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const parseCSV = (text: string): string[] => {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0); // Remove empty lines
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
