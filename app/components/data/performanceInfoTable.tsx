'use client';

import React from 'react';

interface PerformanceInfoChartData {
    userId: string;
    name: string;
    currentStreak: string;
    longestStreak: string;
    currentTokens: string;
    totalTokens: string;
    lastActivityDT: string;
}

interface PerformanceInfoTableProps {
    PerformanceInfoChartData: PerformanceInfoChartData[];
}

const PerformanceInfoTable: React.FC<PerformanceInfoTableProps> = ({ PerformanceInfoChartData }) => {

    const sortedPerformanceInfoChartData = PerformanceInfoChartData.sort((a, b) => {
        const dateA = new Date(a.lastActivityDT);
        const dateB = new Date(b.lastActivityDT);
        return dateB.getTime() - dateA.getTime();
    })

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-300 shadow rounded">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="py-2 px-4 border-b">User Id</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Last Played</th>
                        <th className="py-2 px-4 border-b">Current Streak</th>
                        <th className="py-2 px-4 border-b">Longest Streak</th>
                        <th className="py-2 px-4 border-b">Current Tokens</th>
                        <th className="py-2 px-4 border-b">Total Tokens</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPerformanceInfoChartData.map((dataPoint, index) => (
                        <tr key={index}
                            className={index % 2 === 0 ? 'bg-gray-100 cursor-pointer hover:bg-gray-300' : 'bg-white cursor-pointer hover:bg-gray-300'}
                        >
                            <td className="py-2 px-4 border-b text-center">{dataPoint.userId}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.name}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.lastActivityDT}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.currentStreak}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.longestStreak}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.currentTokens}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.totalTokens}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
  
export default PerformanceInfoTable;