'use client';

import { useEffect, useState } from 'react';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    name: string;
    date: string; // User-friendly date
    sortableDate: string; // Sortable date format
    score: string;
    tokens: string;
}

export default function WeeklyPerformanceGraph() {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `prod/activities/history/${userId}`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");
                        const rawData: ChartData[] = Object.keys(snapshot.val()).map((activityKey: string) => {
                            const activity = snapshot.val()[activityKey];
    
                            const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                            const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
                            return {
                                name: activity['name'],
                                date: activityDate.toLocaleString('default', { month: 'short', day: 'numeric' }),
                                sortableDate: activityDate.toISOString().substring(0, 10), // YYYY-MM-DD
                                score: activity['score'],
                                tokens: activity['tokensAdded']
                            };
                        }).filter(activity => {
                            const daysDiff = Math.round((new Date().getTime() - new Date(activity.sortableDate).getTime()) / (1000 * 3600 * 24));
                            return daysDiff < 8;
                        });

                        // Sort rawData based on sortableDate
                        const sortedData = rawData.sort((a, b) => a.sortableDate.localeCompare(b.sortableDate));

                        setChartData(sortedData);
                    } else {
                        console.log("No data available");
                    }
                } else {
                    console.log("user not found.");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="date" />
                        <YAxis />
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
          <p>{`Name: ${data.name}`}</p>
          <p>{`Date: ${data.date}`}</p>
          <p>{`Score: ${data.score}`}</p>
          <p>{`Targets Hit: ${data.targetsHit}`}</p>
          <p>{`Targets Missed: ${data.targetsMissed}`}</p>
        </div>
      );
    }
  
    return null;
};