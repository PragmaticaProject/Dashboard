"use client";

import { ReactNode, useEffect, useState } from 'react';
import NavBar from '@/app/components/navbar';
import SideNav from '@/app/components/sidenav';
import { firebaseAuth, database } from '@/app/firebase';
import { ref, child, get } from 'firebase/database';

export default function Layout ({ children }: { children: ReactNode }) {
    const [isInternal, setIsInternal] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const snapshot = await get(child(ref(database), `prod/accounts/${user.uid}/role`));
                    if (snapshot.exists() && snapshot.val() === 'internal') {
                        setIsInternal(true);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchUserRole();
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex md:flex-col w-full">
                <NavBar />
            </div>
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-56">
                <SideNav isInternal={isInternal} />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
        </div>
    )
}