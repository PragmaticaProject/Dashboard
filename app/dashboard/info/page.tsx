"use client";

import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function Page() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `pilot/users/${userId}`));
                    
                    if (snapshot.exists()) {
                        console.log("Snapshot exists:", snapshot.exists());
                        setName(snapshot.val()['name']);
                        setEmail(snapshot.val()['email']);
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
        <div>
            {name && email && (
                <div className="p-8 space-y-12">
                    <h1 className="text-4xl font-bold text-center">
                        User Info
                    </h1>
                    <h1 className="text-lg text-center">
                        Name: {name}
                    </h1>
                    <h1 className="text-lg text-center">
                        Email: {email}
                    </h1>
                </div>
            )}
        </div>
    );
}