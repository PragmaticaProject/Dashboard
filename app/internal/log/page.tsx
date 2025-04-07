"use client";

import { useEffect, useState } from 'react';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import LogTable from '@/app/components/data/logTable';

interface LogChartData {
    dateTime: string;
    userId: string;
    logType: string;
    platform: string;
    version: string;
    message: string;
    rawDate: Date;
}

export default function Page() {
    const [LogChartData, setLogChartData] = useState<LogChartData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const snapshot = await get(child(ref(database), `prod/logs/logsHistory`));

                    if (snapshot.exists()) {
                        const newLogChartData: LogChartData[] = [];
                        const logs = snapshot.val();
                        console.log(Object.keys(snapshot.val()).length);

                        Object.keys(logs).forEach((logKey: string) => {
                            const log = logs[logKey];
                            const userId = log['userID'];
                            const logType = log['logType'];
                            const platform = log['platform'];
                            const version = log['buildVersion'];
                            const message = log['logMessage'];
                            
                            const [month, day, year] = log['dateTime'].substring(0, 10).split(':');
                            const [hour, min, sec] = log['dateTime'].substring(11, 19).split(':');
                            const rawDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 
                                parseInt(hour), parseInt(min), parseInt(sec));
                            
                            const dateTime = rawDate.toLocaleString('default', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            });

                            newLogChartData.push({
                                dateTime: dateTime,
                                userId: userId,
                                logType: logType,
                                platform: platform,
                                version: version,
                                message: message,
                                rawDate: rawDate
                            });
                        });

                        newLogChartData.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

                        setLogChartData(newLogChartData);
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
                <h1>Database Logs</h1>
            </div>
            <div>
                {LogChartData.length > 0 ? (
                    <LogTable LogChartData={LogChartData} />
                ) : (
                    <p className="text-center text-gray-500">No data available.</p>
                )}
            </div>
        </div>
    );
}
