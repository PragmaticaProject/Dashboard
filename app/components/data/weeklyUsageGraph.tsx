"use client";

import { useEffect } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function WeeklyUsageGraph() {
    
    var countData = [0, 0, 0, 0, 0, 0, 0];
    var chartData = [
        {day: "Day 1", count: countData[0]},
        {day: "Day 2", count: countData[1]},
        {day: "Day 3", count: countData[2]},
        {day: "Day 4", count: countData[3]},
        {day: "Day 5", count: countData[4]},
        {day: "Day 6", count: countData[5]},
        {day: "Day 7", count: countData[6]}
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `pilot/users/${userId}/sessions`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");

                        Object.keys(snapshot.val()).forEach((sessionKey: string) => {
                            const session = snapshot.val()[sessionKey];
                            const activities = session['activities'] as Record<string, any>;

                            Object.keys(activities).forEach((activityKey: string) => {
                                const activity = activities[activityKey];
                                const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                                const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                const daysDiff = Math.round((Date.now() - activityDate.getTime()) / (1000 * 3600 * 24));
                                console.log("date: " + activityDate.toDateString() + ", daysDiff: " + daysDiff);
                                if (daysDiff < 7) {
                                    countData[6 - daysDiff] += 1;
                                }
                            });
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
