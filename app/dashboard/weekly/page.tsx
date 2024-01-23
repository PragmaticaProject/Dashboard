import WeeklyPerformanceGraph from "@/app/components/data/weeklyPerformanceGraph";
import WeeklyUsageGraph from "@/app/components/data/weeklyUsageGraph";


export default function Page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Weekly Usage</h1>
                <WeeklyUsageGraph />
            </div>
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Weekly Performance</h1>
                <WeeklyPerformanceGraph />
            </div>
        </div>
    )
}