import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";

const getMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const getDateKey = () => {
  const now = new Date();
  return String(now.getDate()).padStart(2, "0");
};

export async function ensureNamazRecord(userId: string) {
  const month = getMonthKey();
  const day = getDateKey();

  const docRef = doc(db, "users", userId, "namazRecords", month);
  const docSnap = await getDoc(docRef);

  const todayData = {
    fajr: false,
    zuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    createdAt: new Date(),
  };

  if (!docSnap.exists()) {
    await setDoc(docRef, {
      days: {
        [day]: todayData,
      },
    });
    return { days: { [day]: todayData } };
  }

  const existing = docSnap.data();

  if (!existing.days || !existing.days[day]) {
    await updateDoc(docRef, {
      [`days.${day}`]: todayData,
    });
    return {
      ...existing,
      days: {
        ...existing.days,
        [day]: todayData,
      },
    };
  }

  // ✅ If record already exists, just return it
  return existing;
}
