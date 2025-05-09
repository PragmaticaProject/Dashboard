'use client';

import React from 'react';

interface LogChartData {
    dateTime: string;
    userId: string;
    logType: string;
    platform: string;
    version: string;
    message: string;
    rawDate: Date;
}

interface LogTableProps {
    LogChartData: LogChartData[];
}

const LogTable: React.FC<LogTableProps> = ({ LogChartData }) => {
    const getLogTypeColor = (logType: string) => {
        switch (logType.toLowerCase()) {
            case 'log':
                return 'bg-gray-200';
            case 'warning':
                return 'bg-yellow-200';
            case 'error':
                return 'bg-red-200';
            case 'leaderboard':
                return 'bg-green-200';
            default:
                return 'bg-gray-200';
        }
    };

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-300 shadow rounded">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="py-2 px-4 border-b">Datetime</th>
                        <th className="py-2 px-4 border-b">User Id</th>
                        <th className="py-2 px-4 border-b">Log Type</th>
                        <th className="py-2 px-4 border-b">Platform</th>
                        <th className="py-2 px-4 border-b">Version</th>
                        <th className="py-2 px-4 border-b">Message</th>
                    </tr>
                </thead>
                <tbody>
                    {LogChartData.map((dataPoint, index) => (
                        <tr key={index}
                            className={`cursor-pointer hover:bg-gray-300 ${getLogTypeColor(dataPoint.logType)}`}
                        >
                            <td className="py-2 px-4 border-b text-center">{dataPoint.dateTime}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.userId}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.logType}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.platform}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.version}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.message}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
  
export default LogTable;