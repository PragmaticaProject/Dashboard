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
                            className={index % 2 === 0 ? 'bg-gray-100 cursor-pointer hover:bg-gray-300' : 'bg-white cursor-pointer hover:bg-gray-300'}
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