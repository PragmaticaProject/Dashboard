"use client";

import Link from "next/link";

export default function SideNav({ isInternal }: { isInternal: boolean }) {

    return (
        <div className="flex flex-col bg-blue-500 shadow-inner py-4 md:h-full md:px-2">
            <div className="flex flex-col">
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-blue-400 rounded-xl"
                    href="/dashboard"
                >
                    <div className="text-lg text-white">
                        <h1>Home</h1>
                    </div>
                </Link>
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-blue-400 rounded-xl"
                    href="/dashboard/info/"
                >
                    <div className="text-lg text-white">
                        <h1>User Info</h1>
                    </div>
                </Link>
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-blue-400 rounded-xl"
                    href="/dashboard/activities/"
                >
                    <div className="text-lg text-white">
                        <h1>Activities</h1>
                    </div>
                </Link>
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-blue-400 rounded-xl"
                    href="/dashboard/sessions/"
                >
                    <div className="text-lg text-white">
                        <h1>Sessions</h1>
                    </div>
                </Link>
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-blue-400 rounded-xl"
                    href="/dashboard/weekly/"
                >
                    <div className="text-lg text-white">
                        <h1>Weekly Data</h1>
                    </div>
                </Link>
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-blue-400 rounded-xl"
                    href="/dashboard/monthly/"
                >
                    <div className="text-lg text-white">
                        <h1>Monthly Data</h1>
                    </div>
                </Link>
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-blue-300 rounded-xl"
                    href="/dashboard/total/"
                >
                    <div className="text-lg text-white">
                        <h1>Yearly Data</h1>
                    </div>
                </Link>
            </div>
            <div className="mt-auto">
                {isInternal && (
                    <Link
                        className="flex p-4 mb-14 justify-center items-center hover:bg-gray-600 rounded-xl bg-gray-700"
                        href="/internal/"
                    >
                        <div className="text-lg text-white">
                            <h1>Internal</h1>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}
