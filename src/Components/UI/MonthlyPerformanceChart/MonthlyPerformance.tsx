
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PrayerLedgerChart = ({ monthlyData }: { monthlyData: any }) => {
  const monthKey = Object.keys(monthlyData)[0];
  const summaryDays = monthlyData[monthKey]?.summary?.days ?? {};

  // 🔄 Transform data for chart
  const chartData = Object.entries(summaryDays).map(([day, prayers]: any) => {
    const prayerCounts = Object.entries(prayers).reduce(
      (acc, [key, value]) => {
        if (key !== "createdAt") {
          acc[key] = value === true ? 1 : 0;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      day: `Day ${day}`,
      ...prayerCounts,
    };
  });

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Prayer Summary Chart - {monthKey}</h3>

      {chartData.length === 0 ? (
        <p className="text-gray-500">No data available for this month.</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="fajr" stackId="a" fill="#34D399" />
            <Bar dataKey="zuhr" stackId="a" fill="#60A5FA" />
            <Bar dataKey="asr" stackId="a" fill="#FBBF24" />
            <Bar dataKey="maghrib" stackId="a" fill="#F87171" />
            <Bar dataKey="isha" stackId="a" fill="#A78BFA" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PrayerLedgerChart;
