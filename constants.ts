import { WaterQualityRecord, ChatMessage } from './types';

export const SAMPLE_DATA: WaterQualityRecord[] = [
  { id: '1', timestamp: '2025-10-15', temperature: 28.5, turbidity: 4.2, salinity: 0.1 },
  { id: '2', timestamp: '2025-10-15', temperature: 28.7, turbidity: 4.5, salinity: 0.3 },
  { id: '3', timestamp: '2025-10-15', temperature: 29.0, turbidity: 4.1, salinity: 0.2 },
  { id: '4', timestamp: '2025-10-15', temperature: 28.8, turbidity: 5.0, salinity: 0.2 },
  { id: '5', timestamp: '2025-10-15', temperature: 29.1, turbidity: 4.8, salinity: 0.15 },
  { id: '6', timestamp: '2025-10-15', temperature: 29.2, turbidity: 5.2, salinity: 0.3 },
  { id: '7', timestamp: '2025-10-15', temperature: 28.9, turbidity: 4.9, salinity: 0.17 },
];

export const INITIAL_CHAT_MESSAGE: ChatMessage = {
  role: 'model',
  content: `Xin chào, tôi là trợ lý AI giám sát chất lượng nước.
  \nTôi có thể giúp bạn:
  \n- Phân tích và dự đoán xu hướng chất lượng nước
  \n- Cảnh báo về nhiễm mặn và các vấn đề
  \n- Tư vấn về độ mặn, độ đục, độ dẫn điện
  \n- Đưa ra khuyến nghị xử lý
  \nHãy hỏi tôi bất cứ điều gì về chất lượng nước tại tỉnh Vĩnh Long!`,
  timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
};

export const SUGGESTED_PROMPTS: string[] = [
  'Dự đoán độ mặn dựa vào độ mặn đo được mới nhất',
  'Độ mặn hiện tại',
  'Nguy cơ nhiễm mặn',
  'Dự đoán độ mặn trong 1 tuần tới',
];