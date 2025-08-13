"use client";

import { useMemo } from "react";

type UsageRange = "week" | "month" | "year";

interface UsageKpisProps {
    range: UsageRange;
    history: Record<string, Record<string, any>> | null;
}

interface ComputedKpis {
    totalMinutes: number;
    totalSessions: number;
    activeDays: number;
    avgMinutesPerDay: number;
    avgMinutesPerSession: number;
    mostPlayedActivity: string | null;
    lastActivityDate: string | null;
}

export default function UsageKpis({ range, history }: UsageKpisProps) {

    const windowDays = useMemo(() => {
        if (range === "week") return 7;
        if (range === "month") return 31;
        return 365;
    }, [range]);

    const kpis: ComputedKpis = useMemo(() => {
        if (!history) {
            return {
                totalMinutes: 0,
                totalSessions: 0,
                activeDays: 0,
                avgMinutesPerDay: 0,
                avgMinutesPerSession: 0,
                mostPlayedActivity: null,
                lastActivityDate: null,
            };
        }

        let totalMinutes = 0;
        let totalSessions = 0;
        const activeDates = new Set<string>();
        const activityCountMap = new Map<string, number>();
        let lastActivityTime = 0;

        Object.keys(history).forEach((activityName: string) => {
            Object.keys(history[activityName]).forEach((activityKey: string) => {
                const activity = history[activityName][activityKey];
                const [month, day, year] = activity["endDT"].substring(0, 10).split(":");
                const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                const daysDiff = Math.floor((Date.now() - activityDate.getTime()) / (1000 * 3600 * 24));
                if (daysDiff < windowDays) {
                    const durationMinutes = parseInt(activity["duration"]) || 0;
                    totalMinutes += durationMinutes;
                    totalSessions += 1;
                    const isoDate = activityDate.toISOString().substring(0, 10);
                    activeDates.add(isoDate);
                    const displayName: string = activity["name"] || activityName;
                    activityCountMap.set(displayName, (activityCountMap.get(displayName) || 0) + 1);
                    lastActivityTime = Math.max(lastActivityTime, activityDate.getTime());
                }
            });
        });

        const activeDays = activeDates.size;
        const avgMinutesPerDay = activeDays > 0 ? totalMinutes / activeDays : 0;
        const avgMinutesPerSession = totalSessions > 0 ? totalMinutes / totalSessions : 0;

        let mostPlayedActivity: string | null = null;
        let mostPlayedCount = -1;
        activityCountMap.forEach((count, name) => {
            if (count > mostPlayedCount) {
                mostPlayedCount = count;
                mostPlayedActivity = name;
            }
        });

        const lastActivityDate = lastActivityTime
            ? new Date(lastActivityTime).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
            : null;

        return {
            totalMinutes,
            totalSessions,
            activeDays,
            avgMinutesPerDay,
            avgMinutesPerSession,
            mostPlayedActivity,
            lastActivityDate,
        };
    }, [history, windowDays]);

    const title = useMemo(() => {
        if (range === "week") return "Last 7 Days";
        if (range === "month") return "Last 30 Days";
        return "Past 12 Months";
    }, [range]);

    return (
        <div className="mx-auto w-full">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <KpiCard label="Total Minutes" value={formatNumber(kpis.totalMinutes)} />
                <KpiCard label="Sessions" value={formatNumber(kpis.totalSessions)} />
                <KpiCard label="Active Days" value={formatNumber(kpis.activeDays)} />
                <KpiCard label="Avg min/day" value={formatNumber(kpis.avgMinutesPerDay, true)} />
                <KpiCard label="Avg min/session" value={formatNumber(kpis.avgMinutesPerSession, true)} />
                <KpiCard label="Most Played" value={kpis.mostPlayedActivity || "—"} />
            </div>
            <div className="mt-3 text-xs text-gray-500">
                <span className="mr-2 rounded-full bg-blue-50 px-2 py-1 text-blue-700">Latest</span>
                <span>{kpis.lastActivityDate || "No recent activity"}</span>
            </div>
        </div>
    );
}

function KpiCard({ label, value }: { label: string; value: string | number | undefined }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">{value ?? "—"}</div>
            <div className="mt-2 h-1 w-full rounded bg-blue-100">
                <div className="h-1 w-1/3 rounded bg-blue-600"></div>
            </div>
        </div>
    );
}

function formatNumber(value?: number, fixed?: boolean) {
    if (value === undefined || value === null || Number.isNaN(value)) return "0";
    const num = fixed ? Number(value.toFixed(1)) : Math.round(value);
    return Intl.NumberFormat().format(num);
}

