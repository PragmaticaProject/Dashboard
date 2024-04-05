"use client";

import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function Page() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [playMCAudio, setPlayMCAudio] = useState();
    const [playSpeakingAudio, setPlaySpeakingAudio] = useState();
    const [showMenuAudioButtons, setShowMenuAudioButtons] = useState();
    const [showText, setShowText] = useState();
    const [showTips, setShowTips] = useState();
    const [useVoiceRecognition, setUseVoiceRecognition] = useState();
    const [currentTokens, setCurrentTokens] = useState();
    const [totalTokens, setTotalTokens] = useState();
    const [usedTokens, setUsedTokens] = useState<string>();

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

                        Object.keys(settings).forEach((settingsKey: string) => {
                            switch(settingsKey) {
                                case "playMCAudio":
                                    setPlayMCAudio((settings[settingsKey]).toString());
                                    break;
                                case "playSpeakingAudio":
                                    setPlaySpeakingAudio((settings[settingsKey]).toString());
                                    break;
                                    case "showMenuAudioButtons":
                                        setShowMenuAudioButtons((settings[settingsKey]).toString());
                                        break;
                                case "showText":
                                    setShowText((settings[settingsKey]).toString());
                                    break;
                                case "showTips":
                                    setShowTips((settings[settingsKey]).toString());
                                    break;
                                case "useVoiceRecognition":
                                    setUseVoiceRecognition((settings[settingsKey]).toString());
                                    break;
                                default:
                                    console.log("param not found for settings key: " + settingsKey);
                            }
                        });

                        setCurrentTokens(stats["currentTokens"]);
                        setTotalTokens(stats["totalTokens"]);
                        const usedTokens = (parseInt(stats["totalTokens"]) - parseInt(stats["currentTokens"])).toString();
                        setUsedTokens(usedTokens);
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

    return (
        <div className="flex mx-auto justify-center flex-col md:flex-row">
            <div className="px-4">
                <h1 className="text-4xl font-bold text-center">Personal Info</h1>
                {(
                    <div className="p-8">
                        <table className="table-auto border-2 border-gray-700">
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Name:</td>
                                    <td className="border px-4 py-2">{name}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="px-4">
                <h1 className="text-4xl font-bold text-center">App Info</h1>
                {(
                    <div className="p-8">
                        <table className="table-auto border-2 border-gray-700">
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Play MC Audio:</td>
                                    <td className="border px-4 py-2">{playMCAudio}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Play Speaking Audio:</td>
                                    <td className="border px-4 py-2">{playSpeakingAudio}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Show Menu Audio Buttons:</td>
                                    <td className="border px-4 py-2">{showMenuAudioButtons}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Show Text:</td>
                                    <td className="border px-4 py-2">{showText}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Show Tips:</td>
                                    <td className="border px-4 py-2">{showTips}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 bg-blue-500 text-white font-bold">Use Voice Recognition:</td>
                                    <td className="border px-4 py-2">{useVoiceRecognition}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="px-4">
                <h1 className="text-4xl font-bold text-center">Token Info</h1>
                {(
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
                )}
            </div>
        </div>
    );
}