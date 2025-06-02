import * as SQLite from "expo-sqlite";
import { Entry } from "./types";
import { Alert } from "react-native";
import i18n from "@/utils/i18n";

let db: SQLite.SQLiteDatabase | null = null;

export const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("anokoro-diary.db");
  }
  return db;
};

export const initDB = async () => {
  const db = await getDB();
  await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        content TEXT NOT NULL
      );
    `);
  // console.log("Database initialized successfully");
};

export const insertEntry = async (content: string) => {
  if (!db) {
    console.error("Database not initialized");
    return;
  }

  try {
    if (!content.trim()) {
      console.log("content_cannot_be_empty");
      return;
    }

    // const tomorrow = new Date();
    // tomorrow.setDate(tomorrow.getDate() + 1);
    // const isoTomorrow = tomorrow.toISOString();

    // const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // const isoYesterday = yesterday.toISOString();

    // const testDate = new Date(2025, 3, 1); // 月は0始まり（5=6月）
    // const isoTestDate = testDate.toISOString();

    const date = new Date().toISOString();
    await db.runAsync(`INSERT INTO entries (created_at, content) VALUES (?, ?)`, date, content);
    console.log("Entry inserted successfully");
  } catch (error) {
    console.error("Error in insertEntry:", error);
  }
};

export const fetchEntries = async () => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  const result = await db.getAllAsync<Entry>(`SELECT * FROM entries ORDER BY created_at DESC`);
  // console.log("Entries fetched successfully", result);
  return result;
};

export const getRandomDateContents = (entries: Entry[]) => {
  const groupedByDate: { [date: string]: Entry[] } = entries.reduce((acc, entry) => {
    const dateOnly = entry.created_at.slice(0, 10);
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

export const deleteEntry = async (id: number) => {
  if (!db) {
    throw new Error("Database not initialized");
  }

  const confirmed = await new Promise((resolve) => {
    Alert.alert(i18n.t("confirm_deletion"), i18n.t("delete_entry_message"), [
      {
        text: i18n.t("cancel"),
        style: "cancel",
        onPress: () => resolve(false),
      },
      {
        text: i18n.t("delete"),
        style: "destructive",
        onPress: () => resolve(true),
      },
    ]);
  });
  if (!confirmed) return;
  await db.runAsync("DELETE FROM entries WHERE id = ?", [id]);
};

export const updateEntry = async (id: number, content: string) => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  await db.runAsync(`UPDATE entries SET content = ? WHERE id = ?`, [content, id]);
};
