import React, { useState, useEffect } from 'react';
import { View, WaterQualityRecord } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import Live from './components/Live';
import { getHistoricalData } from './services/firebaseService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.AI);
  const [waterData, setWaterData] = useState<WaterQualityRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  useEffect(() => {
    const loadHistoricalData = async () => {
      try {
        const historicalRecords = await getHistoricalData(100);
        setWaterData(historicalRecords);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu lịch sử:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadHistoricalData();
  }, []);

  const handleDataRefresh = (newData: WaterQualityRecord[]) => {
    setWaterData(newData);
  };

  const renderView = () => {
    if (isLoadingData) {
      return (
        <div className="bg-white p-10 rounded-2xl shadow-md text-center">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse [animation-delay:0.4s]"></div>
          </div>
          <p className="text-slate-500 mt-4">Đang tải dữ liệu...</p>
        </div>
      );
    }

    switch(currentView) {
      case View.Dashboard:
        return <Dashboard data={waterData} setData={setWaterData} />;
      case View.AI:
        return <AIChat data={waterData} onDataRefresh={handleDataRefresh} />;
      case View.Live:
        return <Live />;
      default:
        return <AIChat data={waterData} onDataRefresh={handleDataRefresh} />;
    }
  }

  return (
    <div className="bg-[#F0F7FF] min-h-screen text-slate-800">
      <div className="container mx-auto p-4 md:p-8">
        <Header currentView={currentView} setView={setCurrentView} />
        <main className="mt-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
