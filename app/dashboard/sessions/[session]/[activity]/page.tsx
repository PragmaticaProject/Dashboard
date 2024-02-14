"use client";

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import Link from "next/link";

export default function Page() {
    const sessionID = useSearchParams().get('sessionId');
    const activityName = useSearchParams().get('activityName');
    const [activityStartDT, setActivityStartDT] = useState<string>();
    const [activityEndDT, setActivityEndDT] = useState<string>();
    const [activityScore, setActivityScore] = useState<string>();
    const [activityDuration, setActivityDuration] = useState<string>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `prod/users/${userId}/sessions/${sessionID}/activities/${activityName}`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");
                        const activity = snapshot.val();

                        setActivityStartDT(formatDateTime(activity['startDT']));
                        setActivityEndDT(formatDateTime(activity['endDT']));
                        setActivityScore(activity['score']);
                        setActivityDuration(activity['duration']);

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
        <div className="flex flex-col mx-auto space-y-8 max-w-lg">
            <h1 className="text-center text-2xl font-bold mb-4">Activity Details</h1>
            <h1 className="text-center text-lg font-bold mb-4">Activity Name: {activityName}</h1>
            <h1 className="text-center text-lg font-bold mb-4">Activity Start: {activityStartDT}</h1>
            <h1 className="text-center text-lg font-bold mb-4">Activity End: {activityEndDT}</h1>
            <h1 className="text-center text-lg font-bold mb-4">Activity Score: {activityScore}</h1>
        </div>
    )
}