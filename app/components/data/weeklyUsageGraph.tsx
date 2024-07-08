"use client";

import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

interface ChartData {
    day: string;
    count: number;
} 

export default function WeeklyUsageGraph() {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const labels = [
        convertWeekdayToLabel(6), 
        convertWeekdayToLabel(5), 
        convertWeekdayToLabel(4), 
        convertWeekdayToLabel(3), 
        convertWeekdayToLabel(2), 
        convertWeekdayToLabel(1), 
        convertWeekdayToLabel(0), 
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `prod/activities/history/${userId}`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");

                        const newData: ChartData[] = labels.map((label) => ({
                            day: label,
                            count: 0,
                        }));

                        Object.keys(snapshot.val()).forEach((activityKey: string) => {
                            const activity = snapshot.val()[activityKey];

                            const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                            const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            const daysDiff = Math.floor((Date.now() - activityDate.getTime()) / (1000 * 3600 * 24));

                            if (daysDiff < 7) {
                                newData[6 - daysDiff].count += 1;
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
                    <XAxis dataKey="day" />
                    <YAxis>
                        <Label value="# of activities" angle={-90} position="inside" />
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

function convertWeekdayToLabel(day: number) {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - day);

    const outputString = dateObj.toLocaleString('default', {
        month: 'short',
        day: 'numeric',
    });
    return outputString;
}
