"use client";

import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    day: string;
    count: number;
} 

export default function WeeklyUsageGraph() {
    const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
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

                        const newData: ChartData[] = labels.map((label, index) => ({
                            day: label,
                            count: 0,
                        }));

                        Object.keys(snapshot.val()).forEach((sessionKey: string) => {
                            const session = snapshot.val()[sessionKey];
                            const activities = session['activities'] as Record<string, any>;

                            Object.keys(activities).forEach((activityKey: string) => {
                                const activity = activities[activityKey];
                                const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                                const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                const daysDiff = Math.round((Date.now() - activityDate.getTime()) / (1000 * 3600 * 24));

                                if (daysDiff < 7) {
                                    newData[6 - daysDiff].count += 1;
                                }
                            });
                        });
                        
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
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
