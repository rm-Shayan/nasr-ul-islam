import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { Link } from "react-router-dom";
import { PrayerCard } from "../Components";
import imagePayer1 from "../assets/ai-generated-back-view-of-a-muslim-man-praying-in-mosque-ramadan-mubarak-islamic-concept-photo.jpg";
import imagePrayer2 from "../assets/landscape-illustration-of-muslim-praying-with-mosque-silhouette-vector.jpg";
import imagePrayer3 from "../assets/pexels-photo-5996991.jpeg";
import imagePrayer4 from "../assets/saying-tashahud-and-salah-an-nabi-prophet.jpg";
import imagePrayer5 from "../assets/silhouette-of-muslim-man-praying-vector.jpg";
import {NamzazAukaatCards} from "../Components"

import { useNamaz, useAuth } from "../Context api";
import { saveLedger } from "../Components/NamazFunc";
import { showSuccess } from "../Components";

const prayerImages = [
  imagePayer1,
  imagePrayer2,
  imagePrayer3,
  imagePrayer4,
  imagePrayer5,
];

const prayerTimes = ["fajr", "zuhr", "asr", "maghrib", "isha"] as const;
type PrayerName = typeof prayerTimes[number];

const PrayerLedger = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data, loading } = useNamaz();
  const { user } = useAuth();
  const uid = user?.uid;

  const [localData, setLocalData] = useState<Record<PrayerName, boolean>>({
    fajr: false,
    zuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  });

  
  useEffect(() => {
    console.log(user)
    if (data && data.days) {
      const todayDate = String(new Date().getDate()).padStart(2, "0");
      const todayData = data.days[todayDate];
      if (todayData) {
        setLocalData({
          fajr: todayData.fajr ?? false,
          zuhr: todayData.zuhr ?? false,
          asr: todayData.asr ?? false,
          maghrib: todayData.maghrib ?? false,
          isha: todayData.isha ?? false,
        });
      }
    }
  }, [data]);

  const togglePrayer = (prayer: PrayerName) => {
    setLocalData((prev) => ({
      ...prev,
      [prayer]: !prev[prayer],
    }));
  };

 const handleSendNamazRecords = async () => {
  if (!uid) return alert("User not logged in");

  try {
    await saveLedger(uid, selectedDate, localData); // ✅ pass date
    await showSuccess({
      title: "نماز کا اندراج مکمل",
      text: "جزاک اللہ! آپ کی نماز کا ریکارڈ کامیابی سے محفوظ ہو گیا ہے۔",
    });
  } catch (error) {
    console.error("Error sending namaz records:", error);
    alert("Failed to send namaz records.");
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-green-600 text-xl font-semibold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-0 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center  text-green-800">
          نماز لیجر
        </h1>

 {/* Calendar */}



<div className="max-w-screen-xl mx-auto p-4">
  <div className="flex flex-wrap md:flex-nowrap gap-4">
    
    {/* Namaz Cards - 2/3 on md+, full on small */}
    <div className="w-full md:w-2/3">
      <NamzazAukaatCards />
    </div>

    {/* Calendar Wrapper */}
    <div className="w-full md:w-1/3 flex md:block justify-center">
      <div className="bg-white rounded-2xl sticky top-2 shadow-xl p-3 border border-green-300 w-full max-w-sm">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          calendarType="gregory"
          className="!bg-white !rounded-xl !text-green-800 border border-green-200 shadow-md p-1 text-[11px] w-full"
          tileClassName={({ date }) => {
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            return [
              "h-6 w-6 flex items-center justify-center text-[12px] rounded-sm transition duration-150",
              isSelected
                ? "bg-green-600 text-white font-bold"
                : isToday
                ? "bg-green-100 text-green-800 font-semibold"
                : "hover:bg-green-50 hover:text-green-700"
            ].join(" ");
          }}
          navigationLabel={({ label }) => (
            <span className="text-green-800 font-bold text-[10px]">{label}</span>
          )}
          formatShortWeekday={(locale, date) =>
            date.toLocaleDateString(locale, { weekday: "short" }).slice(0, 2)
          }
        />
      </div>
    </div>

  </div>
</div>


        {/* Prayer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {prayerTimes.map((prayer, idx) => (
            <PrayerCard
              key={prayer}
              prayer={prayer}
              offered={localData[prayer]}
              onToggle={() => togglePrayer(prayer)}
              imageSrc={prayerImages[idx]}
            />
          ))}
        </div>

       

        {/* Actions */}
        <div className="flex flex-col-reverse md:flex-row md:justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <Link
              to="PrayerLedger"
              className="text-green-700 border border-green-300 bg-white hover:bg-green-100 px-4 py-2 rounded-md font-medium transition"
            >
              Prayer Ledger
            </Link>
            <Link
              to="PrayerHistory"
              className="text-green-700 border border-green-300 bg-white hover:bg-green-100 px-4 py-2 rounded-md font-medium transition"
            >
              Prayer History
            </Link>
          </div>

          <button
            onClick={handleSendNamazRecords}
            className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-2 px-8 border-green-300 border-2 rounded-md shadow-md transition duration-200"
          >
            نماز محفوظ کریں
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrayerLedger;
