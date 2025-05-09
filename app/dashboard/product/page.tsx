"use client";

import Link from "next/link";

export default function Page() {
    return(
        <div className="flex flex-col mx-auto items-center space-y-12 text-xl">
            <h1 className="text-4xl font-bold text-center">Pragmatica can be downloaded in 3 platforms!</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                <div className="flex flex-col items-center p-6 border rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">iOS</h2>
                    <Link 
                        className="flex py-4 px-8 justify-center bg-blue-500 hover:bg-blue-400 rounded-xl w-full"
                        href="https://apps.apple.com/us/app/pragmatica/id6741081192"
                    >
                        <div className="text-white">
                            <h1>iOS App</h1>
                        </div>
                    </Link>
                </div>
                <div className="flex flex-col items-center p-6 border rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">VR</h2>
                    <Link 
                        className="flex py-4 px-8 justify-center bg-purple-500 hover:bg-purple-400 rounded-xl w-full"
                        href="https://www.meta.com/experiences/pragmatica/6886713338055803/"
                    >
                        <div className="text-white">
                            <h1>Download Now</h1>
                        </div>
                    </Link>
                </div>
                <div className="flex flex-col items-center p-6 border rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Windows</h2>
                    <Link 
                        className="flex py-4 px-8 justify-center bg-green-500 hover:bg-green-400 rounded-xl w-full"
                        href="https://d291cxxe3xwa1w.cloudfront.net/PragmaticaSetup.exe"
                    >
                        <div className="text-white">
                            <h1>Download Now</h1>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}