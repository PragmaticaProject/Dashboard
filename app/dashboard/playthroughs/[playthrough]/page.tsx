"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import Link from "next/link";

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
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `prod/activities/history/${userId}/${activityName}/${activityId}`));

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
        <div className="space-y-6 p-4 sm:p-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-600 p-6 text-white shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs uppercase tracking-wide opacity-90">Playthrough</div>
                        <h1 className="mt-1 text-2xl sm:text-3xl font-bold">
                            {activityName?.replace(/([A-Z0-9])/g, ' $1').trim()}
                        </h1>
                        <div className="mt-2 text-sm opacity-90">Detailed breakdown</div>
                    </div>
                    <Link href={`/dashboard/activities/${encodeURIComponent(activityName || '')}?activityName=${activityName || ''}`} className="rounded-md bg-white/15 px-3 py-1.5 text-sm backdrop-blur hover:bg-white/25">Back</Link>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Start" value={activityStartDT || (isLoading ? '—' : '—')} />
                <StatCard label="End" value={activityEndDT || (isLoading ? '—' : '—')} />
                <StatCard label="Duration" value={activityDuration || (isLoading ? '—' : '—')} />
                <StatCard label="Score" value={activityScore || (isLoading ? '—' : '—')} />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Activity Targets</h2>
                <div className="flex items-center justify-center">
                    <PieChart width={520} height={360}>
                        <Pie dataKey="value" data={pieChartData} cx={200} cy={180} innerRadius={60} outerRadius={100} label>
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend align="right" verticalAlign="middle" layout="vertical" />
                    </PieChart>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Targets Hit</h2>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left font-medium text-gray-600">Target</th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-600">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {targetsHitNameList && targetsHitDescriptionList && targetsHitNameList.map((name, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-3 px-4 font-medium text-gray-900">{name}</td>
                                        <td className="py-3 px-4 text-gray-700">{targetsHitDescriptionList[index]}</td>
                                    </tr>
                                ))}
                                {(!targetsHitNameList || targetsHitNameList.length === 0) && (
                                    <tr><td colSpan={2} className="py-6 text-center text-gray-500">{isLoading ? 'Loading...' : 'No targets hit.'}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Targets Missed</h2>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left font-medium text-gray-600">Target</th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-600">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {targetsMissedNameList && targetsMissedDescriptionList && targetsMissedNameList.map((name, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-3 px-4 font-medium text-gray-900">{name}</td>
                                        <td className="py-3 px-4 text-gray-700">{targetsMissedDescriptionList[index]}</td>
                                    </tr>
                                ))}
                                {(!targetsMissedNameList || targetsMissedNameList.length === 0) && (
                                    <tr><td colSpan={2} className="py-6 text-center text-gray-500">{isLoading ? 'Loading...' : 'No targets missed.'}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
        </div>
    );
}