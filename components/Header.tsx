import React from 'react';
import { View } from '../types';
import { WaterDropIcon, DashboardIcon, AIIcon, LiveIcon } from './icons/Icons';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const commonButtonClasses = "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F0F7FF]";
  const inactiveButtonClasses = "bg-white text-gray-600 hover:bg-gray-100";

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <WaterDropIcon className="h-12 w-12 text-[#4A6CFD]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Hệ Thống Giám Sát Chất Lượng Nước
          </h1>
          <p className="text-slate-500">
            Tỉnh Vĩnh Long - Giám sát và cảnh báo xâm nhập mặn
          </p>
        </div>
      </div>
      <nav className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-md">
        <button
          onClick={() => setView(View.Dashboard)}
          className={`${commonButtonClasses} ${currentView === View.Dashboard ? 'bg-[#4A6CFD] text-white shadow-lg' : inactiveButtonClasses}`}
        >
          <DashboardIcon className="h-5 w-5" />
          Dashboard
        </button>
        <button
          onClick={() => setView(View.Live)}
          className={`${commonButtonClasses} ${currentView === View.Live ? 'bg-red-500 text-white shadow-lg' : inactiveButtonClasses}`}
        >
          <LiveIcon className="h-5 w-5" />
          Thời Gian Thực
        </button>
        <button
          onClick={() => setView(View.AI)}
          className={`${commonButtonClasses} ${currentView === View.AI ? 'bg-purple-600 text-white shadow-lg' : inactiveButtonClasses}`}
        >
          <AIIcon className="h-5 w-5" />
          Tư Vấn AI
        </button>
      </nav>
    </header>
  );
};

export default Header;
