"use client";

import { useEffect, useState } from "react";
import { ref, child, get, update } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function Page() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [subscriptionType, setSubscriptionType] = useState<string>("");
    const [subscriptionEndDate, setSubscriptionEndDate] = useState<string>("");
    const [playMCAudio, setPlayMCAudio] = useState<boolean>(false);
    const [playSpeakingAudio, setPlaySpeakingAudio] = useState<boolean>(false);
    const [showMenuAudioButtons, setShowMenuAudioButtons] = useState<boolean>(false);
    const [showText, setShowText] = useState<boolean>(false);
    const [showTips, setShowTips] = useState<boolean>(false);
    const [useVoiceRecognition, setUseVoiceRecognition] = useState<boolean>(false);
    const [currentTokens, setCurrentTokens] = useState<number>(0);
    const [currentStreak, setCurrentStreak] = useState<number>(0);
    const [longestStreak, setLongestStreak] = useState<number>(0);
    const [lastActivityDate, setLastActivityDate] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
		try {
                const user = firebaseAuth.currentUser;

                if (user) {
                    const userId = localStorage.getItem("currentUser");
                    const userSnapshot = await get(child(ref(database), `prod/users/${userId}`));
                    
                    if (userSnapshot.exists()) {
                        console.log("User Snapshot exists:", userSnapshot.exists());
                        setName(userSnapshot.val()['name']);
                        setEmail(userSnapshot.val()['email']);
                        const settings = userSnapshot.val()['settings'];
                        const stats = userSnapshot.val()['stats'];

                        setPlayMCAudio(settings['playMCAudio']);
                        setPlaySpeakingAudio(settings['playSpeakingAudio']);
                        setShowMenuAudioButtons(settings['showMenuAudioButtons']);
                        setShowText(settings['showText']);
                        setShowTips(settings['showTips']);
                        setUseVoiceRecognition(settings['useVoiceRecognition']);

                        setCurrentStreak(stats['currentStreak']);
                        setLongestStreak(stats['longestStreak']);
                        setCurrentTokens(stats["currentTokens"]);

                        setLastActivityDate(stats['lastActivityDateTime'].split(' ')[0]);
                    }

                    const accountSnapshot = await get(child(ref(database), `prod/accounts/${userId}`));

                    if (accountSnapshot.exists()) {

                        console.log("Account Snapshot exists:", accountSnapshot.exists());

                        setEmail(accountSnapshot.val()['email']);
                        setSubscriptionType(accountSnapshot.val()['subscription']);
                        setSubscriptionEndDate((accountSnapshot.val()['subscription_time_end'].split(' ')[0]));
                    }

                } else {
                    console.log("User not found.");
                }
			} catch (error) {
                console.error(error);
			} finally {
				setIsLoading(false);
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
		<div className="min-h-screen">
			<div className="max-w-7xl mx-auto px-6 py-10">
				{/* Header */}
				<div className="mb-8">
					{isLoading ? (
						<div className="animate-pulse">
							<div className="h-8 w-64 bg-slate-200 rounded mb-3"></div>
							<div className="h-4 w-96 bg-slate-200 rounded"></div>
						</div>
					) : (
						<div>
							<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
								{name ? `${name}'s Info` : "Info"}
							</h1>
							<p className="mt-2 text-slate-600">Manage personal details, preferences, and usage.</p>
						</div>
					)}
				</div>

				{/* Content grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Personal Info */}
					<div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white shadow-sm">
						<div className="px-5 pt-5 pb-3">
							<h2 className="text-lg font-semibold text-slate-900">Personal Info</h2>
							<p className="text-sm text-slate-600">User account and subscription</p>
						</div>
						<div className="px-5 pb-5">
							{isLoading ? (
								<div className="space-y-3 animate-pulse">
									<div className="h-4 bg-slate-200 rounded w-3/4"></div>
									<div className="h-4 bg-slate-200 rounded w-5/6"></div>
									<div className="h-4 bg-slate-200 rounded w-2/3"></div>
									<div className="h-4 bg-slate-200 rounded w-1/2"></div>
								</div>
							) : (
								<dl className="divide-y divide-slate-200">
									<div className="py-3 grid grid-cols-3 gap-4">
										<dt className="text-sm font-medium text-slate-600">Name</dt>
										<dd className="col-span-2 text-sm text-slate-900">{name}</dd>
									</div>
									<div className="py-3 grid grid-cols-3 gap-4">
										<dt className="text-sm font-medium text-slate-600">Email</dt>
										<dd className="col-span-2 text-sm text-slate-900 break-all">{email}</dd>
									</div>
									<div className="py-3 grid grid-cols-3 gap-4">
										<dt className="text-sm font-medium text-slate-600">Subscription</dt>
										<dd className="col-span-2 text-sm text-slate-900">{subscriptionType || "—"}</dd>
									</div>
									<div className="py-3 grid grid-cols-3 gap-4">
										<dt className="text-sm font-medium text-slate-600">Ends on</dt>
										<dd className="col-span-2 text-sm text-slate-900">{subscriptionEndDate || "—"}</dd>
									</div>
								</dl>
							)}
						</div>
					</div>

					{/* Settings */}
					<div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white shadow-sm">
						<div className="px-5 pt-5 pb-3">
							<h2 className="text-lg font-semibold text-slate-900">User Settings</h2>
							<p className="text-sm text-slate-600">Toggle preferences</p>
						</div>
						<div className="px-5 pb-5">
							{[
								{ key: "playMCAudio", label: "Play Multiple Choice Audio", value: playMCAudio, setter: (v: boolean) => handleToggle("playMCAudio", v) },
								{ key: "playSpeakingAudio", label: "Play Speaking Audio", value: playSpeakingAudio, setter: (v: boolean) => handleToggle("playSpeakingAudio", v) },
								{ key: "showMenuAudioButtons", label: "Show Menu Audio Buttons", value: showMenuAudioButtons, setter: (v: boolean) => handleToggle("showMenuAudioButtons", v) },
								{ key: "showText", label: "Show Text", value: showText, setter: (v: boolean) => handleToggle("showText", v) },
								{ key: "showTips", label: "Show Tips", value: showTips, setter: (v: boolean) => handleToggle("showTips", v) },
								{ key: "useVoiceRecognition", label: "Use Voice Recognition", value: useVoiceRecognition, setter: (v: boolean) => handleToggle("useVoiceRecognition", v) },
							].map((item) => (
								<div key={item.key} className="flex items-center justify-between py-3">
									<div className="text-sm font-medium text-slate-700">{item.label}</div>
									<label className="relative inline-flex cursor-pointer items-center">
										<input
											type="checkbox"
											className="sr-only peer"
											checked={item.value}
											onChange={(e) => item.setter(e.target.checked)}
										/>
										<div className="w-11 h-6 rounded-full bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 transition-colors peer-checked:bg-indigo-600 relative">
											<span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white border border-slate-300 shadow transition-all peer-checked:translate-x-5" />
										</div>
									</label>
								</div>
							))}
						</div>
					</div>

					{/* Usage Info */}
					<div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white shadow-sm">
						<div className="px-5 pt-5 pb-3">
							<h2 className="text-lg font-semibold text-slate-900">Usage Info</h2>
							<p className="text-sm text-slate-600">Recent activity and progress</p>
						</div>
						<div className="px-5 pb-5">
							{isLoading ? (
								<div className="grid grid-cols-2 gap-4 animate-pulse">
									<div className="h-16 bg-slate-200 rounded" />
									<div className="h-16 bg-slate-200 rounded" />
									<div className="h-16 bg-slate-200 rounded" />
									<div className="h-16 bg-slate-200 rounded" />
								</div>
							) : (
								<div className="grid grid-cols-2 gap-4">
									<div className="rounded-xl border border-slate-200 p-4">
										<div className="text-xs text-slate-500">Current Streak</div>
										<div className="mt-1 text-2xl font-semibold text-slate-900">{currentStreak}</div>
									</div>
									<div className="rounded-xl border border-slate-200 p-4">
										<div className="text-xs text-slate-500">Longest Streak</div>
										<div className="mt-1 text-2xl font-semibold text-slate-900">{longestStreak}</div>
									</div>
									<div className="rounded-xl border border-slate-200 p-4">
										<div className="text-xs text-slate-500">Current Tokens</div>
										<div className="mt-1 text-2xl font-semibold text-slate-900">{currentTokens}</div>
									</div>
									<div className="rounded-xl border border-slate-200 p-4">
										<div className="text-xs text-slate-500">Last Activity Date</div>
										<div className="mt-1 text-base font-medium text-slate-900">{lastActivityDate || "—"}</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
