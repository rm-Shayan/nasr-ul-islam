
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";


type PrayerName = "fajr" | "zuhr" | "asr" | "maghrib" | "isha";

export const saveLedger = async (
  uid: string,
  date: Date,
  updated: Record<PrayerName, boolean>
) => {
  try {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const monthYear = `${year}-${month}`; // e.g. 2025-07

    const dayRef = doc(db, "users", uid, "namazRecords", monthYear);

    console.log("Saving for UID:", uid);
    console.log("Month-Year:", monthYear);
    console.log("Day:", day);
    console.log("Prayers:", updated);

    await setDoc(
      dayRef,
      {
        days: {
          [day]: {
            ...updated,
            createdAt: serverTimestamp(),
          },
        },
      },
      { merge: true }
    );

    console.log("Prayer status saved successfully.");
  } catch (err) {
    console.error("Error saving prayer status:", err);
  }
};

