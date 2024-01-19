import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import ActivityGraph from '@/app/components/data/activityGraph';
import ActivityTable from '@/app/components/data/activityTable';

interface ChartData {
    date: string;
    score: number;
    targetsHit: number;
    targetsMissed: number;
}

export default function Page() {
    const activityName = useSearchParams().get('activityName');
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    //const snapshot = await get(child(ref(database), `pilot/users/${user.uid}/sessions`));
                    const snapshot = await get(child(ref(database), `pilot/users/7TgDiZLWHdSBi9qhtqeImsj35c73/sessions`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");
                        const newData: ChartData[] = [];

                        Object.keys(snapshot.val()).forEach((sessionKey: string) => { // iterate through sessions
                            const session = snapshot.val()[sessionKey];
                            const activities = session['activities'] as Record<string, any>;

                            Object.keys(activities).forEach((activityKey: string) => { // iterate through activities
                                const activity = activities[activityKey];

                                if (activityKey === activityName) {
                                    const states = activity['states'] as Record<string, any>;
                                    
                                    const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                                    const activityDate = new Date(year, month, day);
                                    const activityLabel = activityDate.toLocaleString('default', {
                                        month: 'short',
                                        day: 'numeric',
                                    });

                                    var activityTargetsHit = 0;
                                    var activityTargetsMissed = 0;

                                    Object.keys(states).forEach((stateKey: string) => {
                                        const state = states[stateKey] as Record<string, any>;
                                        const stateTags = state['stateTags'];

                                        if (stateTags.includes("TargetHit")) {
                                            activityTargetsHit += 1;
                                        }

                                        if (stateTags.includes("TargetMissed")) {
                                            activityTargetsMissed += 1;
                                        }
                                    });

                                    const activityScore = Math.round((activityTargetsHit / (activityTargetsHit + activityTargetsMissed)) * 100);
                                    console.log("name: " + activityLabel + ", score: " + activityScore);
                                    newData.push({
                                        date: activityLabel,
                                        score: activityScore,
                                        targetsHit: activityTargetsHit,
                                        targetsMissed: activityTargetsMissed
                                    });
                                }
                            });
                        });

                        // Set the newData array as the chartData state
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
            <div className="text-xl font-bold text-center">
                <h1>{activityName}</h1>
            </div>
            {chartData.length > 0 && <ActivityGraph chartData={chartData} />}
            {chartData.length > 0 && <ActivityTable chartData={chartData} />}
        </div>
    );
};