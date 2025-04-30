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
  const [selectedDemographics, setSelectedDemographics] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
  }, []);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    filterType: "platform" | "demographic" | "tag"
  ) => {
    const { value, checked } = event.target;

    switch (filterType) {
      case "platform":
        setSelectedPlatforms((prev) =>
          checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
        break;
      case "demographic":
        setSelectedDemographics((prev) =>
          checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
        break;
      case "tag":
        setSelectedTags((prev) =>
          checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
        break;
    }
  };

  const filteredActivities = Object.entries(activities).filter(
    ([, activity]) => {
      const platforms = Array.isArray(activity.Platforms) ? activity.Platforms : [];
      const demographics = Array.isArray(activity.Demographic) ? activity.Demographic : [];
      const tags = Array.isArray(activity.Tags) ? activity.Tags : [];
  
      return (
        (selectedPlatforms.length === 0 || selectedPlatforms.some((val) => platforms.includes(val))) &&
        (selectedDemographics.length === 0 || selectedDemographics.some((val) => demographics.includes(val))) &&
        (selectedTags.length === 0 || selectedTags.some((val) => tags.includes(val)))
      );
    }
  );

  return (
    <div>
      <div className="filter-options hidden">
        <div>
          <h3>Filter by Platform</h3>
          <input
            type="checkbox"
            id="platform-pc"
            name="platform"
            value="PC"
            onChange={(e) => handleFilterChange(e, "platform")}
          />
          <label htmlFor="platform-pc">PC</label>
          <br />
          <input
            type="checkbox"
            id="platform-vr"
            name="platform"
            value="VR"
            onChange={(e) => handleFilterChange(e, "platform")}
          />
          <label htmlFor="platform-vr">VR</label>
          <br />
        </div>
        <div>
          <h3>Filter by Demographics</h3>
          <input
            type="checkbox"
            id="demo-youth"
            name="demographic"
            value="Youth"
            onChange={(e) => handleFilterChange(e, "demographic")}
          />
          <label htmlFor="demo-youth">Youth</label>
          <br />
          <input
            type="checkbox"
            id="demo-adult"
            name="demographic"
            value="Adult"
            onChange={(e) => handleFilterChange(e, "demographic")}
          />
          <label htmlFor="demo-adult">Adult</label>
          <br />
          <input
            type="checkbox"
            id="demo-senior"
            name="demographic"
            value="Senior"
            onChange={(e) => handleFilterChange(e, "demographic")}
          />
          <label htmlFor="demo-senior">Senior</label>
          <br />
        </div>
        <div>
          <h3>Filter by Tags</h3>
          <input
            type="checkbox"
            id="tag-boundaries"
            name="tag"
            value="Boundaries"
            onChange={(e) => handleFilterChange(e, "tag")}
          />
          <label htmlFor="tag-boundaries">Boundaries</label>
          <br />
          <input
            type="checkbox"
            id="tag-communication"
            name="tag"
            value="Communication"
            onChange={(e) => handleFilterChange(e, "tag")}
          />
          <label htmlFor="tag-communication">Communication</label>
          <br />
          <input
            type="checkbox"
            id="tag-criticalthinking"
            name="tag"
            value="Critical Thinking"
            onChange={(e) => handleFilterChange(e, "tag")}
          />
          <label htmlFor="tag-criticalthinking">Critical Thinking</label>
          <br />
          <input
            type="checkbox"
            id="tag-emotionalregulation"
            name="tag"
            value="Emotional Regulation"
            onChange={(e) => handleFilterChange(e, "tag")}
          />
          <label htmlFor="tag-emotionalregulation">Emotional Regulation</label>
          <br />
          <input
            type="checkbox"
            id="tag-executivefunctions"
            name="tag"
            value="Executive Functions"
            onChange={(e) => handleFilterChange(e, "tag")}
          />
          <label htmlFor="tag-executivefunctions">Executive Functions</label>
          <br />
          <input
            type="checkbox"
            id="tag-perspectivetaking"
            name="tag"
            value="Perspective Taking"
            onChange={(e) => handleFilterChange(e, "tag")}
          />
          <label htmlFor="tag-perspectivetaking">Perspective Taking</label>
          <br />
          <input
            type="checkbox"
            id="tag-prosody"
            name="tag"
            value="Prosody"
            onChange={(e) => handleFilterChange(e, "tag")}
          />
          <label htmlFor="tag-prosody">Prosody</label>
          <br />
          <input
            type="checkbox"
            id="tag-safety"
            name="tag"
            value="Safety"
            onChange={(e) => handleFilterChange(e, "tag")}
          />
          <label htmlFor="tag-safety">Safety</label>
          <br />
          <input
            type="checkbox"
            id="tag-selfadvocacy"
            name="tag"
            value="Self Advocacy"
            onChange={(e) => handleFilterChange(e, "tag")}
          />
          <label htmlFor="tag-selfadvocacy">Self Advocacy</label>
          <br />
          <input
            type="checkbox"
            id="tag-socialskills"
            name="tag"
            value="Social Skills"
            onChange={(e) => handleFilterChange(e, "tag")}
          />
          <label htmlFor="tag-socialskills">Social Skills</label>
        </div>
      </div>

      <h1 className="font-bold text-4xl text-center my-8">Activity Viewer</h1>
      <div id="activity-tiles" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {filteredActivities.map(([key, activity]) => (
          <div
            key={key}
            className="tile border p-4 shadow rounded"
            data-platforms={Array.isArray(activity.Platforms) ? activity.Platforms.join(" ") : ""}
            data-demographics={Array.isArray(activity.Demographic) ? activity.Demographic.join(" ") : ""}
            data-tags={Array.isArray(activity.Tags) ? activity.Tags.join(" ") : ""}
          >
            <h2 className="font-bold text-xl mb-2">{activity.Name}</h2>
            <p>{activity.Summary}</p>
            <p><strong>Duration:</strong> {activity.Duration}</p>
            <p><strong>Difficulty:</strong> {activity.Difficulty}</p>
            <div className="mt-2">
              {Array.isArray(activity.Platforms) &&
                activity.Platforms.map((platform) => (
                  <span
                    key={platform}
                    className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 mr-2 rounded"
                  >
                    {platform}
                  </span>
                ))}
            </div>
            <div className="mt-2">
              {Array.isArray(activity.Tags) &&
                activity.Tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 mr-2 rounded"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
