import { useState, useEffect } from "react";
import { useAuth } from "../Context api";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

interface NamazDay {
  fajr: boolean;
  zuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

interface DisplayRecord {
  date: string;
  record: NamazDay;
}

const PrayerHistory = () => {
  const { user } = useAuth();
  const [range, setRange] = useState("today");
  const [records, setRecords] = useState<DisplayRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const getDateRange = (): string[] => {
    const dates: string[] = [];
    const today = new Date();

    let count = 1;
    if (range === "yesterday") {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      dates.push(y.toISOString().split("T")[0]);
      return dates;
    }

    if (range === "7days") count = 7;
    else if (range === "30days") count = 30;

    for (let i = 0; i < count; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }

    return dates;
  };

  const fetchData = async () => {
    if (!user?.uid) return;
    setLoading(true);
    const dateRange = getDateRange();

    const months = Array.from(new Set(dateRange.map((d) => d.slice(0, 7))));

    const fetched: DisplayRecord[] = [];

    for (const month of months) {
      const docRef = doc(db, "users", user.uid, "namazRecords", month);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const days = data.days || {};

        dateRange.forEach((date) => {
          const dayOnly = date.split("-")[2];
          if (days[dayOnly]) {
            fetched.push({
              date,
              record: days[dayOnly],
            });
          }
        });
      }
    }

    fetched.sort((a, b) => (a.date < b.date ? 1 : -1));
    setRecords(fetched);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [range, user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Prayer History</h2>

      <select
        value={range}
        onChange={(e) => setRange(e.target.value)}
        className="border rounded px-4 py-2 mb-6"
      >
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : records.length === 0 ? (
        <p className="text-gray-500">No records available for this range.</p>
      ) : (
        <div className="grid gap-4">
          {records.map(({ date, record }) => (
            <div key={date} className="border rounded p-4 shadow">
              <h3 className="font-bold text-lg mb-2">📅 {date}</h3>
              <ul className="pl-2">
                {["fajr", "zuhr", "asr", "maghrib", "isha"].map((prayer) => (
                  <li key={prayer} className="flex items-center gap-2 mb-1">
                    <span className="capitalize w-20">{prayer}:</span>
                    <span
                      className={`text-xl ${
                        record[prayer as keyof NamazDay]
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {record[prayer as keyof NamazDay] ? "✅" : "❌"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrayerHistory;
