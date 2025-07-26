import { createContext, useContext, useEffect, useState } from "react";
import { ensureNamazRecord } from "../Components/NamazFunc";
import { useAuth } from "./AuthContext";
import {fetchPrayerTimings} from "../Components/NamazFunc"

type NamazContextType = {
  data: any;
  loading: boolean;
  location: {
    city: string;
    country: string;
    lat: number;
    lon: number;
  } | null;
  namazTimings: {
    name: string;
    time: string;
  }[];
};


const NamazContext = createContext<NamazContextType | null>(null);

export const NamazProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<NamazContextType["location"]>(null);
const [namazTimings, setNamazTimings] = useState<NamazContextType["namazTimings"]>([]);

useEffect(() => {
  const getLocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      setLocation({
        city: "Karachi",
        country: "Pakistan",
        lat: 24.8607,
        lon: 67.0011,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const result = await response.json();

          const city =
            result.address?.city || result.address?.town || result.address?.village || "Karachi";
          const country = result.address?.country || "Pakistan";

          setLocation({
            city,
            country,
            lat: latitude,
            lon: longitude,
          });
        } catch (err) {
          console.error("Error during reverse geocoding:", err);
          setFallbackLocation();
        }
      },
      (err) => {
        console.error("Geolocation permission denied:", err);
        setFallbackLocation();
      }
    );
  };

  const setFallbackLocation = () => {
    setLocation({
      city: "Karachi",
      country: "Pakistan",
      lat: 24.8607,
      lon: 67.0011,
    });
  };

  getLocation();
}, []);


  useEffect(() => {
  const fetchTimings = async () => {
    if (location) {
      try {
        const timings = await fetchPrayerTimings(location.city, location.country);

        const selectedTimings = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
      const timingsArray = selectedTimings.map((name) => ({
  name,
  time: timings[name],
}));

setNamazTimings(timingsArray); // ✅ Corrected

      } catch (error) {
        console.error("Failed to fetch prayer timings:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  fetchTimings();
}, [location]);

  useEffect(() => {
    const fetchAndEnsure = async () => {
      if (user?.uid) {
        const result = await ensureNamazRecord(user.uid);
        setData(result);
        setLoading(false);
      }
    };
    fetchAndEnsure();
  }, [user]);

  return (
<NamazContext.Provider value={{ data, loading, location, namazTimings }}>

      {children}
    </NamazContext.Provider>
  );
};

export const useNamaz = () => {
  const context = useContext(NamazContext);
  if (!context) {
    throw new Error("useNamaz must be used within a NamazProvider");
  }
  return context;
};
