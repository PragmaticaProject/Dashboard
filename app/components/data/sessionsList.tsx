"use client";

import Link from "next/link";

export default function SessionsList({ sessions }: { sessions: { [key: string]: string } | null }) {
  const data = sessions || undefined;

  const formatDateTime = (dateTimeString: string): string => {
    const [month, day, year, hour, minute] = dateTimeString.split(/[:\-]/);
    const formattedDate = `${getMonthName(parseInt(month))} ${parseInt(day)}, ${year}`;
    let formattedHour = parseInt(hour);
    const amPm = formattedHour >= 12 ? 'PM' : 'AM';
    formattedHour = formattedHour % 12 || 12;
    const formattedTime = `${formattedHour}:${minute} ${amPm}`;
    return `${formattedDate} - ${formattedTime}`;
  };

  const getMonthName = (month: number): string => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months[month - 1];
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-bold mb-4">All Sessions</h1>
      {data && (
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-500">
            <tr>
              <th className="py-2 pl-4 text-center text-white">Session</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).sort((a, b) => {
                const [monthA, dayA, yearA] = a[0].substring(0, 10).split(':');
                const [monthB, dayB, yearB] = b[0].substring(0, 10).split(':');
                const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
                const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
                return dateB.getTime() - dateA.getTime();
            }).map(([key, value]) => (
              <tr key={key} className="border-b">
                 <td className="py-2 px-4 text-center hover:bg-gray-100">
                  <Link href={{ pathname: `/dashboard/sessions/${encodeURIComponent(value)}`, 
                    query: { sessionId: key } }}>
                    <div>{value}</div>
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