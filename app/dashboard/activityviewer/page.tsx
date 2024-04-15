"use client";

import { useEffect, useState, ChangeEvent } from 'react';

export default function Page() {
    const [selectedVideo, setSelectedVideo] = useState('https://www.youtube.com/embed/NIYWhD4ZRl8');

    const handleVideoChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const videoUrlMap = {
            'Chatting With A Neighbor': 'https://www.youtube.com/embed/eA2ryzCbxAI',
            'Order A Burger': 'https://www.youtube.com/embed/gyYABXMGgFo',
            'Quiet Library 1': 'https://www.youtube.com/embed/bOxlhhjB8JQ',
            'School Schedule': 'https://www.youtube.com/embed/d0CjcXdqUoQ',
            'Supermarket': 'https://www.youtube.com/embed/FtCdeK2StZU',
            'Understanding Intentions': 'https://www.youtube.com/embed/TETYhIDraKc',
            'Initiating A Conversation': 'https://www.youtube.com/embed/PUQnEpWPB90',
            'Navigating A Bus Route': 'https://www.youtube.com/embed/50pR-EpaBxg',
            'Order A Combo': 'https://www.youtube.com/embed/dUjhXTCEapI',
            'Prosody': 'https://www.youtube.com/embed/NhevB9eq6t0',
            'Quiet Library 2': 'https://www.youtube.com/embed/uVcToHevNcs',
            'Toy Taken Away': 'https://www.youtube.com/embed/lv4GuNYqUGw',
            'Tutorial': 'https://www.youtube.com/embed/o4t2X4aYfR4',
            'Whats in the Box': 'https://www.youtube.com/embed/w74jir28h0M',
            'Cafe': 'https://www.youtube.com/embed/YhjX0h4A_BM',
            'Chatting With A Friend': 'https://www.youtube.com/embed/rtfUbtkitcM',
            'Giving Directions': 'https://www.youtube.com/embed/9mztWE3ddCA'
        };
        setSelectedVideo(videoUrlMap[event.target.value as keyof typeof videoUrlMap]);
    };

    return (
        <div className="flex flex-col mx-auto items-center space-y-8">
            <h1 className="text-center font-bold text-4xl">Activity Viewer</h1>
            <h1 className="text-center font-bold text-xl">Choose an activity from the dropdown list below:</h1>
            <select
                onChange={handleVideoChange}
                className="mb-4 text-center form-select appearance-none block w-1/2 px-4 py-4 bg-white border border-gray-700 border-2 bg-clip-padding bg-no-repeat rounded-xl transition ease-in-out m-0"
            >
                <option>Cafe</option>
                <option>Chatting With A Neighbor</option>
                <option>Chatting With A Friend</option>
                <option>Giving Directions</option>
                <option>Initiating A Conversation</option>
                <option>Navigating A Bus Route</option>
                <option>Order A Burger</option>
                <option>Order A Combo</option>
                <option>Prosody</option>
                <option>Quiet Library 1</option>
                <option>Quiet Library 2</option>
                <option>School Schedule</option>
                <option>Supermarket</option>
                <option>Understanding Intentions</option>
                <option>Toy Taken Away</option>
                <option>Tutorial</option>
                <option>Whats in the Box</option>
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
