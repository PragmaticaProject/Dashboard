'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import MonthlyUsageGraph from "../components/data/monthlyUsageGraph";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function Page() {
    const [name, setName] = useState();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    //const snapshot = await get(child(ref(database), `pilot/users/${user.uid}`));
                    const snapshot = await get(child(ref(database), `pilot/users/7TgDiZLWHdSBi9qhtqeImsj35c73`));
                    
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
        <div className="p-8 space-y-6">
            {name && (
                <div>
                    <h1 className="text-4xl p-8 font-bold text-center">
                        User: {name}
                    </h1>
                    <div className="text-2xl font-bold text-center">
                        <h1>Monthly Usage</h1>
                    </div>
                    <MonthlyUsageGraph />
                </div>
            )}
        </div>
    );
}
