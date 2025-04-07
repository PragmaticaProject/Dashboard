"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import ActivityGraph from '@/app/components/data/activityGraph';
import ActivityTable from '@/app/components/data/activityTable';
import ActivityDurationGraph from '@/app/components/data/activityDurationGraph';

interface ChartData {
    activityId: string;
    date: string;
    score: string;
    duration: string;
}

export default function Page() {
    const activityName = useSearchParams().get('activityName');
    const [chartData, setChartData] = useState<ChartData[]>([]);

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

        if (activityName) {
            fetchData();
        }
    }, []);

    return (
        <div className="p-8 space-y-6">
            <div className="text-4xl font-bold text-center">
                <h1>{activityName?.replace(/([A-Z0-9])/g, ' $1').trim()}</h1>
            </div>
            <div className="text-xl font-bold text-center">
                <h1>Activity Scores</h1>
            </div>
            {chartData.length > 0 && <ActivityGraph chartData={chartData} />}
            <div className="text-xl font-bold text-center">
                <h1>Activity Durations</h1>
            </div>
            {chartData.length > 0 && <ActivityDurationGraph chartData={chartData} />}
            {chartData.length > 0 && <ActivityTable chartData={chartData} />}
        </div>
    );
};