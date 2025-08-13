"use client";

import Link from "next/link";

export default function RecommendedActivitiesList({ activities }: { activities: string[] | null }) {
  const data = activities;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-bold pb-8">AI Recommended Activities</h1>
      {data && (
        <table className="w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-500">
            <tr>
              <th className="py-4 pl-4 text-center text-white">Activity</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key} className="border-b">
                 <td className="py-4 px-4 text-center hover:bg-gray-100">
                  <Link href={{ pathname: `/dashboard/activities/${encodeURIComponent(value)}`, 
                    query: { activityName: value } }}>
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