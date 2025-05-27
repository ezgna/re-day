import * as SQLite from "expo-sqlite";
import { Entry } from "./types";

let db: SQLite.SQLiteDatabase | null = null;

export const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("anokoro-diary.db");
  }
  return db;
};

export const initDB = async () => {
  try {
    const db = await getDB();
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        content TEXT NOT NULL
      );
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
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
    const date = new Date().toISOString();
    await db.runAsync(`INSERT INTO entries (created_at, content) VALUES (?, ?)`, date, content);
    console.log("Entry inserted successfully");
  } catch (error) {
    console.error("Error in insertEntry:", error);
  }
};

export const fetchEntries = async () => {
  if (!db) {
    console.error("Database not initialized");
    return [];
  }

  try {
    const result = await db.getAllAsync<Entry>(`SELECT * FROM entries ORDER BY created_at DESC`);
    console.log("Entries fetched successfully", result);
    return result;
  } catch (error) {
    console.error("Error in fetchEntries:", error);
    return [];
  }
};