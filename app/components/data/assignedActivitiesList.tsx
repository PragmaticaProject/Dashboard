"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ref, update } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function AssignedActivitiesList({ initialAssigned, initialOther }: { initialAssigned: Record<string, any> | null, initialOther: Record<string, any> }) {
  const auth = firebaseAuth;
  const [assignedActivities, setAssignedActivities] = useState<Record<string, any> | null>(initialAssigned);
  const [otherActivities, setOtherActivities] = useState<Record<string, any>>(initialOther);

  useEffect(() => {
    setAssignedActivities(initialAssigned);
  }, [initialAssigned]);

  useEffect(() => {
    setOtherActivities(initialOther);
  }, [initialOther]);

  const handleDelete = async (deletedActivityKey: string) => {
    try {
      const user = auth.currentUser;
      const userId = localStorage.getItem("currentUser");

      if (user) {
        const updatedAssignedActivities = { ...assignedActivities } as Record<string, any>;
        const removedActivity = updatedAssignedActivities[deletedActivityKey];
        delete updatedAssignedActivities[deletedActivityKey];

        const updates = {
          [`prod/users/${userId}/activities/assignedActivities/${deletedActivityKey}`]: null,
        };

        await update(ref(database), updates);
        setAssignedActivities(updatedAssignedActivities);
        setOtherActivities(prev => ({ ...prev, [deletedActivityKey]: removedActivity }));
      } else {
        console.log("user not found.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (activityKey: string) => {
    try {
      const user = auth.currentUser;
      const userId = localStorage.getItem("currentUser");

      if (user) {
        const activityToAdd = otherActivities[activityKey];
        const updatedAssignedActivities = { ...assignedActivities, [activityKey]: activityToAdd };
        const updatedOtherActivities = { ...otherActivities };
        delete updatedOtherActivities[activityKey];

        const updates = {
          [`prod/users/${userId}/activities/assignedActivities/${activityKey}`]: activityToAdd,
        };

        await update(ref(database), updates);
        setAssignedActivities(updatedAssignedActivities);
        setOtherActivities(updatedOtherActivities);
      } else {
        console.log("user not found.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const displayActivity = (key: string) => {
    return key.replace(/([A-Z0-9])/g, ' $1').trim();
  };

  return (
    <div>
      <div className="text-center">
        <h1 className="text-center text-4xl font-bold pb-8">Activities</h1>
        <h1>The assigned activities list show which activities are provided to the user. You can add or remove activities to choose which activities the user can play (they will be added to the bottom of the other list).</h1>
      </div>
      <div className="flex flex-col lg:flex-row justify-between space-y-6 lg:space-y-0 space-x-0 lg:space-x-12">
        <div className="w-1/2 p-4">
          <h1 className="text-center text-2xl font-bold pb-8">Assigned Activities</h1>
          {assignedActivities && (
            <table className="w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-blue-500">
                <tr>
                  <th className="py-4 pl-4 text-center text-white">Activity</th>
                  <th className="py-4 pl-4 text-center text-white"></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(assignedActivities).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="py-4 px-4 text-center hover:bg-gray-100">
                      <Link href={{ pathname: `/dashboard/activities/${encodeURIComponent(key)}`, query: { activityName: key } }}>
                        <div>{key.replace(/([A-Z0-9])/g, ' $1').trim()}</div>
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
        
        <div className="w-1/2 p-4">
          <h1 className="text-center text-2xl font-bold pb-8">Other Activities</h1>
          {Object.keys(otherActivities).length > 0 ? (
            <table className="w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-blue-500">
                <tr>
                  <th className="py-4 pl-4 text-center text-white">Activity</th>
                  <th className="py-4 pl-4 text-center text-white"></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(otherActivities).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="py-4 px-4 text-center hover:bg-gray-100">
                      <Link href={{ pathname: `/dashboard/activities/${encodeURIComponent(key)}`, query: { activityName: key } }}>
                        <div>{key.replace(/([A-Z0-9])/g, ' $1').trim()}</div>
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => handleAdd(key)} 
                        className="px-2 py-1 bg-green-500 text-white rounded">
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No other activities available</p>
          )}
        </div>
      </div>
    </div>
  );
}
