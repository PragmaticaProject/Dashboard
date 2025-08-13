"use client";

import Link from "next/link";

export default function Page() {
    return(
        <div className="min-h-screen">
            <div className="flex flex-col mx-auto items-center space-y-16 px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 overflow-hidden min-h-[26rem] lg:min-h-[30rem] xl:min-h-[34rem]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl"></div>
                        <div className="relative p-10 flex flex-col items-center text-center gap-6 h-full justify-between">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                </svg>
                            </div> 
                            <div className="space-y-3">
                                <h2 className="text-3xl font-bold text-gray-800">iOS</h2>
                                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                    Take Pragmatica anywhere with our native iOS app. Seamlessly sync your progress across devices with intuitive touch controls.
                                </p>
                            </div>
                            <div className="mt-auto w-full">
                                <Link 
                                    className="flex py-4 px-8 justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl w-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                                    href="https://apps.apple.com/us/app/pragmatica/id6741081192"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>Download on App Store</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 overflow-hidden min-h-[26rem] lg:min-h-[30rem] xl:min-h-[34rem]">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
                        <div className="relative p-10 flex flex-col items-center text-center gap-6 h-full justify-between">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 16L3 5h5.5l2 7L12 5h5.5L19 16h-2.5L15 8.5L13.5 16h-3L9 8.5L7.5 16H5zm12.5 4.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-9 0c0 .83-.67 1.5-1.5 1.5S5.5 21.33 5.5 20.5 6.17 19 7 19s1.5.67 1.5 1.5z"/>
                                </svg>
                            </div>
                            
                            <div className="space-y-3">
                                <h2 className="text-3xl font-bold text-gray-800">Virtual Reality</h2>
                                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                    Immerse yourself completely in the Pragmatica universe. Experience unparalleled presence and interaction in virtual reality.
                                </p>
                            </div>

                            <div className="mt-auto w-full">
                                <Link 
                                    className="flex py-4 px-8 justify-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl w-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                                    href="https://www.meta.com/experiences/pragmatica/6886713338055803/"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>Get on Meta Quest</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 overflow-hidden min-h-[26rem] lg:min-h-[30rem] xl:min-h-[34rem]">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl"></div>
                        <div className="relative p-10 flex flex-col items-center text-center gap-6 h-full justify-between">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91V13.1l10 .15z"/>
                                </svg>
                            </div>
                            
                            <div className="space-y-3">
                                <h2 className="text-3xl font-bold text-gray-800">Windows</h2>
                                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                    Enjoy the full desktop experience with enhanced graphics, keyboard shortcuts, and optimized performance on Windows PC.
                                </p>
                            </div>

                            <div className="mt-auto w-full">
                                <Link 
                                    className="flex py-4 px-8 justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl w-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                                    href="https://d291cxxe3xwa1w.cloudfront.net/PragmaticaSetup.exe"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>Download for PC</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                        </svg>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}