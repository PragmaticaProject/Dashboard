"use client";

import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

interface ChartData {
    date: string;
    count: number;
}

export default function YearlyUsageGraph() {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    
    const labels: string[] = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const today = new Date();
    let currentMonth = today.getMonth();

    for (let i = 11; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        labels.push(monthNames[monthIndex]);
    }

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

                        Object.keys(snapshot.val()).forEach((activityName: string) => {
                            Object.keys(snapshot.val()[activityName]).forEach((activityKey: string) => {
                                const activity = snapshot.val()[activityName][activityKey];
    
                                const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                                const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                const daysDiff = Math.round((Date.now() - activityDate.getTime()) / (1000 * 3600 * 24));
                                
                                if (daysDiff < 31) {
                                    newData[11].count += 1;
                                } else if (daysDiff < 59) {
                                    newData[10].count += 1;
                                } else if (daysDiff < 90) {
                                    newData[9].count += 1;
                                } else if (daysDiff < 120) {
                                    newData[8].count += 1;
                                } else if (daysDiff < 151) {
                                    newData[7].count += 1;
                                } else if (daysDiff < 181) {
                                    newData[6].count += 1;
                                } else if (daysDiff < 212) {
                                    newData[5].count += 1;
                                } else if (daysDiff < 243) {
                                    newData[4].count += 1;
                                } else if (daysDiff < 273) {
                                    newData[3].count += 1;
                                } else if (daysDiff < 304) {
                                    newData[2].count += 1;
                                } else if (daysDiff < 334) {
                                    newData[1].count += 1;
                                } else if (daysDiff < 365) {
                                    newData[0].count += 1;
                                }
                            });
    
                            setChartData(newData);
                        });
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
                    <YAxis>
                        <Label value="# of activities" angle={-90} position="insideLeft" />
                    </YAxis>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#4fb9af" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
