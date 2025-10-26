import React, { useState, useEffect } from 'react';
import { WaterQualityRecord } from '../types';
import { subscribeToLiveData, saveWaterQualityData } from '../services/firebaseService';
import DataCard from './DataCard';
import DataChart from './DataChart';
import { TemperatureIcon, TurbidityIcon, SalinityIcon, LiveIcon } from './icons/Icons';

const MAX_DATA_POINTS = 20;
const SAVE_INTERVAL = 60000;

const Live: React.FC = () => {
  const [liveData, setLiveData] = useState<WaterQualityRecord[]>([]);
  const [lastSavedTime, setLastSavedTime] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = subscribeToLiveData(async (newRecord) => {
      setLiveData(prevData => {
        const newData = [...prevData, newRecord];
        if (newData.length > MAX_DATA_POINTS) {
          return newData.slice(newData.length - MAX_DATA_POINTS);
        }
        return newData;
      });

      const now = Date.now();
      if (now - lastSavedTime >= SAVE_INTERVAL) {
        try {
          await saveWaterQualityData({
            timestamp: newRecord.timestamp,
            temperature: newRecord.temperature,
            turbidity: newRecord.turbidity,
            salinity: newRecord.salinity,
          });
          setLastSavedTime(now);
          console.log('Đã lưu dữ liệu vào Firebase');
        } catch (error) {
          console.error('Lỗi khi lưu dữ liệu:', error);
        }
      }
    });

    return () => unsubscribe();
  }, [lastSavedTime]);

  const latestRecord = liveData.length > 0 ? liveData[liveData.length - 1] : null;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LiveIcon className="w-6 h-6 text-red-500" />
          Dữ Liệu Thời Gian Thực
        </h2>
        <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-green-600 font-semibold">Đang kết nối</span>
        </div>
      </div>

      {latestRecord ? (
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
              value={latestRecord.turbidity.toFixed(1)}
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
            <h2 className="text-xl font-bold mb-4">Biểu đồ trực tiếp</h2>
            <DataChart data={liveData} />
          </div>
        </>
      ) : (
        <div className="bg-white p-10 rounded-2xl shadow-md text-center">
          <div className="flex justify-center items-center space-x-2">
             <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
             <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse [animation-delay:0.2s]"></div>
             <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse [animation-delay:0.4s]"></div>
          </div>
          <p className="text-slate-500 mt-4">
            Đang chờ dữ liệu đầu tiên từ trạm...
          </p>
        </div>
      )}
    </div>
  );
};

export default Live;
