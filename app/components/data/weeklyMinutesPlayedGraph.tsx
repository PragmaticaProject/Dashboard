"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

interface ChartData {
    day: string;
    count: number;
} 

export default function WeeklyMinutesPlayedGraph({ history }: { history: Record<string, Record<string, any>> | null }) {
    const labels = [
        convertWeekdayToLabel(6), 
        convertWeekdayToLabel(5), 
        convertWeekdayToLabel(4), 
        convertWeekdayToLabel(3), 
        convertWeekdayToLabel(2), 
        convertWeekdayToLabel(1), 
        convertWeekdayToLabel(0), 
    ];

    const chartData = useMemo<ChartData[]>(() => {
        const base: ChartData[] = labels.map((label) => ({ day: label, count: 0 }));
        if (!history) return base;

        Object.keys(history).forEach((activityName: string) => {
            Object.keys(history[activityName]).forEach((activityKey: string) => {
                const activity = history[activityName][activityKey];
                const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                const daysDiff = Math.floor((Date.now() - activityDate.getTime()) / (1000 * 3600 * 24));
                if (daysDiff < 7) {
                    base[6 - daysDiff].count += parseInt(activity["duration"]);
                }
            });
        });
        return base;
    }, [history]);

    return (
        <div>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                    <XAxis dataKey="day" />
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

function convertWeekdayToLabel(day: number) {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - day);

    const outputString = dateObj.toLocaleString('default', {
        month: 'short',
        day: 'numeric',
    });
    return outputString;
}
