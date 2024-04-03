"use client";

import { useEffect, useState } from 'react';

export default function Page() {
    const [selectedVideo, setSelectedVideo] = useState('https://www.youtube.com/embed/NIYWhD4ZRl8');

    const handleVideoChange = (event) => {
        const videoUrlMap = {
            'Order A Burger': 'https://www.youtube.com/embed/gyYABXMGgFo',
            'Quiet Library 1': 'https://www.youtube.com/embed/bOxlhhjB8JQ',
            'Understanding Intentions': 'https://www.youtube.com/embed/TETYhIDraKc',
        };
        setSelectedVideo(videoUrlMap[event.target.value]);
    };

    return (
        <div className="flex flex-col mx-auto items-center space-y-8">
            <h1 className="text-center font-bold text-4xl">Activity Viewer</h1>
            <h1 className="text-center font-bold text-xl">Choose an activity from the dropdown list below:</h1>
            <select
                onChange={handleVideoChange}
                className="mb-4 text-center form-select appearance-none block w-1/2 px-4 py-4 bg-white border border-gray-700 border-2 bg-clip-padding bg-no-repeat rounded-xl transition ease-in-out m-0"
            >
                <option className='font-sans'>Order A Burger</option>
                <option className='font-sans'>Quiet Library 1</option>
                <option className='font-sans'>Understanding Intentions</option>
            </select>
            <div className="w-full max-w-4xl">
                <iframe
                    className="w-full aspect-video"
                    src={selectedVideo}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
}
