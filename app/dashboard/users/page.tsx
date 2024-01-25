'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function Page() {
    const [users, setUsers] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    const snapshot = await get(child(ref(database), `pilot/clinicians/${user.uid}/users`));

                    if (snapshot.exists()) {
                        const userData = snapshot.val();

                        const userList = Object.entries(userData).map(([userId, userInfo]) => ({
                            userId,
                            ...(userInfo as { name: string; email: string }),
                        }));

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

    return (
        <div className="flex flex-col space-y-6 justify-center">
            <h1 className="text-4xl px-8 font-bold text-center">
                Welcome! 
            </h1>
            <h1 className="text-lg px-8 font-bold text-center">
                Choose a user to get started!
            </h1>
            <div className="mx-auto max-w-lg">
                {users.length > 0 && (
                    <table className="w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <th className="py-2 pl-4 text-center">User</th>
                        </thead>
                        <tbody>
                            {users.map(({ userId, name, email }) => (
                                <tr key={userId} className="border-b">
                                    <td className="py-4 px-24 text-center hover:bg-gray-100">
                                        <button onClick={() => handleUserClick(userId, name)}>
                                            <div>{name}</div>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
