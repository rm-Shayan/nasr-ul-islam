import { CurrentTime } from "../Components";
import { NamazPerformanceCard } from "../Components";
import { MonthlyChartWrapper } from "../Components";

const Home = () => {
  return (
    <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
      {/* 🕒 Current Time Section */}
      <CurrentTime />

      {/* 🌿 Namaz Ayah */}
      <div className="bg-green-600 text-white text-center p-6 rounded-xl shadow-lg">
        <p className="text-lg md:text-xl font-semibold tracking-wide">
          ﴿إِنَّ ٱلصَّلَوٰةَ تَنْهَىٰ عَنِ ٱلْفَحْشَآءِ وَٱلْمُنكَرِ﴾
        </p>
        <p className="mt-2 text-sm md:text-base italic">
          “Indeed, prayer prohibits immorality and wrongdoing.” (Surah Al-Ankabut 29:45)
        </p>
      </div>

      {/* 📊 Performance Cards and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NamazPerformanceCard />
        <MonthlyChartWrapper />
      </div>
    </div>
  );
};

export default Home;