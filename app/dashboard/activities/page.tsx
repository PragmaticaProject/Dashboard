"use client";

import Link from "next/link";
import AssignedActivitiesList from "@/app/components/data/assignedActivitiesList";
import RecommendedActivitiesList from "@/app/components/data/recommendedActivities";
import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function Page() {
    const [assigned, setAssigned] = useState<Record<string, any> | null>(null);
    const [other, setOther] = useState<Record<string, any>>({});
    const [recommended, setRecommended] = useState<string[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;
                if (!user) return;
                const userId = localStorage.getItem("currentUser");
                if (!userId) return;

                const assignedSnapshot = await get(child(ref(database), `prod/users/${userId}/activities/assignedActivities`));
                const allActivitiesSnapshot = await get(child(ref(database), `prod/activities/collection`));
                const recommendedSnapshot = await get(child(ref(database), `prod/users/${userId}/activities/recommendedActivities/activitySet`));

                if (assignedSnapshot.exists()) {
                    setAssigned(assignedSnapshot.val());
                }
                if (allActivitiesSnapshot.exists()) {
                    const allActivities: Record<string, any> = allActivitiesSnapshot.val();
                    const assignedKeys = assignedSnapshot.exists() ? Object.keys(assignedSnapshot.val()) : [];
                    const filteredOtherActivities = Object.keys(allActivities)
                        .filter(key => !assignedKeys.includes(key))
                        .reduce((obj: Record<string, any>, key: string) => {
                            obj[key] = allActivities[key];
                            return obj;
                        }, {});
                    setOther(filteredOtherActivities);
                }
                if (recommendedSnapshot.exists()) {
                    const newData: string[] = [];
                    Object.keys(recommendedSnapshot.val()).forEach((orderKey: string) => {
                        const activity = recommendedSnapshot.val()[orderKey];
                        newData.push(activity);
                    });
                    setRecommended(newData);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <AssignedActivitiesList initialAssigned={assigned} initialOther={other} />
            <div className="mt-8">
                <RecommendedActivitiesList activities={recommended} />
            </div>
        </div>
    );
}
