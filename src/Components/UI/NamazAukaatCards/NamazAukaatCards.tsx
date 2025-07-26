import { useNamaz } from "../../../Context api";
import { useEffect, useState } from "react";

export const NamzazAukaatCards = () => {
  const { namazTimings, loading } = useNamaz();
  const [activeNamaz, setActiveNamaz] = useState<string | null>(null);

  useEffect(() => {
    if (!namazTimings.length) return;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let closest = null;
    let minDiff = Infinity;

    namazTimings.forEach(({ name, time }) => {
      const [hourStr, minuteStr] = time.replace("AM", "").replace("PM", "").trim().split(":");
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);

      if (time.toLowerCase().includes("pm") && hour !== 12) hour += 12;
      if (time.toLowerCase().includes("am") && hour === 12) hour = 0;

      const namazMinutes = hour * 60 + minute;
      const diff = Math.abs(currentMinutes - namazMinutes);

      if (diff < minDiff) {
        minDiff = diff;
        closest = name;
      }
    });

    setActiveNamaz(closest ?? null);
  }, [namazTimings]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading Namaz timings...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
  {namazTimings.map(({ name, time }) => {
    const isActive = activeNamaz === name;

    return (
      <div
        key={name}
        className={`rounded-2xl p-4 flex flex-col items-center justify-center transition duration-200
          ${isActive
            ? "bg-green-100 text-green-700 scale-105 shadow-lg"
            : "bg-white text-green-700 shadow-md"
          }`}
      >
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-xl font-bold mt-1">{time}</p>
      </div>
    );
  })}
</div>

  );
};
