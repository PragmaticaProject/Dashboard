import { ReactNode } from 'react';
import NavBar from '@/app/components/navbar';
import SideNav from '@/app/components/sidenav';

export default function Layout ({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col">
            <div className="flex md:flex-col w-full">
                <NavBar />
            </div>
            <div className="flex h-screen md:flex-row md:overflow-hidden">
                <div className="w-full flex-none md:w-48 lg:w-64">
                    <SideNav />
                </div>
                <div className="flex bg-gray-200 w-full md:overflow-y-auto md:p-12">{children}</div>    
            </div>
        </div>
    )
}