"use client";

import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function Page() {
    const [name, setName] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    const snapshot = await get(child(ref(database), `pilot/users/${user.uid}`));
                    
                    if (snapshot.exists()) {
                        console.log("Snapshot exists:", snapshot.exists());
                        const userName = snapshot.val()['name'];
                        setName(userName);
                    }
                } else {
                    console.log("User not found.");
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
                </div>
            )}
        </div>
    );
}