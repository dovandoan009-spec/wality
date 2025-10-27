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
        turbidity: (parseFloat(data.turbidity) || 0) / 1000,
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

const getLastSavedDate = async (): Promise<string | null> => {
  try {
    const lastSavedRef = ref(database, 'lastSavedDate');
    const snapshot = await get(lastSavedRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting last saved date:', error);
    return null;
  }
};

const setLastSavedDate = async (date: string): Promise<void> => {
  try {
    const lastSavedRef = ref(database, 'lastSavedDate');
    await set(lastSavedRef, date);
  } catch (error) {
    console.error('Error setting last saved date:', error);
  }
};

export const saveWaterQualityData = async (record: Omit<WaterQualityRecord, 'id'>): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const lastSaved = await getLastSavedDate();

    if (lastSaved === today) {
      console.log(`Đã lưu dữ liệu hôm nay (${today}). Bỏ qua lần lưu này.`);
      return false;
    }

    const historyRef = ref(database, 'waterQualityHistory');
    const newRecordRef = push(historyRef);

    const dataToSave = {
      ...record,
      id: newRecordRef.key,
      savedAt: new Date().toISOString(),
      date: today,
    };

    await set(newRecordRef, dataToSave);
    await setLastSavedDate(today);

    console.log(`Đã lưu dữ liệu mới cho ngày ${today}`);
    return true;
  } catch (error) {
    console.error('Error saving water quality data:', error);
    throw error;
  }
};

export const getHistoricalData = async (limit: number = 100): Promise<WaterQualityRecord[]> => {
  try {
    const historyRef = ref(database, 'waterQualityHistory');
    const snapshot = await get(historyRef);

    if (!snapshot.exists()) {
      console.log('Không có dữ liệu trong Firebase History');
      return [];
    }

    const data = snapshot.val();
    console.log('Dữ liệu thô từ Firebase:', data);

    const records: WaterQualityRecord[] = [];

    Object.keys(data).forEach(key => {
      const item = data[key];
      console.log('Item từ Firebase:', item);

      if (item && typeof item === 'object') {
        records.push({
          id: item.id || key,
          timestamp: item.timestamp || 'N/A',
          temperature: parseFloat(item.temperature) || 0,
          turbidity: (parseFloat(item.turbidity) || 0),
          salinity: parseFloat(item.salinity) || 0,
        });
      }
    });

    records.sort((a, b) => {
      return 0;
    });

    const limitedRecords = records.slice(-limit);
    console.log(`Đã tải ${limitedRecords.length} bản ghi từ Firebase`);
    console.log('Bản ghi đầu tiên:', limitedRecords[0]);
    console.log('Bản ghi cuối cùng:', limitedRecords[limitedRecords.length - 1]);

    return limitedRecords;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    console.error('Chi tiết lỗi:', error);
    return [];
  }
};
