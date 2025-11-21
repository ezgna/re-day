import i18n from "@/utils/i18n";
import { startOfLocalDay } from "@/utils/date";
import * as SQLite from "expo-sqlite";
import { Alert } from "react-native";
import { Entry } from "./types";

let db: SQLite.SQLiteDatabase | null = null;

export const getDB = async () => {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync("anokoro-diary.db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      content TEXT NOT NULL
    );
  `);

  return db;
};

export const insertEntry = async (content: string) => {
  const conn = await getDB();

  // const yesterday = new Date();
  // yesterday.setDate(yesterday.getDate() - 1);
  // const isoYesterday = yesterday.toISOString();

  // const testDate = new Date(2025, 5, 17); // 月は0始まり（5=6月）
  // const isoTestDate = testDate.toISOString();

  // await conn.runAsync(`INSERT INTO entries (created_at, content) VALUES (?, ?)`, isoTestDate, content);
  
  const date = new Date().toISOString();
  await conn.runAsync(`INSERT INTO entries (created_at, content) VALUES (?, ?)`, date, content); //debug
};

export const fetchEntries = async () => {
  const conn = await getDB();

  const result = await conn.getAllAsync<Entry>(`SELECT * FROM entries ORDER BY created_at DESC`);
  // console.log("Entries fetched successfully", result);
  return result;
};

export const deleteEntry = async (id: number) => {
  const conn = await getDB();

  const confirmed = await new Promise((resolve) => {
    Alert.alert(i18n.t("alert_delete_message"), undefined, [
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
  await conn.runAsync("DELETE FROM entries WHERE id = ?", [id]);
};

export const updateEntry = async (id: number, content: string) => {
  const conn = await getDB();

  await conn.runAsync(`UPDATE entries SET content = ? WHERE id = ?`, [content, id]);
};

// 指定日のエントリが存在するかローカル日付境界で判定
export const hasEntryForDate = async (target: Date): Promise<boolean> => {
  const conn = await getDB();

  const start = startOfLocalDay(target);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const result = await conn.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM entries WHERE created_at >= ? AND created_at < ?`,
    start.toISOString(),
    end.toISOString()
  );

  return (result?.count ?? 0) > 0;
};
