import { Link } from "react-router-dom";
import { PrayerCard } from "../Components";
import imagePayer1 from "../assets/ai-generated-back-view-of-a-muslim-man-praying-in-mosque-ramadan-mubarak-islamic-concept-photo.jpg";
import imagePrayer2 from "../assets/landscape-illustration-of-muslim-praying-with-mosque-silhouette-vector.jpg";
import imagePrayer3 from "../assets/pexels-photo-5996991.jpeg";
import imagePrayer4 from "../assets/saying-tashahud-and-salah-an-nabi-prophet.jpg";
import imagePrayer5 from "../assets/silhouette-of-muslim-man-praying-vector.jpg";
import { useNamaz, useAuth } from "../Context api";
import { useState, useEffect } from "react";
import { savePrayerStatus } from "../Components/NamazFunc";
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

const PrayerCards = () => {
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
      await savePrayerStatus(uid, localData);
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
  
 <div className="px-4 sm:px-6 lg:px-10 py-6">
    <div className="max-w-7xl mx-auto space-y-8">

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

      {/* Action Buttons */}
      <div className="flex flex-col-reverse md:flex-row md:justify-between items-center gap-4 mt-6">
        {/* Navigation Links */}
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

        {/* Submit Button */}
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

export default PrayerCards;