import { ref, onValue, off, DatabaseReference, push, set, query, orderByChild, limitToLast, get } from 'firebase/database';
import { database } from '../config/firebase';
import { WaterQualityRecord } from '../types';

export const subscribeToLiveData = (callback: (record: WaterQualityRecord) => void) => {
  const dataRef: DatabaseReference = ref(database, 'waterQuality');

  const handleData = (snapshot: any) => {
    const data = snapshot.val();
    if (data) {
      const record: WaterQualityRecord = {
        id: data.id || `live_${Date.now()}`,
        timestamp: data.timestamp || new Date().toLocaleTimeString('vi-VN'),
        temperature: parseFloat(data.temperature) || 0,
        turbidity: parseFloat(data.turbidity) || 0,
        salinity: parseFloat(data.salinity) || 0,
      };
      callback(record);
    }
  };

  onValue(dataRef, handleData);

  return () => {
    off(dataRef, 'value', handleData);
  };
};

export const unsubscribeFromLiveData = () => {
  const dataRef = ref(database, 'waterQuality');
  off(dataRef);
};

export const saveWaterQualityData = async (record: Omit<WaterQualityRecord, 'id'>): Promise<void> => {
  try {
    const historyRef = ref(database, 'waterQualityHistory');
    const newRecordRef = push(historyRef);

    const dataToSave = {
      ...record,
      id: newRecordRef.key,
      savedAt: new Date().toISOString(),
    };

    await set(newRecordRef, dataToSave);
  } catch (error) {
    console.error('Error saving water quality data:', error);
    throw error;
  }
};

export const getHistoricalData = async (limit: number = 100): Promise<WaterQualityRecord[]> => {
  try {
    const historyRef = ref(database, 'waterQualityHistory');
    const historyQuery = query(historyRef, orderByChild('savedAt'), limitToLast(limit));

    const snapshot = await get(historyQuery);

    if (!snapshot.exists()) {
      console.log('Không có dữ liệu trong Firebase History');
      return [];
    }

    const data = snapshot.val();
    const records: WaterQualityRecord[] = [];

    Object.keys(data).forEach(key => {
      const item = data[key];
      records.push({
        id: item.id || key,
        timestamp: item.timestamp,
        temperature: parseFloat(item.temperature) || 0,
        turbidity: parseFloat(item.turbidity) || 0,
        salinity: parseFloat(item.salinity) || 0,
      });
    });

    records.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB;
    });

    console.log(`Đã tải ${records.length} bản ghi từ Firebase`);
    return records;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};
