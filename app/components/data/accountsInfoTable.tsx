'use client';

import React from 'react';

interface AccountsInfoChartData {
    userId: string;
    email: string;
    subscription: string;
    duration: string;
    lastDate: string;
}

interface AccountsInfoTableProps {
    AccountsInfoChartData: AccountsInfoChartData[];
}

const AccountsInfoTable: React.FC<AccountsInfoTableProps> = ({ AccountsInfoChartData }) => {

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-300 shadow rounded">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="py-2 px-4 border-b">User Id</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Subscription</th>
                        <th className="py-2 px-4 border-b">Duration</th>
                        <th className="py-2 px-4 border-b">Last Date</th>
                    </tr>
                </thead>
                <tbody>
                    {AccountsInfoChartData.map((dataPoint, index) => (
                        <tr key={index}
                            className={index % 2 === 0 ? 'bg-gray-100 cursor-pointer hover:bg-gray-300' : 'bg-white cursor-pointer hover:bg-gray-300'}
                        >
                            <td className="py-2 px-4 border-b text-center">{dataPoint.userId}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.email}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.subscription}</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.duration} days</td>
                            <td className="py-2 px-4 border-b text-center">{dataPoint.lastDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
  
export default AccountsInfoTable;