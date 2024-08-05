import WeeklyMinutesPlayedGraph from "@/app/components/data/weeklyMinutesPlayedGraph";
import WeeklyPerformanceGraph from "@/app/components/data/weeklyPerformanceGraph";
import WeeklyUsageGraph from "@/app/components/data/weeklyUsageGraph";


export default function Page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Past Week Performance</h1>
                <WeeklyPerformanceGraph />
            </div>
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Activities Played Last Week</h1>
                <WeeklyUsageGraph />
            </div>
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Minutes Played Last Week</h1>
                <WeeklyMinutesPlayedGraph />
            </div>
        </div>
    )
}