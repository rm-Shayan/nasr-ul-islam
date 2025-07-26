
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";


type PrayerName = "fajr" | "zuhr" | "asr" | "maghrib" | "isha";

export const savePrayerStatus = async (
  uid: string,
  updated: Record<PrayerName, boolean>
) => {
  try {
    const now = new Date();
    
 const month = String(now.getMonth() + 1).padStart(2, "0"); // "07"
const year = now.getFullYear();                            // 2025
const monthYear = `${year}-${month}`; 

    const day = String(now.getDate());

    const dayRef = doc(db, "users", uid, "namazRecords", monthYear);

    console.log("Saving for:", uid);
    console.log("Date:", day);
    console.log("Updated prayers:", updated);

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
