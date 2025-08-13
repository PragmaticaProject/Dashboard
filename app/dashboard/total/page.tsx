"use client";

import PerformanceGraph from "@/app/components/data/performanceGraph";
import YearlyHoursPlayedGraph from "@/app/components/data/yearlyHoursPlayedGraph";
import YearlyUsageGraph from "@/app/components/data/yearlyUsageGraph";
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
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Year to Date Overview</h1>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Past 12 Months</span>
                </div>
                <UsageKpis range="year" history={history} />
            </div>

            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">Activities Played</h2>
                    <YearlyUsageGraph history={history} />
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">Hours Played</h2>
                    <YearlyHoursPlayedGraph history={history} />
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-2">
                    <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">Performance</h2>
                    <PerformanceGraph history={history} />
                </div>
            </div>
        </div>
    )
}