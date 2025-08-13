"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

interface ChartData {
    date: string;
    count: number;
}

export default function MonthlyMinutesPlayedGraph({ history }: { history: Record<string, Record<string, any>> | null }) {
    const labels = ["Week 1", "Week 2", "Week 3", "Week 4"];

    const chartData = useMemo<ChartData[]>(() => {
        const base: ChartData[] = labels.map((label) => ({ date: label, count: 0 }));
        if (!history) return base;

        Object.keys(history).forEach((activityName: string) => {
            Object.keys(history[activityName]).forEach((activityKey: string) => {
                const activity = history[activityName][activityKey];
                const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                const daysDiff = Math.round((Date.now() - activityDate.getTime()) / (1000 * 3600 * 24));
                if (daysDiff < 8) {
                    base[3].count += parseInt(activity["duration"]);
                } else if (daysDiff < 15) {
                    base[2].count += parseInt(activity["duration"]);
                } else if (daysDiff < 22) {
                    base[1].count += parseInt(activity["duration"]);
                } else if (daysDiff < 31) {
                    base[0].count += parseInt(activity["duration"]);
                }
            });
        });
        return base;
    }, [history]);

    return (
        <div>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis>
                        <Label value="# of minutes" angle={-90} position="insideLeft" />
                    </YAxis>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#FFA500" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
