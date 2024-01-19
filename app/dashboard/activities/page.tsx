import Link from "next/link";
import { useEffect } from "react";
import { ref, child, get } from "firebase/database";
import { firebaseApp, firebaseAuth, database } from "@/app/firebase";

export default function Page() {
    const app = firebaseApp;
    const auth = firebaseAuth;
    const dbRef = ref(database);
    var data = null;
  
    useEffect(() => {
      const fetchData = async () => {
  
          try {
              const user = auth.currentUser;
              if (user) {
                //const snapshot = await get(child(dbRef, `pilot/users/${user.uid}`));
                const snapshot = await get(child(dbRef, `pilot/users/7TgDiZLWHdSBi9qhtqeImsj35c73`));
                  
                  if (snapshot.exists()) {
                      console.log("snapshot found.");
                      data = snapshot.val().activities;
                  } else {
                      console.log("No data available");
                  }
              }
              else {
                  console.log("user not found.");
              }
          } catch (error) {
          console.error(error);
          }
      };
  
      fetchData();
    }, []);
  
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold mb-4">Assigned Activities</h1>
        {data && (
          <table className="w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 pl-4 text-center">Activity</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([key, value]) => (
                <tr key={key} className="border-b">
                   <td className="py-2 px-4 text-center hover:bg-gray-100">
                    <Link href={{ pathname: `/dashboard/activities/${encodeURIComponent(key)}`, 
                      query: { activityName: key } }}>
                      <div>{key}</div>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
}