
import React, { useState, useRef, useEffect } from 'react';
import { WaterQualityRecord, ChatMessage } from '../types';
import { INITIAL_CHAT_MESSAGE, SUGGESTED_PROMPTS } from '../constants';
import { AIIcon, PredictionIcon, SendIcon } from './icons/Icons';
import { getAIResponse } from '../services/geminiService';
import { getHistoricalData } from '../services/firebaseService';

interface AIChatProps {
  data: WaterQualityRecord[];
  onDataRefresh?: (newData: WaterQualityRecord[]) => void;
}

const AIChat: React.FC<AIChatProps> = ({ data, onDataRefresh }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_CHAT_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localData, setLocalData] = useState<WaterQualityRecord[]>(data);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const refreshData = async () => {
    setIsRefreshing(true);
    console.log('Bắt đầu tải dữ liệu từ Firebase...');
    try {
      const freshData = await getHistoricalData(100);
      console.log('Dữ liệu nhận được:', freshData);
      setLocalData(freshData);
      if (onDataRefresh) {
        onDataRefresh(freshData);
      }

      const refreshMessage: ChatMessage = {
        role: 'model',
        content: `Đã cập nhật dữ liệu mới nhất!\n\nSố bản ghi: ${freshData.length}\n\n${freshData.length > 0 ? `Dữ liệu gần nhất:\n- Nhiệt độ: ${freshData[freshData.length - 1].temperature}°C\n- Độ đục: ${freshData[freshData.length - 1].turbidity*1000} NTU\n- Độ mặn: ${freshData[freshData.length - 1].salinity} ppt\n- Thời gian: ${freshData[freshData.length - 1].timestamp}` : 'Chưa có dữ liệu trong Firebase.'}`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, refreshMessage]);
    } catch (error) {
      console.error('Lỗi khi làm mới dữ liệu:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: `Không thể tải dữ liệu mới.\n\nLỗi: ${error}\n\nVui lòng kiểm tra:\n1. Kết nối Firebase\n2. Console log để xem chi tiết`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSend = async (prompt?: string) => {
    const userMessageContent = prompt || input;
    if (!userMessageContent.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: userMessageContent,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponseContent = await getAIResponse(userMessageContent, localData);
      const aiMessage: ChatMessage = {
        role: 'model',
        content: aiResponseContent,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: ChatMessage = {
          role: 'model',
          content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-4xl mx-auto overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <AIIcon className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-bold">Tư Vấn AI</h2>
            <p className="text-xs text-white/80 mt-0.5">{localData.length} bản ghi dữ liệu</p>
          </div>
        </div>
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
          <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới dữ liệu
        </button>
      </div>

      <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0"></div>}
            <div className={`max-w-md p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none shadow-sm'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="text-xs mt-2 block opacity-70 text-right">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0"></div>
                <div className="max-w-md p-4 rounded-2xl bg-white text-slate-700 rounded-bl-none shadow-sm flex items-center">
                    <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button key={i} onClick={() => handleSend(prompt)} disabled={isLoading} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-slate-200 transition-colors disabled:opacity-50">
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Hỏi tôi về chất lượng nước..."
            className="w-full bg-slate-100 border-transparent focus:ring-2 focus:ring-purple-400 focus:border-transparent rounded-lg py-3 px-4 transition"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading}
            className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
