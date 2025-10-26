import React, { useState } from 'react';
import { View, WaterQualityRecord } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import Live from './components/Live';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.AI);
  const [waterData, setWaterData] = useState<WaterQualityRecord[]>([]);

  const renderView = () => {
    switch(currentView) {
      case View.Dashboard:
        return <Dashboard data={waterData} setData={setWaterData} />;
      case View.AI:
        return <AIChat data={waterData} />;
      case View.Live:
        return <Live />;
      default:
        return <AIChat data={waterData} />;
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
