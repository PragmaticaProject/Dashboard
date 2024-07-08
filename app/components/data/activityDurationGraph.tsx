'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

interface ChartData {
  activityId: string;
  date: string;
  score: string;
  duration: string;
}

interface ActivityGraphProps {
  chartData: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip p-2 text-sm bg-white border rounded shadow-md">
          <p>{`Date: ${data.date}`}</p>
          <p>{`Score: ${data.score}`}</p>
          <p>{`Duration (s): ${data.duration}`}</p>
        </div>
      );
    }
  
    return null;
};

const ActivityDurationGraph: React.FC<ActivityGraphProps> = ({ chartData }) => {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis>
                        <Label value="Duration (seconds)" angle={-90} position="insideBottomLeft" />
                    </YAxis>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="duration" stroke="#4fb9af" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ActivityDurationGraph;