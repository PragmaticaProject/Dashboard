import PerformanceGraph from "@/app/components/data/performanceGraph";
import YearlyUsageGraph from "@/app/components/data/yearlyUsageGraph";

export default function Page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Yearly Usage</h1>
                <YearlyUsageGraph />
            </div>
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Yearly Performance</h1>
                <PerformanceGraph />
            </div>
        </div>
    )
}