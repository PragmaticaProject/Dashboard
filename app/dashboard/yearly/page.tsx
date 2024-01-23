import PerformanceGraph from "@/app/components/data/performanceGraph";

export default function Page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl p-8 font-bold text-center">Yearly Performance</h1>
                <PerformanceGraph />
            </div>
        </div>
    )
}