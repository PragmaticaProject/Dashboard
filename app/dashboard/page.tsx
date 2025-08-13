'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import Link from "next/link";
import AssignedActivitiesList from "../components/data/assignedActivitiesList";

export default function Page() {
    const [name, setName] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `prod/users/${userId}`));
                    
                    if (snapshot.exists()) {
                        console.log("Snapshot exists:", snapshot.exists());
                        const userName = snapshot.val()['name'];
                        setName(userName);
                    }
                } else {
                    console.log("User not found.");
                    router.push('/users');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-10">
                    {isLoading ? (
                        <div className="animate-pulse">
                            <div className="h-8 w-56 bg-slate-200 rounded mb-3"></div>
                            <div className="h-4 w-80 bg-slate-200 rounded"></div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                                {name ? `${name}'s Dashboard` : 'Dashboard'}
                            </h1>
                            <p className="mt-2 text-slate-600">
                                Navigate {name}'s analytics and assigned activities.
                            </p>
                        </div>
                    )}
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/dashboard/weekly/" className="group rounded-2xl p-5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg ring-1 ring-white/10 transition-all hover:shadow-xl hover:-translate-y-0.5">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm opacity-90">Reports</div>
                                <h3 className="mt-1 text-xl font-semibold">Weekly Data</h3>
                            </div>
                            <svg className="h-6 w-6 opacity-90 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                        <p className="mt-3 text-sm opacity-90">View weekly trends, usage, and performance insights.</p>
                    </Link>

                    <Link href="/dashboard/monthly/" className="group rounded-2xl p-5 bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-lg ring-1 ring-white/10 transition-all hover:shadow-xl hover:-translate-y-0.5">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm opacity-90">Reports</div>
                                <h3 className="mt-1 text-xl font-semibold">Monthly Data</h3>
                            </div>
                            <svg className="h-6 w-6 opacity-90 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                        <p className="mt-3 text-sm opacity-90">Analyze monthly summaries and deeper patterns.</p>
                    </Link>

                    <Link href="/dashboard/total/" className="group rounded-2xl p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg ring-1 ring-white/10 transition-all hover:shadow-xl hover:-translate-y-0.5">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm opacity-90">Reports</div>
                                <h3 className="mt-1 text-xl font-semibold">Yearly Data</h3>
                            </div>
                            <svg className="h-6 w-6 opacity-90 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                        <p className="mt-3 text-sm opacity-90">See long-term progress and aggregate stats.</p>
                    </Link>
                </div>

                {/* Assigned Activities */}
                {name && (
                    <div className="mt-10">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between px-5 pt-5">
                                <h2 className="text-lg font-semibold text-slate-900">Assigned Activities</h2>
                                <Link href="/dashboard/activities" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</Link>
                            </div>
                            <div className="p-5">
                                <AssignedActivitiesList />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}