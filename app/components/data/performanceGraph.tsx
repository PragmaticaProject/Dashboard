'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

interface ChartData {
    name: string;
    date: string;
    score: string;
    tokens: string;
}

export default function PerformanceGraph({ history }: { history: Record<string, Record<string, any>> | null }) {
    const chartData = useMemo<ChartData[]>(() => {
        if (!history) return [];
        const newData: ChartData[] = [];
        Object.keys(history).forEach((activityName: string) => {
            Object.keys(history[activityName]).forEach((activityKey: string) => {
                const activity = history[activityName][activityKey];
                const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                const activityLabel = activityDate.toLocaleString('default', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
                newData.push({
                    name: activity['name'],
                    date: activityLabel,
                    score: activity['score'],
                    tokens: activity['tokensAdded']
                });
            });
        });
        newData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return newData;
    }, [history]);

    return (
        <div>
            {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="date" />
                        <YAxis>
                            <Label value="Score" angle={-90} position="insideLeft" />
                        </YAxis>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip p-2 text-sm bg-white border rounded shadow-md">
          <p>{`Name: ${data.name.replace(/([A-Z0-9])/g, ' $1').trim()}`}</p>
          <p>{`Date: ${data.date}`}</p>
          <p>{`Score: ${data.score}`}</p>
          <p>{`Tokens Added: ${data.tokens}`}</p>
        </div>
      );
    }
  
    return null;
};