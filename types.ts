export enum View {
  Dashboard = 'DASHBOARD',
  AI = 'AI',
  Live = 'LIVE',
}

export interface WaterQualityRecord {
  id: string;
  timestamp: string;
  temperature: number; // Nhiệt độ (°C)
  turbidity: number;   // Độ đục (NTU)
  salinity: number;    // Độ mặn (ppt)
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
