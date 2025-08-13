"use client";

import MonthlyMinutesPlayedGraph from "@/app/components/data/monthlyMinutesPlayedGraph";
import MonthlyPerformanceGraph from "@/app/components/data/monthlyPerformanceGraph";
import MonthlyUsageGraph from "@/app/components/data/monthlyUsageGraph";
import UsageKpis from "@/app/components/data/usageKpis";
import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function Page() {
    const [history, setHistory] = useState<Record<string, Record<string, any>> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (!user) return;
                const userId = localStorage.getItem("currentUser");
                if (!userId) return;
                const snapshot = await get(child(ref(database), `prod/activities/history/${userId}`));
                if (snapshot.exists()) {
                    setHistory(snapshot.val());
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8 p-4 sm:p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-2 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Monthly Overview</h1>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Last 30 Days</span>
                </div>
                <UsageKpis range="month" history={history} />
            </div>

            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">Activities Played</h2>
                    <MonthlyUsageGraph history={history} />
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">Minutes Played</h2>
                    <MonthlyMinutesPlayedGraph history={history} />
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-2">
                    <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">Performance</h2>
                    <MonthlyPerformanceGraph history={history} />
                </div>
            </div>
        </div>
    )
}