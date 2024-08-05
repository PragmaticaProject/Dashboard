import MonthlyMinutesPlayedGraph from "@/app/components/data/monthlyMinutesPlayedGraph";
import MonthlyPerformanceGraph from "@/app/components/data/monthlyPerformanceGraph";
import MonthlyUsageGraph from "@/app/components/data/monthlyUsageGraph";

export default function Page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Last Month Performance</h1>
                <MonthlyPerformanceGraph />
            </div>
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Activities Played Last Month</h1>
                <MonthlyUsageGraph />
            </div>
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Minutes Played Last Month</h1>
                <MonthlyMinutesPlayedGraph />
            </div>
        </div>
    )
}