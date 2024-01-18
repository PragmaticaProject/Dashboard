'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    date: string;
    score: number;
    targetsHit: number;
    targetsMissed: number;
}

export default function Page() {
    const activityName = useSearchParams().get('activityName');
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const snapshot = await get(child(ref(database), `pilot/users/${user.uid}/sessions`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");
                        const newData: ChartData[] = [];

                        Object.keys(snapshot.val()).forEach((sessionKey: string) => { // iterate through sessions
                            const session = snapshot.val()[sessionKey];
                            const activities = session['activities'] as Record<string, any>;

                            Object.keys(activities).forEach((activityKey: string) => { // iterate through activities
                                const activity = activities[activityKey];

                                if (activityKey === activityName) {
                                    const states = activity['states'] as Record<string, any>;
                                    
                                    const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                                    const activityDate = new Date(year, month, day);
                                    const activityLabel = activityDate.toLocaleString('default', {
                                        month: 'short',
                                        day: 'numeric',
                                    });

                                    var activityTargetsHit = 0;
                                    var activityTargetsMissed = 0;

                                    Object.keys(states).forEach((stateKey: string) => {
                                        const state = states[stateKey] as Record<string, any>;
                                        const stateTags = state['stateTags'];

                                        if (stateTags.includes("TargetHit")) {
                                            activityTargetsHit += 1;
                                        }

                                        if (stateTags.includes("TargetMissed")) {
                                            activityTargetsMissed += 1;
                                        }
                                    });

                                    const activityScore = Math.round((activityTargetsHit / (activityTargetsHit + activityTargetsMissed)) * 100);
                                    console.log("name: " + activityLabel + ", score: " + activityScore);
                                    newData.push({
                                        date: activityLabel,
                                        score: activityScore,
                                        targetsHit: activityTargetsHit,
                                        targetsMissed: activityTargetsMissed
                                    });
                                }
                            });
                        });

                        // Set the newData array as the chartData state
                        setChartData(newData);
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

        if (activityName) {
            fetchData();
        }
    });

    return (
        <div className="p-8 space-y-6">
            <div className="text-xl font-bold text-center">
                <h1>{activityName}</h1>
            </div>
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
            <div>
                <table className="min-w-full bg-white border border-gray-300 shadow rounded">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 border-b">Date</th>
                            <th className="py-2 px-4 border-b">Score</th>
                            <th className="py-2 px-4 border-b">Targets Hit</th>
                            <th className="py-2 px-4 border-b">Targets Missed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.map((dataPoint, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                <td className="py-2 px-4 border-b text-center">{dataPoint.date}</td>
                                <td className="py-2 px-4 border-b text-center">{dataPoint.score}</td>
                                <td className="py-2 px-4 border-b text-center">{dataPoint.targetsHit}</td>
                                <td className="py-2 px-4 border-b text-center">{dataPoint.targetsMissed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip p-2 text-sm bg-white border rounded shadow-md">
          <p>{`Date: ${data.date}`}</p>
          <p>{`Score: ${data.score}`}</p>
          <p>{`Targets Hit: ${data.targetsHit}`}</p>
          <p>{`Targets Missed: ${data.targetsMissed}`}</p>
        </div>
      );
    }
  
    return null;
};