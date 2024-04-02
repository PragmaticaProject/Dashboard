import Link from "next/link";
import AssignedActivitiesList from "@/app/components/data/assignedActivitiesList";
import RecommendedActivitiesList from "@/app/components/data/recommendedActivities";

export default function Page() {
    return (
        <div className="flex flex-col lg:flex-row justify-center space-y-6 lg:space-y-0 space-x-0 lg:space-x-12">
            <div className="w-1/4 text-center">
                <AssignedActivitiesList />
            </div>
            <div className="w-1/4 text-center">
                <RecommendedActivitiesList />
            </div>
            {/* <div className="flex mx-auto justify-center space-x-12">
                <Link 
                    className="flex w-48 px-4 py-2 my-2 justify-center bg-blue-500 hover:bg-blue-400 rounded-xl"
                    href="">
                    <div className="text-lg text-white flex">
                        <h1>Add Activity</h1>
                    </div>
                </Link>
                <Link 
                    className="flex w-48 px-4 py-2 my-2 justify-center bg-blue-500 hover:bg-blue-400 rounded-xl"
                    href="">
                    <div className="text-lg text-white flex">
                        <h1>Remove Activity</h1>
                    </div>
                </Link>
            </div> */}
        </div>
    );
}
