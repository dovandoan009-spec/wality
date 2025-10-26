import { ref, onValue, off, DatabaseReference } from 'firebase/database';
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
