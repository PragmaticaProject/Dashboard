"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

interface ChartData {
    date: string;
    count: number;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function YearlyUsageGraph({ history }: { history: Record<string, Record<string, any>> | null }) {
    const chartData = useMemo<ChartData[]>(() => {
        const labels: string[] = [];
        const today = new Date();
        const currentMonth = today.getMonth();
        for (let i = 11; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            labels.push(MONTH_NAMES[monthIndex]);
        }
        const base: ChartData[] = labels.map((label) => ({ date: label, count: 0 }));
        if (!history) return base;
        Object.keys(history).forEach((activityName: string) => {
            Object.keys(history[activityName]).forEach((activityKey: string) => {
                const activity = history[activityName][activityKey];
                const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                const daysDiff = Math.round((Date.now() - activityDate.getTime()) / (1000 * 3600 * 24));
                if (daysDiff < 31) {
                    base[11].count += 1;
                } else if (daysDiff < 59) {
                    base[10].count += 1;
                } else if (daysDiff < 90) {
                    base[9].count += 1;
                } else if (daysDiff < 120) {
                    base[8].count += 1;
                } else if (daysDiff < 151) {
                    base[7].count += 1;
                } else if (daysDiff < 181) {
                    base[6].count += 1;
                } else if (daysDiff < 212) {
                    base[5].count += 1;
                } else if (daysDiff < 243) {
                    base[4].count += 1;
                } else if (daysDiff < 273) {
                    base[3].count += 1;
                } else if (daysDiff < 304) {
                    base[2].count += 1;
                } else if (daysDiff < 334) {
                    base[1].count += 1;
                } else if (daysDiff < 365) {
                    base[0].count += 1;
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
