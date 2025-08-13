"use client";

import React, { useState, useEffect } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseApp, firebaseAuth, database } from "@/app/firebase";
type Activity = {
  Name: string;
  Demographic: string[];
  Difficulty: number;
  Duration: string;
  Platforms: string[];
  Summary: string;
  Tags: string[];
};

export default function Page() {
  const app = firebaseApp;
  const auth = firebaseAuth;
  const dbRef = ref(database);
  const [activities, setActivities] = useState<Record<string, Activity>>({});
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const activityCollectionSnapshot = await get(child(dbRef, `prod/activities/collection`));

          if (activityCollectionSnapshot.exists()) {
            const activitiesData = activityCollectionSnapshot.val();
            setActivities(activitiesData);
            console.log("Activities collection snapshot found.");
          } else {
            console.log("No assigned activities available");
          }
        } else {
          console.log("user not found.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [auth, dbRef]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleDifficulty = (difficulty: number) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const filteredActivities = Object.entries(activities)
    .filter(([, activity]) => {
      const platforms = Array.isArray(activity.Platforms) ? activity.Platforms : [];
      const matchesPlatform =
        selectedPlatforms.length === 0 ||
        selectedPlatforms.some((val) =>
          platforms.map((p) => p.toLowerCase()).includes(val.toLowerCase())
        );

      const matchesDifficulty =
        selectedDifficulties.length === 0 ||
        selectedDifficulties.includes(Number(activity.Difficulty));

      const matchesSearch =
        searchQuery.trim().length === 0 ||
        activity.Name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        activity.Summary.toLowerCase().includes(searchQuery.trim().toLowerCase());

      return matchesPlatform && matchesDifficulty && matchesSearch;
    })
    .sort((a, b) => a[1].Name.localeCompare(b[1].Name));

  const allDifficulties = Array.from(
    new Set(
      Object.values(activities)
        .map((a) => Number(a.Difficulty))
        .filter((n) => !Number.isNaN(n))
    )
  ).sort((a, b) => a - b);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <h1 className="font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-900">Activity Viewer</h1>
          <p className="text-slate-500">Search and filter activities by platform and difficulty.</p>
        </div>

        <div className="sticky top-0 z-10 mb-6 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.277 11.938l3.268 3.267a.75.75 0 1 0 1.06-1.06l-3.267-3.268A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd"/></svg>
              </span>
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-500 mr-1">Platforms:</span>
              {(["PC", "VR", "Tablet"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={
                    (selectedPlatforms.includes(p)
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200") +
                    " inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition"
                  }
                >
                  <span className="h-2 w-2 rounded-full "
                    style={{ backgroundColor: p === "PC" ? "#0284c7" : p === "VR" ? "#16a34a" : "#9333ea" }}
                  />
                  {p}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-500 mr-1">Difficulty:</span>
              {allDifficulties.length === 0 ? (
                <span className="text-sm text-slate-400">No data</span>
              ) : (
                allDifficulties.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleDifficulty(d)}
                    className={
                      (selectedDifficulties.includes(d)
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200") +
                      " rounded-full border px-3 py-1.5 text-sm transition"
                    }
                  >
                    {d}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div id="activity-tiles" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map(([key, activity]) => (
            <div
              key={key}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-lg text-slate-900">{activity.Name}</h2>
                <span className="ml-3 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">Difficulty {activity.Difficulty}</span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{activity.Summary}</p>
              <div className="mt-3 text-sm text-slate-500"><span className="font-medium text-slate-700">Duration:</span> {activity.Duration}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.isArray(activity.Platforms) &&
                  activity.Platforms.map((platform) => (
                    <span
                      key={platform}
                      className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-200"
                    >
                      {platform}
                    </span>
                  ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.isArray(activity.Tags) &&
                  activity.Tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          ))}
          {filteredActivities.length === 0 && (
            <div className="col-span-full flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-slate-500">
              No activities match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
