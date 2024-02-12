"use client";

import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function YearlyUsageGraph() {
    const labels = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6", "Month 7", "Month 8", "Month 9", "Month 10", "Month 11", "Month 12"];
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `prod/users/${userId}/sessions`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");

                        const newData = labels.map((label, index) => ({
                            date: label,
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
