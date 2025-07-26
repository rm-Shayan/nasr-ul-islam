// src/utils/fetchPrayerTimings.ts

export const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const fetchPrayerTimings = async (
  city: string,
  country: string
): Promise<Record<string, string>> => {
  const currentDate = getCurrentDate();
  const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${currentDate}?city=${city}&country=${country}&method=1`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.data && data.data.timings) {
    return data.data.timings;
  } else {
    throw new Error("Prayer timings not found in response.");
  }
};
