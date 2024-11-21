import Link from "next/link";

export default function InternalSideNav() {
    return (
        <div className="flex flex-col bg-gray-800 shadow-inner py-4 md:h-full md:px-2">
            <div className="flex flex-col">
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-gray-600 rounded-xl"
                    href="/internal"
                >
                    <div className="text-lg text-white">
                        <h1>Home</h1>
                    </div>
                </Link>
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-gray-600 rounded-xl"
                    href="/internal/account/"
                >
                    <div className="text-lg text-white">
                        <h1>Accounts Data</h1>
                    </div>
                </Link>
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-gray-600 rounded-xl"
                    href="/internal/usage/"
                >
                    <div className="text-lg text-white">
                        <h1>Usage Information</h1>
                    </div>
                </Link>
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-gray-600 rounded-xl"
                    href="/internal/performance/"
                >
                    <div className="text-lg text-white">
                        <h1>Performance Data</h1>
                    </div>
                </Link>
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-gray-600 rounded-xl"
                    href="/internal/retention/"
                >
                    <div className="text-lg text-white">
                        <h1>Retention Metrics</h1>
                    </div>
                </Link>
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-gray-600 rounded-xl"
                    href="/internal/financial/"
                >
                    <div className="text-lg text-white">
                        <h1>Financial Data</h1>
                    </div>
                </Link>
                <Link
                    className="flex p-4 my-2 justify-start hover:bg-gray-600 rounded-xl"
                    href="/internal/log/"
                >
                    <div className="text-lg text-white">
                        <h1>Logs</h1>
                    </div>
                </Link>
            </div>
            <div className="mt-auto">
                <Link
                    className="flex p-4 justify-center items-center hover:bg-gray-600 rounded-xl bg-gray-700"
                    href="/dashboard/" >
                    <div className="text-lg text-white">
                        <h1>External</h1>
                    </div>
                </Link>
            </div>
        </div>
    )
}