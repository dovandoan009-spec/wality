
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WaterQualityRecord } from '../types';

interface DataChartProps {
  data: WaterQualityRecord[];
}

const DataChart: React.FC<DataChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          
         
          <Line type="monotone" dataKey="salinity" name="Độ mặn (ppt)" stroke="#06b6d4" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataChart;
