"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";import { PieChart, Pie, Legend, Tooltip } from 'recharts';

export default function Page() {
    const activityId = useSearchParams().get('activityId');
    const activityName = useSearchParams().get('activityName');
    const [activityStartDT, setActivityStartDT] = useState<string>();
    const [activityEndDT, setActivityEndDT] = useState<string>();
    const [activityScore, setActivityScore] = useState<string>();
    const [activityDuration, setActivityDuration] = useState<string>();
    const [targetsHit, setTargetsHit] = useState<string[]>();
    const [targetsMissed, setTargetsMissed] = useState<string[]>();
    const [tips, setTips] = useState<string[]>();
    const [pieChartData, setPieChartData] = useState<{ name: string; value: number; fill: string }[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot1 = await get(child(ref(database), `prod/activities/history/${userId}/${activityId}`));
                    const snapshot2 = await get(child(ref(database), `prod/activities/playthroughs/${userId}/${activityId}`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");
                        const targetsHitList: string[] = [];
                        const targetsMissList: string[] = [];
                        const tipsList: string[] = [];
                        const states = snapshot.val() as Record<string, any>;

                        setActivityStartDT(formatDateTime(activity['startDT']));
                        setActivityEndDT(formatDateTime(activity['endDT']));
                        setActivityScore(activity['score']);
                        setActivityDuration(activity['duration']);

                        
                        const [month, day, year] = activity['endDT'].substring(0, 10).split(':');
                        const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                        const activityLabel = activityDate.toLocaleString('default', {
                            month: 'short',
                            day: 'numeric',
                        });


                        Object.keys(states).forEach((stateKey: string) => {
                            const state = states[stateKey] as Record<string, any>;
                            const stateTags = state['stateTags'];

                            if (stateTags.includes("TargetHit")) {
                                targetsHitList.push(stateKey);
                            }
                            if (stateTags.includes("TargetMissed")) {
                                targetsMissList.push(stateKey);
                            }
                            if (stateTags.includes("Tip")) {
                                tipsList.push(stateKey);
                            }
                        });

                        setTargetsHit(targetsHitList);
                        setTargetsMissed(targetsMissList);
                        setTips(tipsList);

                        setPieChartData([
                            { name: 'Targets Hit', value: targetsHitList.length, fill: '#2196F3' },
                            { name: 'Targets Missed', value: targetsMissList.length, fill: '#EF5350' }
                        ]);
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

    const formatDateTime = (dateTimeString: string): string => {
        const dateTimeArray = dateTimeString.split(' ');
        const [month, day, year] = dateTimeArray[0].split(':');
        const [hour, minute, seconds] = dateTimeArray[1].split(':');
        const formattedDate = `${getMonthName(parseInt(month))} ${parseInt(day)}, ${year}`;
        let formattedHour = parseInt(hour);
        const amPm = formattedHour >= 12 ? 'PM' : 'AM';
        formattedHour = formattedHour % 12 || 12;
        const formattedTime = `${formattedHour}:${minute} ${amPm}`;
        return `${formattedDate} at ${formattedTime}`;
    };
    
    const getMonthName = (month: number): string => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return months[month - 1];
    };
    

    return (
        <div className="flex flex-col space-y-12">
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col mx-auto justify-center px-16 rounded-lg shadow-xl">
                    <h1 className="text-center text-2xl font-bold mb-8">Activity Details</h1>
                    <h1 className="text-center text-lg mb-2">Activity Name: {activityName}</h1>
                    <h1 className="text-center text-lg mb-2">Activity Start: {activityStartDT}</h1>
                    <h1 className="text-center text-lg mb-2">Activity End: {activityEndDT}</h1>
                    <h1 className="text-center text-lg mb-2">Activity Duration: {activityDuration}</h1>
                    <h1 className="text-center text-lg mb-2">Activity Score: {activityScore}</h1>
                </div>
                <div className="flex mx-auto justify-center pr-24 rounded-lg shadow-xl">
                    <PieChart width={500} height={400}>
                        <text x={300} y={40} textAnchor="middle" dominantBaseline="middle" fontSize={24} fontWeight="bold" fill="#333333">Activity Targets</text>
                        <Pie dataKey="value" data={pieChartData} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
                        <Tooltip />
                        <Legend align="right" verticalAlign="middle" layout="vertical" />
                    </PieChart>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row px-8">
                <table className="mx-auto bg-white border border-gray-300 shadow rounded-lg overflow-hidden">
                    <thead className="bg-blue-500">
                        <tr>
                            <th className="py-4 px-24 border-b text-white">Targets Hit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {targetsHit && targetsHit.map((target, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                <td className="py-4 px-4 border-b text-center">{target}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table className="mx-auto bg-white border border-gray-300 shadow rounded-lg overflow-hidden">
                    <thead className="bg-blue-500">
                        <tr>
                            <th className="py-4 px-24 border-b text-white">Targets Missed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {targetsMissed && targetsMissed.map((target, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                <td className="py-4 px-4 border-b text-center">{target}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table className="mx-auto bg-white border border-gray-300 shadow rounded-lg overflow-hidden">
                    <thead className="bg-blue-500">
                        <tr>
                            <th className="py-4 px-24 border-b text-white">Tips Given</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tips && tips.map((tip, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                <td className="py-2 px-4 border-b text-center">{tip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}