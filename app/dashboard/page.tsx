'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import MonthlyPerformanceGraph from "../components/data/monthlyPerformanceGraph";

export default function Page() {
    const [name, setName] = useState();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `pilot/users/${userId}`));
                    
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
                        <h1>App Usage</h1>
                    </div>
                    <MonthlyPerformanceGraph />
                </div>
            )}
        </div>
    );
}