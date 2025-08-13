"use client";

import SessionsList from "@/app/components/data/sessionsList";
import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

function formatDateTime(dateTimeString: string): string {
    const [month, day, year, hour, minute] = dateTimeString.split(/[:\-]/);
    const formattedDate = `${getMonthName(parseInt(month))} ${parseInt(day)}, ${year}`;
    let formattedHour = parseInt(hour);
    const amPm = formattedHour >= 12 ? 'PM' : 'AM';
    formattedHour = formattedHour % 12 || 12;
    const formattedTime = `${formattedHour}:${minute} ${amPm}`;
    return `${formattedDate} - ${formattedTime}`;
}

function getMonthName(month: number): string {
    const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months[month - 1];
}

export default function Page() {
    const [sessions, setSessions] = useState<{ [key: string]: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (!user) return;
                const userId = localStorage.getItem("currentUser");
                if (!userId) return;
                const snapshot = await get(child(ref(database), `prod/users/${userId}/sessions`));
                if (snapshot.exists()) {
                    const newData: { [key: string]: string } = {};
                    Object.keys(snapshot.val()).forEach((sessionId: string) => {
                        const formattedDateTime = formatDateTime(sessionId.substring(0, 19));
                        newData[sessionId] = formattedDateTime;                        
                    });
                    setSessions(newData);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    

    return (
        <div className="flex-col space-y-6">
            <SessionsList sessions={sessions} />
        </div>
    );
}
