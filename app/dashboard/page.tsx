'use client';

import MonthlyUsageGraph from "../components/data/monthlyUsageGraph";
export default function Page() {
    return (
        <div className="p-8 space-y-6">
            <div className="text-2xl font-bold text-center">
                <h1>Monthly Usage</h1>
            </div>
            <MonthlyUsageGraph />
        </div>
    )
}