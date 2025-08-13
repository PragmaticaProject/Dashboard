"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import Link from "next/link";

function formatDateTime(dateTimeString: string): string {
    const dateTimeArray = dateTimeString.split(' ');
    const [month, day, year] = dateTimeArray[0].split(':');
    const [hour, minute] = dateTimeArray[1].split(':');
    const formattedDate = `${getMonthName(parseInt(month))} ${parseInt(day)}, ${year}`;
    let formattedHour = parseInt(hour);
    const amPm = formattedHour >= 12 ? 'PM' : 'AM';
    formattedHour = formattedHour % 12 || 12;
    const formattedTime = `${formattedHour}:${minute} ${amPm}`;
    return `${formattedDate} at ${formattedTime}`;
}

function getMonthName(month: number): string {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months[month - 1];
}

export default function Page() {
    const sessionID = useSearchParams().get('sessionId');
    const [sessionStartDT, setSessionStartDT] = useState<string>();
    const [sessionEndDT, setSessionEndDT] = useState<string>();
    const [data, setData] = useState<{ [key: string]: string }>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `prod/users/${userId}/sessions/${sessionID}`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");
                        const session = snapshot.val();
                        const activities = session['activities'] as Record<string, any>;

                        setSessionStartDT(formatDateTime(session['startDT']));
                        setSessionEndDT(formatDateTime(session['endDT']));

                        const newData: { [key: string]: string } = {};
                        Object.keys(activities).forEach((activityKey: string) => {
                            if (sessionID)
                            {
                                newData[activityKey] = activityKey.split('-')[0];
                            }
                        });

                        setData(newData);
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
    }, [sessionID]);

    return (
        <div className="flex flex-col mx-auto space-y-8 max-w-lg">
            <h1 className="text-center text-2xl font-bold mb-4">Session Details</h1>
            <h1 className="text-center text-lg font-bold mb-4">Session Start: {sessionStartDT}</h1>
            <h1 className="text-center text-lg font-bold mb-4">Session End: {sessionEndDT}</h1>
            {data && (
                <table className="w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                    <th className="py-2 pl-4 text-center">Activities</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data).map(([key, value]) => (
                    <tr key={key} className="border-b">
                        <td className="py-2 px-4 text-center hover:bg-gray-100">
                        <Link href={{ pathname: `/dashboard/playthroughs/${encodeURIComponent(key)}`, 
                            query: { activityId: key, activityName: value } }}>
                            <div>{value.replace(/([A-Z0-9])/g, ' $1').trim()}</div>
                        </Link>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div>
    )
}