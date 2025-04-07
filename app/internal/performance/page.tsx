"use client";

import { useEffect, useState } from 'react';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import PerformanceInfoTable from '@/app/components/data/performanceInfoTable';

interface PerformanceInfoChartData {
    userId: string;
    name: string;
    currentStreak: string;
    longestStreak: string;
    currentTokens: string;
    totalTokens: string;
    lastActivityDT: string;
}

export default function Page() {
    const [PerformanceInfoChartData, setPerformanceInfoChartData] = useState<PerformanceInfoChartData[]>([]);
    const [avgLongestStreak, setAvgLongestStreak] = useState<number>(0);
    const [avgCurrentTokens, setAvgCurrentTokens] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const snapshot = await get(child(ref(database), `prod/users`));

                    if (snapshot.exists()) {
                        const newPerformanceInfoChartData: PerformanceInfoChartData[] = [];
                        const users = snapshot.val();
                        let totalLongestStreak = 0;
                        let totalCurrentTokens = 0;
                        let userCount = 0;

                        Object.keys(users).forEach((userKey: string) => {
                            const user = users[userKey];
                            const name = user['name'];
                            const stats = user['stats'];
                            const currentStreak = stats['currentStreak'];
                            const longestStreak = stats['longestStreak'];
                            const currentTokens = stats['currentTokens'];
                            const totalTokens = stats['totalTokens'];

                            // Add to totals for averages
                            if (longestStreak) {
                                totalLongestStreak += parseInt(longestStreak);
                            }
                            if (currentTokens) {
                                totalCurrentTokens += parseInt(currentTokens);
                            }
                            userCount++;

                            // Parse and format the last activity date
                            const [month, day, year] = stats['lastActivityDateTime'].substring(0, 10).split('/');
                            const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            const lastActivityDT = dateObj.toLocaleString('default', {
                                month: 'short',
                                day: 'numeric',
                            });

                            newPerformanceInfoChartData.push({
                                userId: userKey,
                                name: name,
                                currentStreak: currentStreak,
                                longestStreak: longestStreak,
                                currentTokens: currentTokens,
                                totalTokens: totalTokens,
                                lastActivityDT: lastActivityDT
                            });
                        });

                        // Calculate averages
                        setAvgLongestStreak(totalLongestStreak / userCount);
                        setAvgCurrentTokens(totalCurrentTokens / userCount);

                        // Set data for the table
                        setPerformanceInfoChartData(newPerformanceInfoChartData);
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
                <h1>Performance Data</h1>
            </div>
            <div className="flex flex-wrap justify-center space-x-12">
                <div className="w-72 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-gray-700 text-lg font-semibold">Average Longest Streak</h2>
                    <p className="text-3xl font-bold text-blue-600">{avgLongestStreak.toFixed(2)}</p>
                </div>
                <div className="w-72 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-gray-700 text-lg font-semibold">Average Current Tokens</h2>
                    <p className="text-3xl font-bold text-green-500">{avgCurrentTokens.toFixed(2)}</p>
                </div>
            </div>
            <div>
                {PerformanceInfoChartData.length > 0 ? (
                    <PerformanceInfoTable PerformanceInfoChartData={PerformanceInfoChartData} />
                ) : (
                    <p className="text-center text-gray-500">No data available.</p>
                )}
            </div>
        </div>
    );
}
