"use client";

import { useEffect, useState } from 'react';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import UsageInfoTable from '@/app/components/data/usageInfoTable';

interface UsageInfoChartData {
    userId: string;
    name: string;
    totalSessions: number;
    avgSessionsPerWeek: string;
    avgSessionsPerMonth: string;
    avgSessionLength: string;
}

export default function Page() {
    const [UsageInfoChartData, setUsageInfoChartData] = useState<UsageInfoChartData[]>([]);
    const [totalSessions, setTotalSessions] = useState<number>(0);
    const [avgSessionLength, setAvgSessionLength] = useState<string>("");
    const [avgSessionsPerWeek, setAvgSessionsPerWeek] = useState<string>("");
    const [avgSessionsPerMonth, setAvgSessionsPerMonth] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const snapshot = await get(child(ref(database), `prod/users`));

                    if (snapshot.exists()) {
                        const newUsageInfoChartData: UsageInfoChartData[] = [];
                        let sessionLengths: number[] = [];
                        let combinedSessions = 0;
                        let totalWeeks = 0;
                        let totalMonths = 0;
                        let totalDays = 0;

                        const users = snapshot.val();

                        Object.keys(users).forEach((userKey: string) => {
                            const user = users[userKey];
                            const name = user['name'];
                            const sessions = user['sessions'];

                            if (!sessions || Object.keys(sessions).length === 0) {
                                newUsageInfoChartData.push({
                                    userId: userKey,
                                    name: name || 'Unknown',
                                    totalSessions: 0,
                                    avgSessionsPerWeek: '-',
                                    avgSessionsPerMonth: '-',
                                    avgSessionLength: '-'
                                });
                            } else {
                                let userTotalSessions = 0;
                                let userTotalSessionLength = 0;
                                let firstSessionDT = new Date('9999-12-31');
                                let lastSessionDT = new Date(0);

                                Object.keys(sessions).forEach((sessionKey: string) => {
                                    const session = sessions[sessionKey];
                                    userTotalSessions++;

                                    const [month, day, year] = session['startDT'].substring(0, 10).split(':');
                                    const [hour, min, sec] = session['startDT'].substring(11, 19).split(':');
                                    const startDT = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 
                                        parseInt(hour), parseInt(min), parseInt(sec));

                                    const [month2, day2, year2] = session['endDT'].substring(0, 10).split(':');
                                    const [hour2, min2, sec2] = session['endDT'].substring(11, 19).split(':');
                                    const endDT = new Date(parseInt(year2), parseInt(month2) - 1, parseInt(day2), 
                                        parseInt(hour2), parseInt(min2), parseInt(sec2));

                                    if (startDT < firstSessionDT) firstSessionDT = startDT;
                                    if (endDT > lastSessionDT) lastSessionDT = endDT;

                                    userTotalSessionLength += (endDT.getTime() - startDT.getTime()) / 60000;
                                });

                                combinedSessions += userTotalSessions;
                                totalDays += (lastSessionDT.getTime() - firstSessionDT.getTime()) / (1000 * 60 * 60 * 24);
                                totalWeeks = totalDays / 7;
                                totalMonths = totalDays / 30.4375;
                                
                                const averageSessionLength = (userTotalSessionLength / userTotalSessions).toFixed(2);
                                sessionLengths.push(userTotalSessionLength / userTotalSessions)

                                const avgSessionsPerWeek = (userTotalSessions / (totalWeeks || 1)).toFixed(2);
                                const avgSessionsPerMonth = (userTotalSessions / (totalMonths || 1)).toFixed(2);

                                newUsageInfoChartData.push({
                                    userId: userKey,
                                    name: name || 'Unknown',
                                    totalSessions: userTotalSessions,
                                    avgSessionsPerWeek: avgSessionsPerWeek,
                                    avgSessionsPerMonth: avgSessionsPerMonth,
                                    avgSessionLength: averageSessionLength
                                });
                            }
                        });

                        let sum = 0;
                        let count = 0;
                        for (let i = 0; i < sessionLengths.length; i++) {
                            if (!isNaN(sessionLengths[i])) {
                                sum += sessionLengths[i];
                                count++;
                                console.log("sum: " + sum + ", count: " + count);
                            }
                        }
                        setAvgSessionLength((sum / count).toFixed(2));
                        
                        setAvgSessionsPerWeek((combinedSessions / totalWeeks).toFixed(2));
                        setAvgSessionsPerMonth((combinedSessions / totalMonths).toFixed(2));
                        setTotalSessions(combinedSessions);

                        setUsageInfoChartData(newUsageInfoChartData);
                    } else {
                        console.log("No data available");
                    }
                } else {
                    console.log("User not found.");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col p-8 space-y-12">
            <div className="text-4xl font-bold text-center">
                <h1>Usage Information</h1>
            </div>
            <div className="flex flex-wrap justify-center space-x-12">
                <div className="w-72 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-gray-700 text-lg font-semibold">Avg Session Length</h2>
                    <p className="text-3xl font-bold text-blue-600">{avgSessionLength} min</p>
                </div>
                <div className="w-72 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-gray-700 text-lg font-semibold">Avg Sessions Per Week</h2>
                    <p className="text-3xl font-bold text-green-500">{avgSessionsPerWeek}</p>
                </div>
                <div className="w-72 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-gray-700 text-lg font-semibold">Avg Sessions Per Month</h2>
                    <p className="text-3xl font-bold text-purple-500">{avgSessionsPerMonth}</p>
                </div>
            </div>
            <div>
                {UsageInfoChartData.length > 0 ? (
                    <UsageInfoTable UsageInfoChartData={UsageInfoChartData} />
                ) : (
                    <p className="text-center text-gray-500">No data available.</p>
                )}
            </div>
        </div>
    );
}
