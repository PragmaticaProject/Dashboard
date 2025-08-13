'use client';

import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import { useRouter } from 'next/navigation';

export default function Page() {
    const [name, setName] = useState();
    
    interface User {
        userId: string;
        name: string;
        email: string;
    }

    const [users, setUsers] = useState<User[]>([]);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    // Fetch admin display name
                    const snapshot = await get(child(ref(database), `prod/admins/${user.uid}`));

                    if (snapshot.exists()) {
                        setName(snapshot.val()['name']);
                    }
                    
                    // Fetch accounts this admin has access to and build user list
                    const accountsSnapshot = await get(child(ref(database), `prod/accounts`));
                    if (accountsSnapshot.exists()) {
                        const accounts = accountsSnapshot.val();
                        const userList: User[] = [];

                        Object.keys(accounts).forEach((userKey: string) => {
                            const userData = accounts[userKey];
                            const admins = userData['admins'] || {};

                            Object.keys(admins).forEach((adminId: string) => {
                                if (adminId === user.uid) {
                                    userList.push({
                                        userId: userKey,
                                        name: userData['email'].split('@')[0],
                                        email: userData['email']
                                    });
                                }
                            });
                        });

                        setUsers(userList);
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

    const handleUserClick = (userId: string, displayName: string) => {
        localStorage.setItem("currentUser", userId);
        localStorage.setItem("currentName", displayName);
        router.push('/dashboard');
    };
    
    const displayedUsers = users.filter(({ name: userName, email }) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return userName.toLowerCase().includes(q) || email.toLowerCase().includes(q);
    });
    
    return (
        <div className="flex flex-col items-center space-y-8 px-6">
            <div className="text-center space-y-2 mt-4">
                <h1 className="text-4xl font-semibold">Welcome {name ? `, ${name}` : ''}</h1>
                <p className="text-gray-600">Select a user to view their data</p>
            </div>

            <div className="w-full max-w-4xl space-y-4">
                <div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users by name or email"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={users.length === 0}
                    />
                </div>

                {users.length > 0 ? (
                    displayedUsers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {displayedUsers.map(({ userId, name: userName, email }) => (
                                <button
                                    key={userId}
                                    onClick={() => handleUserClick(userId, userName)}
                                    className="group text-left p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-300 transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="text-lg font-semibold group-hover:text-blue-600 transition">{userName}</div>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">{email}</div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full text-center text-gray-500 py-12">No users match your search.</div>
                    )
                ) : (
                    <div className="w-full text-center text-gray-500 py-12">No users found.</div>
                )}
            </div>
        </div>
    );
}