"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

interface SubscriptionHistory {
    amount: string;
    confirmation_num: number;
    date: string;
    subscriptionDuration: number;
    subscriptionType: string;
}

interface PaymentDetails {
    email: string;
    subscription: string;
    subscription_time_end: string;
    subscription_history: Record<string, SubscriptionHistory>;
}

export default function Page() {
    const userId = useSearchParams().get("userId");
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (user && userId) {
                    const snapshot = await get(child(ref(database), `prod/accounts/${userId}`));

                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setPaymentDetails(data);
                    } else {
                        console.log("No data available");
                    }
                } else {
                    console.log("User not found.");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <div className="flex flex-col mx-auto space-y-8 max-w-4xl p-6">
            <h1 className="text-center text-3xl font-bold mb-4">Payment Details</h1>
            {paymentDetails ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-gray-700 text-lg font-semibold">Email</h2>
                            <p className="text-xl font-bold text-blue-600">{paymentDetails.email}</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-gray-700 text-lg font-semibold">Subscription Type</h2>
                            <p className="text-xl font-bold text-green-500 capitalize">{paymentDetails.subscription}</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6 md:col-span-2">
                            <h2 className="text-gray-700 text-lg font-semibold">Subscription Ends On</h2>
                            <p className="text-xl font-bold text-purple-600">{paymentDetails.subscription_time_end}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Subscription History</h2>
                        <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
                            <thead>
                                <tr className="bg-gray-800 text-white">
                                    <th className="py-3 px-4 border">Amount</th>
                                    <th className="py-3 px-4 border">Confirmation #</th>
                                    <th className="py-3 px-4 border">Date</th>
                                    <th className="py-3 px-4 border">Duration (Days)</th>
                                    <th className="py-3 px-4 border">Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(paymentDetails.subscription_history).map((key, index) => {
                                    const entry = paymentDetails.subscription_history[key];
                                    const formattedDate = new Date(
                                        entry.date.replace(/(\d+):(\d+):(\d+)/, "$3-$1-$2")
                                    ).toLocaleString();
                                    return (
                                        <tr
                                            key={index}
                                            className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                                        >
                                            <td className="py-3 px-4 border">${entry.amount}</td>
                                            <td className="py-3 px-4 border">{entry.confirmation_num}</td>
                                            <td className="py-3 px-4 border">{formattedDate}</td>
                                            <td className="py-3 px-4 border">{entry.subscriptionDuration}</td>
                                            <td className="py-3 px-4 border capitalize">{entry.subscriptionType}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500">Loading payment details...</p>
            )}
        </div>
    );
}
