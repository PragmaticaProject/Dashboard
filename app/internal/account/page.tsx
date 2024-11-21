"use client";

import { useEffect, useState } from 'react';
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";
import AccountsInfoTable from '@/app/components/data/accountsInfoTable';

interface AccountsInfoChartData {
    userId: string;
    email: string;
    subscription: string;
    duration: string;
    lastDate: string;
}

export default function Page() {

    const [AccountsInfoChartData, setAccountsInfoChartData] = useState<AccountsInfoChartData[]>([]);
    const [accountCount, setAccountCount] = useState<number>(0);
    const [basicCount, setBasicCount] = useState<number>(0);
    const [premiumCount, setPremiumCount] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user) {
                    const snapshot = await get(child(ref(database), `prod/accounts`));

                    if (snapshot.exists()) {
                        console.log("snapshot found.");
                        const newAccountsInfoChartData: AccountsInfoChartData[] = [];

                        const accountKeys = Object.keys(snapshot.val());
                        setAccountCount(accountKeys.length);

                        let basic = 0;
                        let premium = 0;

                        Object.keys(snapshot.val()).forEach((userKey: string) => {
                            console.log(userKey);

                            const user = snapshot.val()[userKey];
                            const email = user['email'];
                            const subscription = user['subscription'];

                            if (subscription === 'basic') {
                                basic++;
                            } else if (subscription === 'premium') {
                                premium++;
                            }

                            const [month, day, year] = user['subscription_time_end'].substring(0, 10).split(':');
                            const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            const lastDate = dateObj.toLocaleString('default', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            });

                            const history = user['subscription_history'];
                            let duration = "-";
                            Object.keys(history).forEach((paymentKey: string) => {
                                const payment = history[paymentKey];
                                duration = payment['subscriptionDuration'];
                            });

                            newAccountsInfoChartData.push({
                                userId: userKey,
                                email: email,
                                subscription: subscription,
                                duration: duration,
                                lastDate: lastDate
                            });
                        });

                        setAccountsInfoChartData(newAccountsInfoChartData);
                        setBasicCount(basic);
                        setPremiumCount(premium);
                    } else {
                        console.log("No data available");
                    }
                } else {
                    console.log("user not found.");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col p-8 space-y-12">
            <div className="text-4xl font-bold text-center">
                <h1>Accounts Data</h1>
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
            <div>
                {AccountsInfoChartData.length > 0 ? (
                    <AccountsInfoTable AccountsInfoChartData={AccountsInfoChartData} />
                ) : (
                    <p className="text-center text-gray-500">No data available.</p>
                )}
            </div>
        </div>
    );
};