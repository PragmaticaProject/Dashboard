"use client";

import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    date: string;
    count: number;
}

export default function MonthlyUsageGraph() {
    const labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
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

                        const newData: ChartData[] = labels.map((label, index) => ({
                            date: label,
                            count: 0,
                        }));

                        Object.keys(snapshot.val()).forEach((activityKey: string) => {
                            const activity = snapshot.val()[activityKey];

                            const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                            const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            const daysDiff = Math.round((Date.now() - activityDate.getTime()) / (1000 * 3600 * 24));

                            if (daysDiff < 8) {
                                newData[3].count += 1;
                            } else if (daysDiff < 15) {
                                newData[2].count += 1;
                            } else if (daysDiff < 22) {
                                newData[1].count += 1;
                            } else if (daysDiff < 31) {
                                newData[0].count += 1;
                            }
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
                    <XAxis dataKey="date" />
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
