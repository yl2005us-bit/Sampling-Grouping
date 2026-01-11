export interface NameItem {
  id: string;
  value: string;
}

export enum AppMode {
  INPUT = 'INPUT',
  LOTTERY = 'LOTTERY',
  GROUPING = 'GROUPING',
}

export interface GroupResult {
  id: number;
  members: NameItem[];
}