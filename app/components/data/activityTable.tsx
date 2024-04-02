'use client';
import React from 'react';
import Link from 'next/link';

interface ChartData {
    activityId: string;
    date: string;
    score: string;
    duration: string;
    targetsHit: number;
    targetsMissed: number;
}

interface ActivityTableProps {
    chartData: ChartData[];
}

const ActivityTable: React.FC<ActivityTableProps> = ({ chartData }) => {

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-300 shadow rounded">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Score</th>
                        <th className="py-2 px-4 border-b">Duration</th>
                        <th className="py-2 px-4 border-b">Targets Hit</th>
                        <th className="py-2 px-4 border-b">Targets Missed</th>
                        <th className="py-2 px-4 border-b">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {chartData.map((dataPoint, index) => (
                        <tr key={index}
                            className={index % 2 === 0 ? 'bg-gray-100 cursor-pointer hover:bg-gray-300' : 'bg-white cursor-pointer hover:bg-gray-300'}
                        >
                            <td className="py-2 px-4 border-b text-center">{dataPoint.date}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.score}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.duration}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.targetsHit}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.targetsMissed}</td>
                            <td className="py-2 px-4 border-b text-center">
                            <Link href={{ pathname: `/dashboard/sessions/${encodeURIComponent(dataPoint.activityId)}`, 
                            query: { activityId: dataPoint.activityId } }}>
                                <h1 className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">View</h1>
                            </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
  
export default ActivityTable;