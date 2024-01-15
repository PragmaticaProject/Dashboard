import Link from 'next/link';

export default function SideNav() {
    return (
        <div className="flex flex-col bg-blue-500 shadow-inner py-4 md:h-full md:px-2">
            <div className="flex flex-col">
                <Link 
                className="flex my-2 justify-center p-4 hover:bg-blue-300 rounded-xl"
                href="/"
                >
                    <div className="text-lg text-white">
                        <h1>Home</h1>
                    </div>
                </Link>
                <Link 
                className="flex my-2 justify-center p-4 hover:bg-blue-300 rounded-xl"
                href="/"
                >
                    <div className="text-lg text-white">
                        <h1>Client Info</h1>
                    </div>
                </Link>
                <Link 
                className="flex my-2 justify-center p-4 hover:bg-blue-300 rounded-xl"
                href="/"
                >
                    <div className="text-lg text-white">
                        <h1>Activities</h1>
                    </div>
                </Link>
                <Link 
                className="flex my-2 justify-center p-4 hover:bg-blue-300 rounded-xl"
                href="/"
                >
                    <div className="text-lg text-white">
                        <h1>Targets</h1>
                    </div>
                </Link>
                <Link 
                className="flex my-2 justify-center p-4 hover:bg-blue-300 rounded-xl"
                href="/"
                >
                    <div className="text-lg text-white">
                        <h1>Progression</h1>
                    </div>
                </Link>
            </div>
        </div>
    )
}