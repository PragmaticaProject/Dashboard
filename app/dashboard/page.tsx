'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import PerformanceGraph from "../components/data/performanceGraph";
import Link from "next/link";

export default function Page() {
    const [name, setName] = useState();
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
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {name && (
                <div className="flex flex-col p-8 space-y-12">
                    <h1 className="text-4xl font-bold text-center">
                        User: {name}
                    </h1>
                    <div className="text-2xl font-bold text-center">
                        <h1>Performance</h1>
                    </div>
                    <PerformanceGraph />
                    <div className="flex flex-col md:flex-row space-x-6">
                        <div className="w-full bg-blue-500 border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                            <Link 
                            className="flex px-4 py-2 my-2 justify-center hover:bg-blue-400 rounded-xl"
                            href="/dashboard/weekly/"
                            >
                                <div className="text-lg text-white">
                                    <h1>Weekly Data</h1>
                                </div>
                            </Link>
                        </div>
                        <div className="w-full bg-blue-500 border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                            <Link 
                            className="flex px-4 py-2 my-2 justify-center hover:bg-blue-400 rounded-xl"
                            href="/dashboard/monthly/"
                            >
                                <div className="text-lg text-white">
                                    <h1>Monthly Data</h1>
                                </div>
                            </Link>
                        </div>
                        <div className="w-full bg-blue-500 border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                            <Link 
                            className="flex px-4 py-2 my-2 justify-center hover:bg-blue-400 rounded-xl"
                            href="/dashboard/total/"
                            >
                                <div className="text-lg text-white">
                                    <h1>Yearly Data</h1>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}