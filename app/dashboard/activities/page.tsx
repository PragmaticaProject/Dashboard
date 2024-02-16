import Link from "next/link";
import ActivitiesList from "@/app/components/data/activitiesList";

export default function Page() {
    return (
        <div className="flex-col space-y-6">
            <h1 className="text-center text-2xl font-bold">Assigned Activities</h1>
            <ActivitiesList />
            <div className="flex mx-auto justify-center space-x-12">
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
            </div>
        </div>
    );
}
