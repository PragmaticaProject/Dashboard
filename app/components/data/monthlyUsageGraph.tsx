import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    name: string;
    date: string;
    score: number;
    targetsHit: number;
    targetsMissed: number;
}

interface MonthlyUsageGraphProps {
    chartData: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip p-2 text-sm bg-white border rounded shadow-md">
          <p>{`Name: ${data.name}`}</p>
          <p>{`Date: ${data.date}`}</p>
          <p>{`Score: ${data.score}`}</p>
          <p>{`Targets Hit: ${data.targetsHit}`}</p>
          <p>{`Targets Missed: ${data.targetsMissed}`}</p>
        </div>
      );
    }
  
    return null;
};

export default function MonthlyUsageGraph({ chartData }: MonthlyUsageGraphProps) {
    return (
        <div>
            {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
            </ResponsiveContainer>
            )}
        </div>
    )
}
