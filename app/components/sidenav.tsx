import Link from 'next/link';

export default function SideNav() {
    return (
        <div className="flex flex-col bg-blue-500 shadow-inner py-4 md:h-full md:px-2">
            <div className="flex flex-col">
                <Link 
                className="flex px-4 py-2 my-2 justify-start hover:bg-blue-400 rounded-xl"
                href="/dashboard"
                >
                    <div className="text-lg text-white">
                        <h1>Home</h1>
                    </div>
                </Link>
                <Link 
                className="flex px-4 py-2 my-2 justify-start hover:bg-blue-400 rounded-xl"
                href="/dashboard/info/"
                >
                    <div className="text-lg text-white">
                        <h1>User Info</h1>
                    </div>
                </Link>
                <Link 
                className="flex px-4 py-2 my-2 justify-start hover:bg-blue-400 rounded-xl"
                href="/dashboard/activities/"
                >
                    <div className="text-lg text-white">
                        <h1>Activities</h1>
                    </div>
                </Link>
                <Link 
                className="flex px-4 py-2 my-2 justify-start hover:bg-blue-400 rounded-xl"
                href="/dashboard/weekly/"
                >
                    <div className="text-lg text-white">
                        <h1>Weekly Data</h1>
                    </div>
                </Link>
                <Link 
                className="flex px-4 py-2 my-2 justify-start hover:bg-blue-400 rounded-xl"
                href="/dashboard/monthly/"
                >
                    <div className="text-lg text-white">
                        <h1>Monthly Data</h1>
                    </div>
                </Link>
                <Link 
                className="flex px-4 py-2 my-2 justify-start hover:bg-blue-300 rounded-xl"
                href="/dashboard/total/"
                >
                    <div className="text-lg text-white">
                        <h1>Yearly Data</h1>
                    </div>
                </Link>
            </div>
        </div>
    )
}