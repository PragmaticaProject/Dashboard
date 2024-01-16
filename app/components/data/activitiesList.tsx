"use client";

import { useState, useEffect } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseAuth, database } from "@/app/firebase";

export default function ActivitiesList() {
  const auth = firebaseAuth;
  const dbRef = ref(database);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const snapshot = await get(child(dbRef, `internal/users/${user.uid}`));

          if (snapshot.exists()) {
            console.log("snapshot found.");
            setData(snapshot.val());
          } else {
            console.log("No data available");
          }
        } else {
          console.log("user not found.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [auth.currentUser, dbRef]);

  return (
    <div>
      <h1>Activities List</h1>
      {data && data.sessions && (
        <div>
          {Object.entries(data.sessions).map(([sessionId, sessionData]) => (
            <div key={sessionId}>
              <h2>{sessionData.startDT}</h2>
              {/* Display other session data as needed */}
              <pre>{JSON.stringify(sessionData, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
