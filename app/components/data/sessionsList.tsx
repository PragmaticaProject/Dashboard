"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseApp, firebaseAuth, database } from "@/app/firebase";

export default function SessionsList() {
  const app = firebaseApp;
  const auth = firebaseAuth;
  const dbRef = ref(database);
  const [data, setData] = useState<{ [key: string]: string }>();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(dbRef, `prod/users/${userId}/sessions`));
                
                if (snapshot.exists()) {
                    console.log("snapshot found.");

                    const newData: { [key: string]: string } = {};
                    Object.keys(snapshot.val()).forEach((sessionId: string) => {
                        const formattedDateTime = formatDateTime(sessionId.substring(0, 19));
                        newData[sessionId] = formattedDateTime;                        
                    });
                    
                    setData(newData);
                } else {
                    console.log("No data available");
                }
            }
            else {
                console.log("user not found.");
            }
        } catch (error) {
        console.error(error);
        }
    };

    fetchData();
  }, []);

  const formatDateTime = (dateTimeString: string): string => {
    const [month, day, year, hour, minute] = dateTimeString.split(/[:\-]/);
    const formattedDate = `${getMonthName(parseInt(month))} ${parseInt(day)}, ${year}`;
    let formattedHour = parseInt(hour);
    const amPm = formattedHour >= 12 ? 'PM' : 'AM';
    formattedHour = formattedHour % 12 || 12;
    const formattedTime = `${formattedHour}:${minute} ${amPm}`;
    return `${formattedDate} - ${formattedTime}`;
  };

  const getMonthName = (month: number): string => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months[month - 1];
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-bold mb-4">All Sessions</h1>
      {data && (
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-500">
            <tr>
              <th className="py-2 pl-4 text-center text-white">Session</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).sort((a, b) => {
                const [monthA, dayA, yearA] = a[0].substring(0, 10).split(':');
                const [monthB, dayB, yearB] = b[0].substring(0, 10).split(':');
                const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
                const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
                return dateB.getTime() - dateA.getTime();
            }).map(([key, value]) => (
              <tr key={key} className="border-b">
                 <td className="py-2 px-4 text-center hover:bg-gray-100">
                  <Link href={{ pathname: `/dashboard/sessions/${encodeURIComponent(value)}`, 
                    query: { sessionId: key } }}>
                    <div>{value}</div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}