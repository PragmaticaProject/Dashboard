'use client';

import { useEffect, useState } from 'react';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    name: string;
    date: string;
    score: number;
    targetsHit: number;
    targetsMissed: number;
}

export default function WeeklyPerformanceGraph() {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `prod/users/${userId}/sessions`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");
                        const newData: ChartData[] = [];

                        Object.keys(snapshot.val()).forEach((sessionKey: string) => { // iterate through sessions
                            const session = snapshot.val()[sessionKey];
                            const activities = session['activities'] as Record<string, any>;

                            Object.keys(activities).forEach((activityKey: string) => { // iterate through activities
                                const activity = activities[activityKey];
                                const states = activity['states'] as Record<string, any>;
                                
                                const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                                const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                const daysDiff = Math.round((Date.now() - activityDate.getTime()) / (1000 * 3600 * 24));

                                if (daysDiff < 8) {
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
                                        name: activityKey,
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