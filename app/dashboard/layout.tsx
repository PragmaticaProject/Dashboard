import { ReactNode } from 'react';
import NavBar from '@/app/components/navbar';
import SideNav from '@/app/components/sidenav';

export default function Layout ({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col">
            <div className="flex md:flex-col w-full">
                <NavBar />
            </div>
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-56">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
        </div>
    )
}