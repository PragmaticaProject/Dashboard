import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
    return (
        <div className="flex flex-col md:flex-row w-full drop-shadow-lg bg-white justify-between items-center">
            <div className="flex mx-6 space-x-2 items-center">
                <Image
                    src="/Pragmatica Logo.png"
                    alt='Pragmatica Logo'
                    width={60}
                    height={60}
                    priority
                />
                <div className="text-black text-lg">
                    <h1>Pragmatica</h1>
                </div>
            </div>
            <div className="flex flex-col md:flex-row mx-auto">
                <Link 
                className="flex py-2 px-8 justify-center hover:bg-gray-300 rounded-lg"
                href="/dashboard/profile"
                >
                    <div className="text-md text-black">
                        <h1>Profile</h1>
                    </div>
                </Link>
                <Link 
                className="flex py-2 px-8 justify-center hover:bg-gray-300 rounded-lg"
                href="/dashboard/users"
                >
                    <div className="text-md text-black">
                        <h1>Users</h1>
                    </div>
                </Link>
                <Link 
                className="flex py-2 px-8 justify-center hover:bg-gray-300 rounded-lg"
                href="/dashboard/activityviewer"
                >
                    <div className="text-md text-black">
                        <h1>Activity Viewer</h1>
                    </div>
                </Link>
                <Link 
                className="flex py-2 px-8 justify-center hover:bg-gray-300 rounded-lg"
                href="/dashboard/product"
                >
                    <div className="text-md text-black">
                        <h1>Product</h1>
                    </div>
                </Link>
                <Link 
                className="flex py-2 px-8 justify-center hover:bg-gray-300 rounded-lg"
                href="/dashboard/support"
                >
                    <div className="text-md text-black">
                        <h1>Support</h1>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col md:flex-row justify-end items-center">
                <Link 
                className="flex mx-8 justify-center py-2 px-8 hover:bg-gray-300 rounded-lg"
                href="/"
                >
                    <div className="text-md text-black">
                        <h1>Sign Out</h1>
                    </div>
                </Link>
            </div>
        </div>
    )
}