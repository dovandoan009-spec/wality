import { GoogleGenAI } from "@google/genai";
import { WaterQualityRecord } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const SYSTEM_INSTRUCTION = `Bạn là một trợ lý AI chuyên gia về giám sát chất lượng nước tại tỉnh Vĩnh Long, Việt Nam. 
Nhiệm vụ của bạn là phân tích dữ liệu về nhiệt độ, độ đục, và độ mặn. 
Dựa vào dữ liệu được cung cấp, hãy đưa ra những phân tích, cảnh báo, dự đoán và khuyến nghị hữu ích. 
Luôn trả lời bằng tiếng Việt một cách rõ ràng và chuyên nghiệp. 
Khi được yêu cầu dự đoán, hãy cung cấp dự đoán cho 1 tuần, 1 tháng và 1 năm nếu không có khoảng thời gian cụ thể nào được yêu cầu.`;

export const getAIResponse = async (
  prompt: string,
  data: WaterQualityRecord[]
): Promise<string> => {
  try {
    if (!ai) {
      return "Chức năng AI chưa được cấu hình. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env để sử dụng tính năng này.";
    }

    const dataInfo = data.length > 0
      ? `Có ${data.length} bản ghi dữ liệu chất lượng nước.\n\nDữ liệu gần nhất:\n${JSON.stringify(data.slice(-10), null, 2)}\n\nTóm tắt:\n- Nhiệt độ: Trung bình ${(data.reduce((sum, d) => sum + d.temperature, 0) / data.length).toFixed(1)}°C\n- Độ đục: Trung bình ${(data.reduce((sum, d) => sum + d.turbidity, 0) / data.length).toFixed(1)} NTU\n- Độ mặn: Trung bình ${(data.reduce((sum, d) => sum + d.salinity, 0) / data.length).toFixed(1)} ppt`
      : "Hiện không có dữ liệu lịch sử.";

    const fullPrompt = `
      Dưới đây là dữ liệu chất lượng nước từ hệ thống giám sát:
      ${dataInfo}

      Yêu cầu của người dùng: "${prompt}"

      Hãy phân tích chi tiết và trả lời yêu cầu này dựa trên dữ liệu thực tế đã được thu thập.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    return "Rất tiếc, đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.";
  }
};