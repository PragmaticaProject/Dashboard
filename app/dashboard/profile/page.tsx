'use client';

import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import Link from "next/link";

export default function Page() {
    const [name, setName] = useState();
    const [org, setOrg] = useState();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    const snapshot = await get(child(ref(database), `pilot/clinicians/${user.uid}`));

                    if (snapshot.exists()) {
                        setName(snapshot.val()['name']);
                        setOrg(snapshot.val()['organization']);
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
        <div className="flex flex-col justify-center text-center space-y-12">
            <h1 className="text-4xl font-bold">Welcome to the Pragmatica Dashboard</h1>
            {(
                <div className="mx-auto px-16 py-16 space-y-6 rounded-lg shadow-xl text-2xl">
                    <h1>Name: {name}</h1>
                    <h1>Organization: {org}</h1>
                    <div className="py-8 space-y-6">
                        <h1 className="text-2xl font-bold">Select a user to view their data</h1>
                        <Link 
                            className="mx-auto flex w-48 px-4 py-2 my-2 justify-center bg-blue-500 hover:bg-blue-400 rounded-xl"
                            href="/dashboard/users">
                            <div className="text-lg font-bold text-white flex">
                                <h1>Users</h1>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}