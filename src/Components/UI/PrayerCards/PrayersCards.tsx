import React from "react";

interface PrayerCardProps {
  prayer: string;
  offered: boolean;
  onToggle: () => void;
  imageSrc: string;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ prayer, offered, onToggle, imageSrc }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white h-full flex flex-col">
      <img src={imageSrc} alt={prayer} className="w-full h-32 object-cover" onError={(e) => {
        // Fallback for broken images
        e.currentTarget.src = "https://placehold.co/400x300/cccccc/000000?text=No+Image";
      }} />
      <div className="p-4 text-center space-y-2">
        <h2 className="text-lg font-semibold capitalize text-green-800">
          {prayer}
        </h2>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={offered}
            onChange={onToggle}
            className="form-checkbox text-green-600 h-5 w-5"
          />
          <span className="ml-2 text-sm text-gray-700">
            Offered
          </span>
        </label>
      </div>
    </div>
  );
};

export default PrayerCard;
