"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ref, child, get, update } from "firebase/database";
import { firebaseApp, firebaseAuth, database } from "@/app/firebase";

export default function AssignedActivitiesList() {
  const app = firebaseApp;
  const auth = firebaseAuth;
  const dbRef = ref(database);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = localStorage.getItem("currentUser");
          const snapshot = await get(child(dbRef, `prod/users/${userId}/activities/assignedActivities`));

          if (snapshot.exists()) {
            console.log("snapshot found.");
            setData(snapshot.val());
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

  const handleDelete = async (deletedActivityKey) => {
    try {
      const user = auth.currentUser;
      const userId = localStorage.getItem("currentUser");

      if (user) {
        const updatedData = { ...data };
        delete updatedData[deletedActivityKey];

        const updates = {
          [`prod/users/${userId}/activities/assignedActivities/${deletedActivityKey}`]: null,
        };

        await update(ref(database), updates);
        setData(updatedData);
      } else {
        console.log("user not found.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-bold pb-8">Assigned Activities</h1>
      {data && (
        <table className="w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-500">
            <tr>
              <th className="py-4 pl-4 text-center text-white">Activity</th>
              <th className="py-4 pl-4 text-center text-white"></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key} className="border-b">
                <td className="py-4 px-4 text-center hover:bg-gray-100">
                  <Link href={{ pathname: `/dashboard/activities/${encodeURIComponent(key)}`, query: { activityName: key } }}>
                    <div>{key}</div>
                  </Link>
                </td>
                <td className="py-4 px-4 text-center">
                  <button 
                    onClick={() => handleDelete(key)} 
                    className="px-2 py-1 bg-red-500 text-white rounded">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
