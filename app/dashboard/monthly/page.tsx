import MonthlyMinutesPlayedGraph from "@/app/components/data/monthlyMinutesPlayedGraph";
import MonthlyPerformanceGraph from "@/app/components/data/monthlyPerformanceGraph";
import MonthlyUsageGraph from "@/app/components/data/monthlyUsageGraph";
import UsageKpis from "@/app/components/data/usageKpis";

export default function Page() {
    return (
        <div className="space-y-8 p-4 sm:p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-2 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Monthly Overview</h1>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Last 30 Days</span>
                </div>
                <UsageKpis range="month" />
            </div>

            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">Activities Played</h2>
                    <MonthlyUsageGraph />
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">Minutes Played</h2>
                    <MonthlyMinutesPlayedGraph />
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-2">
                    <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">Performance</h2>
                    <MonthlyPerformanceGraph />
                </div>
            </div>
        </div>
    )
}