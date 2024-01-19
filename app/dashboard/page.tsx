import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import MonthlyUsageGraph from "../components/data/monthlyUsageGraph";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

interface ChartData {
    name: string;
    date: string;
    score: number;
    targetsHit: number;
    targetsMissed: number;
}

export default function Page() {
    const router = useRouter();
    var userName = null;
    var chartData: ChartData[] = [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    //const snapshot = await get(child(ref(database), `pilot/users/${user.uid}/sessions`));
                    const snapshot = await get(child(ref(database), `pilot/users/7TgDiZLWHdSBi9qhtqeImsj35c73/sessions`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");
                        userName = snapshot.val()['name'];
                        const newData: ChartData[] = [];

                        Object.keys(snapshot.val()).forEach((sessionKey: string) => { // iterate through sessions
                            const session = snapshot.val()[sessionKey];
                            const activities = session['activities'] as Record<string, any>;

                            Object.keys(activities).forEach((activityKey: string) => { // iterate through activities
                                const activity = activities[activityKey];
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
                                    name: activityKey,
                                    date: activityLabel,
                                    score: activityScore,
                                    targetsHit: activityTargetsHit,
                                    targetsMissed: activityTargetsMissed
                                });
                            });
                        });

                        // Set the newData array as the chartData state
                        chartData = newData;
                    } else {
                        console.log("No data available");
                    }
                } else {
                    console.log("user not found.");
                    router.push('/users');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);


    return (
        <div className="p-8 space-y-6">
            {userName && (
                <div>
                    <h1 className="text-4xl p-8 font-bold text-center">
                        User: {userName}
                    </h1>
                    <div className="text-2xl font-bold text-center">
                        <h1>Monthly Usage</h1>
                    </div>
                    <MonthlyUsageGraph chartData={chartData} />
                </div>
            )}
        </div>
    );
}
