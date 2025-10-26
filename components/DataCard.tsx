
import React from 'react';

interface DataCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
}

const DataCard: React.FC<DataCardProps> = ({ title, value, unit, icon }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-5">
      <div className="bg-slate-100 p-4 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-800">
          {value} <span className="text-xl font-medium text-slate-600">{unit}</span>
        </p>
      </div>
    </div>
  );
};

export default DataCard;
