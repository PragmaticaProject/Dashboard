"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import ActivityGraph from '@/app/components/data/activityGraph';
import ActivityTable from '@/app/components/data/activityTable';
import ActivityDurationGraph from '@/app/components/data/activityDurationGraph';
import Link from "next/link";

interface ChartData {
    activityId: string;
    date: string;
    score: string;
    duration: string;
}

export default function Page() {
    const activityName = useSearchParams().get('activityName');
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [totalSessions, setTotalSessions] = useState<number>(0);
    const [avgScore, setAvgScore] = useState<number>(0);
    const [totalMinutes, setTotalMinutes] = useState<number>(0);
    const [lastPlayed, setLastPlayed] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user && activityName) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `prod/activities/history/${userId}/${activityName}`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");
                        const newData: ChartData[] = [];
                        let latestTime = 0;
                        let minutesSum = 0;
                        let scoreSum = 0;
                        let scoreCount = 0;

                        Object.keys(snapshot.val()).forEach((activityKey: string) => {

                            const activity = snapshot.val()[activityKey];

                            const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                            const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            const activityLabel = activityDate.toLocaleString('default', {
                                month: 'short',
                                day: 'numeric',
                            });
                            
                            newData.push({
                                activityId: activityKey,
                                date: activityLabel,
                                score: activity["score"],
                                duration: activity["duration"]
                            });

                            latestTime = Math.max(latestTime, activityDate.getTime());
                            const minutes = parseInt(activity["duration"]) || 0;
                            minutesSum += minutes;
                            const s = parseFloat(activity["score"]);
                            if (!Number.isNaN(s)) {
                                scoreSum += s;
                                scoreCount += 1;
                            }
                        });

                        setChartData(newData);
                        setTotalSessions(newData.length);
                        setTotalMinutes(minutesSum);
                        setAvgScore(scoreCount > 0 ? Number((scoreSum / scoreCount).toFixed(1)) : 0);
                        if (latestTime > 0) {
                            setLastPlayed(new Date(latestTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }));
                        }
                    } else {
                        console.log("No data available");
                    }
                } else {
                    console.log("user not found.");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (activityName) {
            fetchData();
        }
    }, [activityName]);

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs uppercase tracking-wide opacity-90">Activity</div>
                        <h1 className="mt-1 text-2xl sm:text-3xl font-bold">
                            {activityName?.replace(/([A-Z0-9])/g, ' $1').trim()}
                        </h1>
                        <div className="mt-2 text-sm opacity-90">Insights and trends</div>
                    </div>
                    <Link href="/dashboard/activities" className="rounded-md bg-white/15 px-3 py-1.5 text-sm backdrop-blur hover:bg-white/25">Back</Link>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Sessions" value={isLoading ? '—' : totalSessions} />
                <StatCard label="Avg Score" value={isLoading ? '—' : avgScore} />
                <StatCard label="Total Minutes" value={isLoading ? '—' : totalMinutes} />
                <StatCard label="Last Played" value={isLoading ? '—' : (lastPlayed || '—')} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">Activity Scores</h2>
                    {chartData.length > 0 && <ActivityGraph chartData={chartData} />}
                    {chartData.length === 0 && (
                        <EmptyState message={isLoading ? 'Loading...' : 'No score data available.'} />
                    )}
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">Activity Durations</h2>
                    {chartData.length > 0 && <ActivityDurationGraph chartData={chartData} />}
                    {chartData.length === 0 && (
                        <EmptyState message={isLoading ? 'Loading...' : 'No duration data available.'} />
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Playthroughs</h2>
                {chartData.length > 0 && <ActivityTable chartData={chartData} />}
                {chartData.length === 0 && (
                    <EmptyState message={isLoading ? 'Loading...' : 'No playthroughs found.'} />
                )}
            </div>
        </div>
    );
};

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
            {message}
        </div>
    );
}