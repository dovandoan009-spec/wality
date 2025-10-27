
import React, { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { WaterQualityRecord } from '../types';
import { SAMPLE_DATA } from '../constants';
import { TemperatureIcon, TurbidityIcon, SalinityIcon, WarningIcon, ChartIcon } from './icons/Icons';
import DataCard from './DataCard';
import DataChart from './DataChart';

// Make XLSX globally available from CDN
declare const XLSX: any;

interface DashboardProps {
  data: WaterQualityRecord[];
  setData: React.Dispatch<React.SetStateAction<WaterQualityRecord[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ data, setData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      // Assuming headers are: id, timestamp, temperature, turbidity, salinity
      const headers = jsonData[0] as string[];
      const parsedData: WaterQualityRecord[] = jsonData.slice(1).map((row: any[]) => ({
        id: String(row[0]),
        timestamp: String(row[1]),
        temperature: Number(row[2]),
        turbidity: Number(row[3]),
        salinity: Number(row[4]),
      }));
      
      setData(prevData => [...prevData, ...parsedData]);
    };
    reader.readAsBinaryString(file);
  };

  const latestRecord = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <ChartIcon className="w-6 h-6 text-blue-600" />
          Các Cổng ({data.length})
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-sm"
          >
            Thêm Dữ Liệu (Excel)
          </button>
          <button
            onClick={() => setData(SAMPLE_DATA)}
            className="w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300 shadow-sm"
          >
            Tạo Dữ Liệu Mẫu
          </button>
        </div>
      </div>

      {data.length > 0 && latestRecord ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DataCard
              title="Nhiệt độ"
              value={latestRecord.temperature.toFixed(1)}
              unit="°C"
              icon={<TemperatureIcon className="w-8 h-8 text-orange-500" />}
            />
            <DataCard
              title="Độ đục"
              value={latestRecord.turbidity.toFixed(1)*1000}
              unit="NTU"
              icon={<TurbidityIcon className="w-8 h-8 text-yellow-600" />}
            />
            <DataCard
              title="Độ mặn"
              value={latestRecord.salinity.toFixed(1)}
              unit="ppt"
              icon={<SalinityIcon className="w-8 h-8 text-cyan-500" />}
            />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Biểu đồ xu hướng</h2>
            <DataChart data={data} />
          </div>
        </>
      ) : (
        <div className="bg-white p-10 rounded-2xl shadow-md text-center">
          <WarningIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-700">Chưa có dữ liệu</h3>
          <p className="text-slate-500 mt-2">
            Nhấn "Tạo Dữ Liệu Mẫu" để thêm số liệu mẫu cho trạm này
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
