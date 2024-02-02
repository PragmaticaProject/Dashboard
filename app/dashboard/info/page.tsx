"use client";

import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function Page() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [playMCAudio, setPlayMCAudio] = useState();
    const [playSpeakingAudio, setPlaySpeakingAudio] = useState();
    const [showText, setShowText] = useState();
    const [showTips, setShowTips] = useState();
    const [useVoiceRecognition, setUseVoiceRecognition] = useState();
    const [currentTokens, setCurrentTokens] = useState();
    const [totalTokens, setTotalTokens] = useState();
    const [usedTokens, setUsedTokens] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const snapshot = await get(child(ref(database), `pilot/users/${userId}`));
                    
                    if (snapshot.exists()) {
                        console.log("Snapshot exists:", snapshot.exists());
                        setName(snapshot.val()['name']);
                        setEmail(snapshot.val()['email']);
                        const settings = snapshot.val()['settings'];
                        const stats = snapshot.val()['stats'];

                        Object.keys(settings).forEach((settingsKey: string) => {
                            switch(settingsKey) {
                                case "play MC audio":
                                    setPlayMCAudio(settings[settingsKey]);
                                    break;
                                case "play speaking audio":
                                    setPlaySpeakingAudio(settings[settingsKey]);
                                    break;
                                case "show text":
                                    setShowText(settings[settingsKey]);
                                    break;
                                case "show tips":
                                    setShowTips(settings[settingsKey]);
                                    break;
                                case "use voice recognition":
                                    setUseVoiceRecognition(settings[settingsKey]);
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
                        <table className="table-auto">
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2">Name:</td>
                                    <td className="border px-4 py-2">{name}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Email:</td>
                                    <td className="border px-4 py-2">{email}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Phone:</td>
                                    <td className="border px-4 py-2">123-456-7890</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Address:</td>
                                    <td className="border px-4 py-2">123 Main St</td>
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
                        <table className="table-auto">
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2">Play MC Audio:</td>
                                    <td className="border px-4 py-2">{playMCAudio}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Play Speaking Audio:</td>
                                    <td className="border px-4 py-2">{playSpeakingAudio}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Show Text:</td>
                                    <td className="border px-4 py-2">{showText}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Show Tips:</td>
                                    <td className="border px-4 py-2">{showTips}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Use Voice Recognition:</td>
                                    <td className="border px-4 py-2">{useVoiceRecognition}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Total Tokens:</td>
                                    <td className="border px-4 py-2">{totalTokens}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Current Tokens:</td>
                                    <td className="border px-4 py-2">{currentTokens}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Used Tokens:</td>
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