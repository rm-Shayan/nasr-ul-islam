// ✅ types.ts
export interface PrayerRecord {
  fajr?: boolean;
  zuhr?: boolean;
  asr?: boolean;
  maghrib?: boolean;
  isha?: boolean;
  [key: string]: boolean | undefined;
}

export interface MonthlyData {
  [month: string]: {
    days: {
      [day: string]: PrayerRecord;
    };
  };
}
