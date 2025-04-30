'use client';

import React from 'react';
import Link from 'next/link';

interface FinancialInfoChartData {
    userId: string;
    subscription: string;
    duration: string;
    lastDate: string;
}

interface FinancialInfoTableProps {
    FinancialInfoChartData: FinancialInfoChartData[];
}

const FinancialInfoTable: React.FC<FinancialInfoTableProps> = ({ FinancialInfoChartData }) => {

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-300 shadow rounded">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="py-2 px-4 border-b">User Id</th>
                        <th className="py-2 px-4 border-b">Subscription</th>
                        <th className="py-2 px-4 border-b">Duration</th>
                        <th className="py-2 px-4 border-b">Last Date</th>
                    </tr>
                </thead>
                <tbody>
                    {FinancialInfoChartData.map((dataPoint, index) => (
                        <tr key={index}
                            className={index % 2 === 0 ? 'bg-gray-100 cursor-pointer hover:bg-gray-300' : 'bg-white cursor-pointer hover:bg-gray-300'}
                        >
                            <td className="py-2 px-4 border-b text-center">{dataPoint.userId}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.subscription}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.duration}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.lastDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
  
export default FinancialInfoTable;