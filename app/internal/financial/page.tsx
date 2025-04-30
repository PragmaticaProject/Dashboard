"use client";

import { useEffect, useState } from 'react';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import FinancialInfoTable from '@/app/components/data/financialInfoTable';

interface FinancialInfoChartData {
    userId: string;
    subscription: string;
    duration: string;
    lastDate: string;
}

export default function Page() {

    const [FinancialInfoChartData, setFinancialInfoChartData] = useState<FinancialInfoChartData[]>([]);
    const [accountCount, setAccountCount] = useState<number>(0);
    const [basicCount, setBasicCount] = useState<number>(0);
    const [premiumCount, setPremiumCount] = useState<number>(0);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [revenueFromBasic, setRevenueFromBasic] = useState<number>(0);
    const [revenueFromPremium, setRevenueFromPremium] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const snapshot = await get(child(ref(database), `prod/accounts`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");
                        const newFinancialInfoChartData: FinancialInfoChartData[] = [];

                        const accountKeys = Object.keys(snapshot.val());
                        setAccountCount(accountKeys.length);

                        let basic = 0;
                        let premium = 0;
                        let basicRevenue = 0;
                        let premiumRevenue = 0;
                        let totRevenue = 0;

                        Object.keys(snapshot.val()).forEach((userKey: string) => {

                            const user = snapshot.val()[userKey];

                            if (user['role'] !== 'internal') {
                                const email = user['email'];
                                const subscription = user['subscription'];

                                if (subscription === 'basic') {
                                    basic++;
                                } else if (subscription === 'premium') {
                                    premium++;
                                }

                                const lastDate = formatDate(user['subscription_time_end']);

                                const history = user['subscription_history'];
                                let duration = "-";
                                
                                if (history) {
                                    Object.keys(history).forEach((paymentKey: string) => {
                                        const payment = history[paymentKey];
                                        duration = payment['subscriptionDuration'];
                                        
                                        const amount = Number(payment['amount'])
                                        totRevenue += amount;
                                        if (subscription == 'basic') {
                                            basicRevenue += amount;
                                        } else if (subscription == 'premium') {
                                            premiumRevenue += amount;
                                        }
                                    });
                                }

                                newFinancialInfoChartData.push({
                                    userId: userKey,
                                    subscription: subscription,
                                    duration: duration,
                                    lastDate: lastDate
                                });
                            }
                        });

                        setFinancialInfoChartData(newFinancialInfoChartData);
                        setBasicCount(basic);
                        setPremiumCount(premium);
                        setRevenueFromBasic(basicRevenue);
                        setRevenueFromPremium(premiumRevenue);
                        setTotalRevenue(Number(totRevenue.toFixed(2)));
                    } else {
                        console.log("No data available in Firebase");
                        setFinancialInfoChartData([]);
                    }
                } else {
                    console.log("User not authenticated");
                    setFinancialInfoChartData([]);
                }
            } catch (error) {
                console.error("Error fetching financial data:", error);
                setFinancialInfoChartData([]);
            }
        };

        fetchData();
    }, []);

    const formatDate = (date: string) => {
        const [datePart, timePart] = date.split(' ');
        const [month, day, year] = datePart.split(':');
        const formattedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return formattedDate.toLocaleDateString('en-US', options);
    };

    return (
        <div className="flex flex-col p-8 space-y-12">
            <div className="text-4xl font-bold text-center">
                <h1>Financial Data</h1>
            </div>
            <div className="flex flex-wrap justify-center space-x-12">
                <div className="w-72 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-gray-700 text-lg font-semibold">Total Accounts</h2>
                    <p className="text-3xl font-bold text-blue-600">{accountCount}</p>
                </div>
                <div className="w-72 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-gray-700 text-lg font-semibold">Basic Subscriptions</h2>
                    <p className="text-3xl font-bold text-green-500">{basicCount}</p>
                </div>
                <div className="w-72 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-gray-700 text-lg font-semibold">Premium Subscriptions</h2>
                    <p className="text-3xl font-bold text-purple-500">{premiumCount}</p>
                </div>
            </div>
            <div className="flex flex-wrap justify-center space-x-12">
                <div className="w-72 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-gray-700 text-lg font-semibold">Total Revenue</h2>
                    <p className="text-3xl font-bold text-blue-600">${totalRevenue}</p>
                </div>
                <div className="w-72 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-gray-700 text-lg font-semibold">Revenue From Basic</h2>
                    <p className="text-3xl font-bold text-green-500">${revenueFromBasic}</p>
                </div>
                <div className="w-72 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-gray-700 text-lg font-semibold">Revenue From Premium</h2>
                    <p className="text-3xl font-bold text-purple-500">${revenueFromPremium}</p>
                </div>
            </div>
            <div>
                {FinancialInfoChartData.length > 0 ? (
                    <FinancialInfoTable FinancialInfoChartData={FinancialInfoChartData} />
                ) : (
                    <p className="text-center text-gray-500">No data available.</p>
                )}
            </div>
        </div>
    );
};