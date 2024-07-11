import Link from "next/link";
import AssignedActivitiesList from "@/app/components/data/assignedActivitiesList";
import RecommendedActivitiesList from "@/app/components/data/recommendedActivities";

export default function Page() {
    return (
        <div>
            <AssignedActivitiesList />
        </div>
    );
}
