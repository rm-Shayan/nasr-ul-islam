import  { useState, useEffect, useDeferredValue } from 'react';
import { NavLink } from 'react-router-dom';
import {fetchPrayerTimings} from "../Components/NamazFunc" 
import { useNamaz } from '../Context api';

// Define the props type for NamazAukkat


// NamazAukkat component now accepts city and country as props again
 const NamazAukkat = () => {

 const { location } = useNamaz(); // Get context
  const defaultCity = location?.city || "Karachi";
  const defaultCountry = location?.country || "Pakistan";

  // State variables
  const [city, setCity] = useState(defaultCity);
  const [country, setCountry] = useState(defaultCountry);
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Deferred values to avoid fast re-renders
  const deferredCity = useDeferredValue(city);
  const deferredCountry = useDeferredValue(country);
  // Function to format the current date as YYYY-MM-DD
 const handleFetch = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await fetchPrayerTimings(deferredCity, deferredCountry);
    setTimings(data);
  } catch (err: any) {
    setError(err.message);
    setTimings(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
     if (deferredCity && deferredCountry) {
    handleFetch();
  } else {
      setTimings(null);
      setError("Please enter both city and country.");
    }
  }, [deferredCity,deferredCountry]);

  // useEffect hook to fetch timings on initial component mount
  // and whenever city or country changes
// Dependencies: re-run when city or country changes

 return (
  <div className="p-6 font-sans max-w-6xl mx-auto">
    <h1 className="text-4xl font-extrabold text-center text-green-800 mb-10 tracking-tight">
      Namaz Aukaat
    </h1>

    {/* Inline Inputs with Better Spacing */}
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 w-full sm:w-1/3"
        placeholder="City"
      />
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 w-full sm:w-1/3"
        placeholder="Country"
      />
      <button
        onClick={()=>{handleFetch()}}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
      >
        {loading ? 'Fetching...' : 'Get Timings'}
      </button>
    </div>

    {/* Error Display */}
    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
        <strong>Error: </strong>{error}
      </div>
    )}

    {/* Prayer Timings Cards */}
    {timings && !loading && !error && (
      <>
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Prayer Timings for {city}, {country}
        </h2>
        <div className="flex flex-wrap justify-center gap-6 px-4">
          {Object.entries(timings).map(([name, time]) => (
            <div
              key={name}
              className="bg-white shadow-md rounded-xl p-5 w-36 text-center hover:scale-105 transform transition"
            >
              <div className="text-green-800 font-semibold text-lg mb-2 capitalize">{name}</div>
              <div className="text-2xl text-green-600 font-bold">{time.split(' ')[0]}</div>
            </div>
          ))}
        </div>
      </>
    )}

    {/* Info Section with Navigation Cards */}
    <div className="mt-12 p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto space-y-8">
      {/* Tracker */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Track Your Daily Prayers</h3>
        <p className="text-gray-600 mb-3 leading-relaxed">
          Stay spiritually accountable by tracking your daily prayers in real-time. Monitor your progress and develop consistency in your routine.
        </p>
        <NavLink
          to="/prayer"
          className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Go to Tracker
        </NavLink>
      </div>

      {/* Ledger */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Prayer Ledger</h3>
        <p className="text-gray-600 mb-3 leading-relaxed">
          View a detailed ledger of all your logged prayers. This section helps you reflect on your journey and spiritual discipline.
        </p>
        <NavLink
          to="/prayer/PrayerLedger"
          className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          View Ledger
        </NavLink>
      </div>

      {/* History */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Prayer History</h3>
        <p className="text-gray-600 mb-3 leading-relaxed">
          Dive into your historical prayer data to assess consistency over time. Ideal for identifying trends and areas of improvement.
        </p>
        <NavLink
          to="/prayer/PrayerHistory"
          className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          View History
        </NavLink>
      </div>
    </div>
  </div>
);


};

export default NamazAukkat