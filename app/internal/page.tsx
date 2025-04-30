"use client";

import { useEffect, useState } from 'react';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function Page() {
    const [basicCount, setBasicCount] = useState<number>(0);
    const [premiumCount, setPremiumCount] = useState<number>(0);
    const [newCustomersThisWeek, setNewCustomersThisWeek] = useState<number>(0);
    const [newCustomersThisMonth, setNewCustomersThisMonth] = useState<number>(0);
    const [newCustomersThisYear, setNewCustomersThisYear] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const snapshot = await get(child(ref(database), `prod/accounts`));
                    
                    if (snapshot.exists()) {
                        let basic = 0;
                        let premium = 0;
                        let weekCount = 0;
                        let monthCount = 0;
                        let yearCount = 0;

                        const now = new Date();
                        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

                        Object.keys(snapshot.val()).forEach((userKey: string) => {
                            const user = snapshot.val()[userKey];
                            if (user['role'] !== 'internal') {
                                const subscription = user['subscription'];
                                if (subscription === 'basic') {
                                    basic++;
                                } else if (subscription === 'premium') {
                                    premium++;
                                }

                                if (user['subscription_time_start']) {
                                    const createdDate = new Date(formatToDate(user['subscription_time_start']));
                                    if (createdDate >= oneWeekAgo) weekCount++;
                                    if (createdDate >= oneMonthAgo) monthCount++;
                                    if (createdDate >= oneYearAgo) yearCount++;
                                }
                            }
                        });

                        setBasicCount(basic);
                        setPremiumCount(premium);
                        setNewCustomersThisWeek(weekCount);
                        setNewCustomersThisMonth(monthCount);
                        setNewCustomersThisYear(yearCount);
                    }
                }
            } catch (error) {
                console.error("Error fetching subscription data:", error);
            }
        };

        fetchData();
    }, []);

    const formatToDate = (date: string) => {
        const [datePart, timePart] = date.split(' ');
        const [month, day, year] = datePart.split(':');
        const formattedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return formattedDate;
    };

    const sections = [
        { title: "Accounts Data", href: "/internal/account/", color: "bg-blue-500", hoverColor: "hover:bg-blue-400", icon: "👤" },
        { title: "Usage Information", href: "/internal/usage/", color: "bg-green-500", hoverColor: "hover:bg-green-400", icon: "📊" },
        { title: "Performance Data", href: "/internal/performance/", color: "bg-purple-500", hoverColor: "hover:bg-purple-400", icon: "⚡" },
        { title: "Retention Metrics", href: "/internal/retention/", color: "bg-yellow-500", hoverColor: "hover:bg-yellow-400", icon: "📈" },
        { title: "Financial Data", href: "/internal/financial/", color: "bg-red-500", hoverColor: "hover:bg-red-400", icon: "💰" },
        { title: "Logs", href: "/internal/log/", color: "bg-gray-500", hoverColor: "hover:bg-gray-400", icon: "📜" },
    ];

    return (
        <div className="flex flex-col items-center space-y-8 p-6 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800">Internal Dashboard</h1>
            
            {/* Subscription Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-screen-lg">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Subscription Overview</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-blue-800">Basic Licenses</h3>
                            <p className="text-3xl font-bold text-blue-600">{basicCount}</p>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-purple-800">Premium Licenses</h3>
                            <p className="text-3xl font-bold text-purple-600">{premiumCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">New Customers</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-green-800">This Week</h3>
                            <p className="text-3xl font-bold text-green-600">{newCustomersThisWeek}</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-yellow-800">This Month</h3>
                            <p className="text-3xl font-bold text-yellow-600">{newCustomersThisMonth}</p>
                        </div>
                        <div className="bg-red-100 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-red-800">This Year</h3>
                            <p className="text-3xl font-bold text-red-600">{newCustomersThisYear}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-screen-lg">
                {sections.map((section, index) => (
                    <a
                        key={index}
                        href={section.href}
                        className={`flex flex-col items-center justify-center p-8 rounded-lg shadow-md text-white transition-shadow duration-300 ${section.color} ${section.hoverColor}`}
                        style={{ height: "200px" }}
                    >
                        <div className="text-6xl">{section.icon}</div>
                        <h2 className="mt-4 text-xl font-semibold">{section.title}</h2>
                    </a>
                ))}
            </div>
        </div>
    );
}
