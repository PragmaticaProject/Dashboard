'use client';

import React from 'react';

interface UsageInfoChartData {
    userId: string;
    name: string;
    totalSessions: number;
    avgSessionsPerWeek: string;
    avgSessionsPerMonth: string;
    avgSessionLength: string;
}

interface UsageInfoTableProps {
    UsageInfoChartData: UsageInfoChartData[];
}

const UsageInfoTable: React.FC<UsageInfoTableProps> = ({ UsageInfoChartData }) => {

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-300 shadow rounded">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="py-2 px-4 border-b">User Id</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Total Sessions</th>
                        <th className="py-2 px-4 border-b">Avg Sessions / Week</th>
                        <th className="py-2 px-4 border-b">Avg Sessions / Month</th>
                        <th className="py-2 px-4 border-b">Avg Session Length</th>
                    </tr>
                </thead>
                <tbody>
                    {UsageInfoChartData.map((dataPoint, index) => (
                        <tr key={index}
                            className={index % 2 === 0 ? 'bg-gray-100 cursor-pointer hover:bg-gray-300' : 'bg-white cursor-pointer hover:bg-gray-300'}
                        >
                            <td className="py-2 px-4 border-b text-center">{dataPoint.userId}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.name}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.totalSessions}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.avgSessionsPerWeek}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.avgSessionsPerMonth}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.avgSessionLength}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
  
export default UsageInfoTable;