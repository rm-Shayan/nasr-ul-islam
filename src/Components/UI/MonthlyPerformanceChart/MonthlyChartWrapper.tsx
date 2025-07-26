import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase/Firebase";
import { useAuth } from "../../../Context api";
import PrayerLedgerChart from "./MonthlyPerformance";

export interface PrayerRecord {
  fajr?: boolean;
  zuhr?: boolean;
  asr?: boolean;
  maghrib?: boolean;
  isha?: boolean;
  [key: string]: boolean | undefined;
}

const MonthlyChartWrapper = () => {
  const [monthlyData, setMonthlyData] = useState<{
    [month: string]: {
      summary?: PrayerRecord;
      days: { [day: string]: PrayerRecord };
    };
  }>({});

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "users", user.uid, "namazRecords")
        );

        const result: {
          [month: string]: {
            summary?: PrayerRecord;
            days: { [day: string]: PrayerRecord };
          };
        } = {};

        snapshot.forEach((doc) => {
          const dateKey = doc.id; // could be "2025-07-25" or "2025-07"
          const parts = dateKey.split("-");

          if (parts.length === 3) {
            const [year, month, day] = parts;
            const monthKey = `${year}-${month}`;

            if (!result[monthKey]) {
              result[monthKey] = { days: {} };
            }

            result[monthKey].days[day] = doc.data() as PrayerRecord;
          } else if (parts.length === 2) {
            const [year, month] = parts;
            const monthKey = `${year}-${month}`;

            if (!result[monthKey]) {
              result[monthKey] = { days: {} };
            }

            result[monthKey].summary = doc.data() as PrayerRecord;
          }
        });

        console.log("🔥 Final monthlyData before set:", result);
        setMonthlyData(result);
      } catch (error) {
        console.error("❌ Error fetching Namaz data:", error);
      }
    };

    fetchData();
  }, [user]);

  console.log("📦 State monthlyData:", monthlyData);

  return (
    <div className="w-full h-[400px]">
      <h2 className="text-xl font-bold text-green-600 mb-4">
        📊 Monthly Namaz Chart
      </h2>

      <PrayerLedgerChart monthlyData={monthlyData} />
    </div>
  );
};

export default MonthlyChartWrapper;
