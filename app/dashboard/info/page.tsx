"use client";

import { useEffect, useState } from "react";
import { ref, child, get, update } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function Page() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [playMCAudio, setPlayMCAudio] = useState<boolean>(false);
    const [playSpeakingAudio, setPlaySpeakingAudio] = useState<boolean>(false);
    const [showMenuAudioButtons, setShowMenuAudioButtons] = useState<boolean>(false);
    const [showText, setShowText] = useState<boolean>(false);
    const [showTips, setShowTips] = useState<boolean>(false);
    const [useVoiceRecognition, setUseVoiceRecognition] = useState<boolean>(false);
    const [currentTokens, setCurrentTokens] = useState<number>(0);
    const [totalTokens, setTotalTokens] = useState<number>(0);
    const [usedTokens, setUsedTokens] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `prod/users/${userId}`));
                    
                    if (snapshot.exists()) {
                        console.log("Snapshot exists:", snapshot.exists());
                        setName(snapshot.val()['name']);
                        setEmail(snapshot.val()['email']);
                        const settings = snapshot.val()['settings'];
                        const stats = snapshot.val()['stats'];

                        setPlayMCAudio(settings['playMCAudio']);
                        setPlaySpeakingAudio(settings['playSpeakingAudio']);
                        setShowMenuAudioButtons(settings['showMenuAudioButtons']);
                        setShowText(settings['showText']);
                        setShowTips(settings['showTips']);
                        setUseVoiceRecognition(settings['useVoiceRecognition']);

                        setCurrentTokens(stats["currentTokens"]);
                        setTotalTokens(stats["totalTokens"]);
                        setUsedTokens(parseInt(stats["totalTokens"]) - parseInt(stats["currentTokens"]));
                    }
                } else {
                    console.log("User not found.");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleToggle = async (settingKey: string, value: boolean) => {
        try {
            const user = firebaseAuth.currentUser;

            if (user) {
                const userId = localStorage.getItem("currentUser");
                const updates = {
                    [`prod/users/${userId}/settings/${settingKey}`]: value,
                };

                await update(ref(database), updates);

                switch(settingKey) {
                    case "playMCAudio":
                        setPlayMCAudio(value);
                        break;
                    case "playSpeakingAudio":
                        setPlaySpeakingAudio(value);
                        break;
                    case "showMenuAudioButtons":
                        setShowMenuAudioButtons(value);
                        break;
                    case "showText":
                        setShowText(value);
                        break;
                    case "showTips":
                        setShowTips(value);
                        break;
                    case "useVoiceRecognition":
                        setUseVoiceRecognition(value);
                        break;
                    default:
                        console.log("Unknown setting key: " + settingKey);
                }
            } else {
                console.log("User not found.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex mx-auto justify-center flex-col md:flex-row">
            <div className="px-4">
                <h1 className="text-4xl font-bold text-center">User Parameters</h1>
                <h1 className="text-md text-center">Click the checkboxes to edit</h1>
                <div className="p-8">
                    <table className="table-auto border-2 border-gray-700">
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Play MC Audio:</td>
                                <td className="border px-4 py-2">
                                    <input 
                                        type="checkbox" 
                                        checked={playMCAudio} 
                                        onChange={(e) => handleToggle("playMCAudio", e.target.checked)} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Play Speaking Audio:</td>
                                <td className="border px-4 py-2">
                                    <input 
                                        type="checkbox" 
                                        checked={playSpeakingAudio} 
                                        onChange={(e) => handleToggle("playSpeakingAudio", e.target.checked)} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Show Menu Audio Buttons:</td>
                                <td className="border px-4 py-2">
                                    <input 
                                        type="checkbox" 
                                        checked={showMenuAudioButtons} 
                                        onChange={(e) => handleToggle("showMenuAudioButtons", e.target.checked)} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Show Text:</td>
                                <td className="border px-4 py-2">
                                    <input 
                                        type="checkbox" 
                                        checked={showText} 
                                        onChange={(e) => handleToggle("showText", e.target.checked)} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Show Tips:</td>
                                <td className="border px-4 py-2">
                                    <input 
                                        type="checkbox" 
                                        checked={showTips} 
                                        onChange={(e) => handleToggle("showTips", e.target.checked)} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Use Voice Recognition:</td>
                                <td className="border px-4 py-2">
                                    <input 
                                        type="checkbox" 
                                        checked={useVoiceRecognition} 
                                        onChange={(e) => handleToggle("useVoiceRecognition", e.target.checked)} 
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="px-4">
                <h1 className="text-4xl font-bold text-center pb-6">Personal Info</h1>
                <div className="p-8">
                    <table className="table-auto border-2 border-gray-700">
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Name:</td>
                                <td className="border px-4 py-2">{name}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Email:</td>
                                <td className="border px-4 py-2">{email}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="px-4">
                <h1 className="text-4xl font-bold text-center pb-6">Token Info</h1>
                <div className="p-8">
                    <table className="table-auto border-2 border-gray-700">
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Total Tokens:</td>
                                <td className="border px-4 py-2">{totalTokens}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Current Tokens:</td>
                                <td className="border px-4 py-2">{currentTokens}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Used Tokens:</td>
                                <td className="border px-4 py-2">{usedTokens}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
