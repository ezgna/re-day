import { Entry } from "@/src/database/types";

export const getRandomDateContents = (entries: Entry[]) => {
  const groupedByDate: { [date: string]: Entry[] } = entries.reduce((acc, entry) => {
    const dateOnly = formatToLocalDateString(entry.created_at);
    if (!acc[dateOnly]) acc[dateOnly] = [];
    acc[dateOnly].push(entry);
    return acc;
  }, {} as { [date: string]: Entry[] });

  const dates = Object.keys(groupedByDate);

  if (dates.length > 0) {
    const randomDate = dates[Math.floor(Math.random() * dates.length)];
    const contents = groupedByDate[randomDate].map((entry) => entry.content);
    return { randomDate, contents };
  } else {
    return null;
  }
};

export const formatToLocalDateString = (isoString: string) => {
  const date = new Date(isoString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const formatToLocalDateTimeString = (isoString: string): string => {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

export const formatDashedDateToSlashed = (dateString: string): string => {
  return dateString.replace(/-/g, "/");
};

// ローカルタイムゾーンの 0 時で日付キーを生成
export const formatDateKey = (date: Date): string => formatToLocalDateString(date.toISOString());

// 日付をローカル 0 時に正規化した Date を返す
export const startOfLocalDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const todayLocal = (): Date => startOfLocalDay(new Date());

export const addDaysLocal = (date: Date, days: number): Date => {
  const d = startOfLocalDay(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const tomorrowLocal = (): Date => addDaysLocal(new Date(), 1);

// 言語によって12/24時間表示を切り替える時刻フォーマッタ
export const formatTimeByLocale = (date: Date, locale: string): string => {
  const isJa = locale.startsWith("ja");
  return date.toLocaleTimeString(isJa ? "ja-JP" : "en-US", {
    hour: isJa ? "2-digit" : "numeric",
    minute: "2-digit",
    hour12: !isJa,
  });
};
