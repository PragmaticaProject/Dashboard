import React from 'react';

interface ChartData {
  date: string;
  score: number;
  targetsHit: number;
  targetsMissed: number;
}

interface ActivityTableProps {
    chartData: ChartData[];
}

const ActivityTable: React.FC<ActivityTableProps> = ({ chartData }) => {
    return (
      <div>
        <table className="min-w-full bg-white border border-gray-300 shadow rounded">
            <thead>
                <tr className="bg-gray-200">
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Score</th>
                    <th className="py-2 px-4 border-b">Targets Hit</th>
                    <th className="py-2 px-4 border-b">Targets Missed</th>
                </tr>
            </thead>
            <tbody>
                {chartData.map((dataPoint, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                        <td className="py-2 px-4 border-b text-center">{dataPoint.date}</td>
                        <td className="py-2 px-4 border-b text-center">{dataPoint.score}</td>
                        <td className="py-2 px-4 border-b text-center">{dataPoint.targetsHit}</td>
                        <td className="py-2 px-4 border-b text-center">{dataPoint.targetsMissed}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    );
};
  
export default ActivityTable;