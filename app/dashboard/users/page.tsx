'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

interface User {
    userId: string;
    name: string;
    email: string;
}

export default function Page() {
    const [users, setUsers] = useState<User[]>([]);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                const userList: User[] = [];

                console.log("user: " + user?.uid);

                if (user) {
                    const snapshot = await get(child(ref(database), `prod/accounts`));

                    if (snapshot.exists()) {
                        const accounts = snapshot.val();
                        console.log("snapshot exists");

                        Object.keys(accounts).forEach((userKey: string) => {
                            const userData = accounts[userKey];

                            Object.keys(userData['admins']).forEach((adminId: string) => {

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

    const handleUserClick = (userId: string, name: string) => {
        localStorage.setItem("currentUser", userId);
        localStorage.setItem("currentName", name);
        router.push('/dashboard');
    };

    const displayedUsers = users.filter(({ name, email }) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
    });

    return (
        <div className="flex flex-col space-y-12 justify-center">
            <h1 className="text-4xl px-8 font-bold text-center">
                Choose a user to get started!
            </h1>
            <div className="mx-auto max-w-lg w-full px-8">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users by name or email"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={users.length === 0}
                />
            </div>
            <div className="mx-auto max-w-lg">
                {users.length > 0 && (
                    <table className="w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <th className="py-2 pl-4 text-center">User</th>
                        </thead>
                        <tbody>
                            {displayedUsers.length > 0 ? (
                                displayedUsers.map(({ userId, name, email }) => (
                                    <tr key={userId} className="border-b">
                                        <td className="py-4 px-24 text-center hover:bg-gray-100">
                                            <button onClick={() => handleUserClick(userId, name)}>
                                                <div>{name}</div>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="py-6 px-4 text-center text-gray-500">No users match your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
