import MonthlyPerformanceGraph from "@/app/components/data/monthlyPerformanceGraph";
import MonthlyUsageGraph from "@/app/components/data/monthlyUsageGraph";

export default function Page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Monthly Usage</h1>
                <MonthlyUsageGraph />
            </div>
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Monthly Performance</h1>
                <MonthlyPerformanceGraph />
            </div>
        </div>
    )
}