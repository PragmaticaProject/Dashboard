"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";import { PieChart, Pie, Legend, Tooltip } from 'recharts';

export default function Page() {
    const activityId = useSearchParams().get('activityId');
    const activityName = activityId?.split('-')[0];
    const [activityStartDT, setActivityStartDT] = useState<string>();
    const [activityEndDT, setActivityEndDT] = useState<string>();
    const [activityScore, setActivityScore] = useState<string>();
    const [activityDuration, setActivityDuration] = useState<string>();
    const [pieChartData, setPieChartData] = useState<{ name: string; value: number; fill: string }[]>([]);
    const [targetsHitNameList, setTargetsHitNameList] = useState<string[]>();
    const [targetsHitDescriptionList, setTargetsHitDescriptionList] = useState<string[]>();
    const [targetsMissedNameList, setTargetsMissedNameList] = useState<string[]>();
    const [targetsMissedDescriptionList, setTargetsMissedDescriptionList] = useState<string[]>();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `prod/activities/history/${userId}/${activityId}`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");
                        const activity = snapshot.val();

                        setActivityStartDT(formatDateTime(activity['startDT']));
                        setActivityEndDT(formatDateTime(activity['endDT']));
                        setActivityScore(activity['score']);
                        setActivityDuration(activity['duration']);

                        const targetsHit = activity['targetsHit'] || {};
                        const targetsMissed = activity['targetsMissed'] || {};
                        const tempTargetsHitNameList: string[] = [];
                        const tempTargetsHitDescriptionList: string[] = [];
                        const tempTargetsMissedNameList: string[] = [];
                        const tempTargetsMissedDescriptionList: string[] = [];

                        Object.keys(targetsHit).forEach((targetHitKey: string) => {
                            tempTargetsHitNameList.push(targetHitKey);
                            tempTargetsHitDescriptionList.push(targetsHit[targetHitKey]);
                        });

                        Object.keys(targetsMissed).forEach((targetMissedKey: string) => {
                            tempTargetsMissedNameList.push(targetMissedKey);
                            tempTargetsMissedDescriptionList.push(targetsMissed[targetMissedKey]);
                        });

                        setTargetsHitNameList(tempTargetsHitNameList);
                        setTargetsHitDescriptionList(tempTargetsHitDescriptionList);
                        setTargetsMissedNameList(tempTargetsMissedNameList);
                        setTargetsMissedDescriptionList(tempTargetsMissedDescriptionList);

                        setPieChartData([
                            { name: 'Targets Hit', value: tempTargetsHitNameList.length, fill: '#2196F3' },
                            { name: 'Targets Missed', value: tempTargetsMissedNameList.length, fill: '#EF5350' }
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
        <div className="flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col mx-auto justify-center px-16 rounded-lg shadow-xl">
                    <h1 className="text-center text-2xl font-bold mb-8">Activity Details</h1>
                    <h1 className="text-center text-lg mb-2">Activity Name: {activityName?.replace(/([A-Z0-9])/g, ' $1').trim()}</h1>
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
            <h1 className="text-2xl font-bold text-center pt-8">Targets Hit</h1>
            <div className="flex flex-col lg:flex-row px-8">
                <table className="mx-auto bg-white border border-gray-300 shadow rounded-lg overflow-hidden">
                    <thead className="bg-blue-500">
                        <tr>
                            <th scope="col" className="py-4 px-24 border-b text-white">
                                Target Name
                            </th>
                            <th scope="col" className="py-4 px-24 border-b text-white">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-blue-500">
                        {targetsHitNameList && targetsHitDescriptionList && targetsHitNameList.map((name, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                <td className="py-4 px-4 border-b font-bold text-center">
                                    {name}
                                </td>
                                <td className="py-4 px-4 border-b text-left">
                                    {targetsHitDescriptionList[index]}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h1 className="text-2xl font-bold text-center pt-8">Targets Missed</h1>
            <div className="flex flex-col lg:flex-row px-8">
                <table className="mx-auto bg-white border border-gray-300 shadow rounded-lg overflow-hidden">
                    <thead className="bg-blue-500">
                        <tr>
                            <th scope="col" className="py-4 px-24 border-b text-white">
                                Target Name
                            </th>
                            <th scope="col" className="py-4 px-24 border-b text-white">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-blue-500">
                        {targetsMissedNameList && targetsMissedDescriptionList && targetsMissedNameList.map((name, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                <td className="py-4 px-4 border-b font-bold text-center">
                                    {name}
                                </td>
                                <td className="py-4 px-4 border-b text-left">
                                    {targetsMissedDescriptionList[index]}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}