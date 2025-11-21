import { hasEntryForDate } from "@/src/database/db";
import { TimeSlot, useReminderStore } from "@/src/stores/useReminderStore";
import { addDaysLocal, formatDateKey, startOfLocalDay, todayLocal } from "@/utils/date";
import i18n from "@/utils/i18n";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const REMINDER_CHANNEL_ID = "daily-reminder";
const log = (...args: unknown[]) => {
  if (__DEV__) {
    console.log("[Reminder]", ...args);
  }
};

const getDeviceTimezone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";

const ensurePermission = async (): Promise<boolean> => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;

  const request = await Notifications.requestPermissionsAsync();
  log("ensurePermission", { status, requested: request.status });
  return request.status === "granted";
};

const ensureAndroidChannel = async () => {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
    name: "Reminders",
    importance: Notifications.AndroidImportance.HIGH,
  });
};

const buildContent = (dateKey: string): Notifications.NotificationContentInput => ({
  title: i18n.t("reminder.title"),
  body: i18n.t("reminder.body"),
  data: { type: "daily-reminder", targetDate: dateKey },
  sound: true,
});

const buildTrigger = (target: Date, timezone: string): Notifications.NotificationTriggerInput => {
  if (Platform.OS === "ios") {
    return {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      channelId: REMINDER_CHANNEL_ID,
      year: target.getFullYear(),
      month: target.getMonth(),
      day: target.getDate(),
      hour: target.getHours(),
      minute: target.getMinutes(),
      second: 0,
      repeats: false,
      timezone,
    } as Notifications.CalendarTriggerInput;
  }
  // Android は Date オブジェクトで単発通知を予約する
  return target;
};

const scheduleForDate = async (target: Date, slots: TimeSlot[], timezone: string): Promise<string[]> => {
  const requestDateKey = formatDateKey(target);
  const sortedSlots = [...slots].sort((a, b) => a.hour - b.hour || a.minute - b.minute);
  const ids: string[] = [];

  for (const slot of sortedSlots) {
    const slotDate = new Date(target);
    slotDate.setHours(slot.hour, slot.minute, 0, 0);
    if (slotDate.getTime() <= Date.now()) {
      log("skip past slot", { dateKey: requestDateKey, hour: slot.hour, minute: slot.minute });
      continue; // 過去の時刻はスキップ
    }

    const trigger = buildTrigger(slotDate, timezone);
    const id = await Notifications.scheduleNotificationAsync({
      content: buildContent(requestDateKey),
      trigger,
    });
    ids.push(id);
    log("scheduled", { id, dateKey: requestDateKey, hour: slot.hour, minute: slot.minute, tz: timezone });
  }

  return ids;
};

const cancelList = async (ids: string[]) => {
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
};

const cancelAllKnown = async () => {
  const { scheduled, resetScheduled } = useReminderStore.getState();
  const allIds = Object.values(scheduled).flat();
  if (allIds.length > 0) {
    await cancelList(allIds);
  }
  resetScheduled();
};

const cancelPastDates = async () => {
  const todayKey = formatDateKey(todayLocal());
  const { scheduled, clearDate } = useReminderStore.getState();
  const pastKeys = Object.keys(scheduled).filter((key) => key < todayKey);
  for (const key of pastKeys) {
    await cancelList(scheduled[key]);
    clearDate(key);
  }
};

const ReminderService = {
  // アプリ起動時に権限確認・チャネル作成を実施
  async init() {
    log("init start");
    const granted = await ensurePermission();
    if (!granted) return;

    await ensureAndroidChannel();

    const tz = getDeviceTimezone();
    useReminderStore.getState().setTimezone(tz);

    await this.syncUpcoming();
    log("init done");
  },

  // 今日〜指定日数分の通知を組み直す
  async syncUpcoming(daysAhead = 7) {
    log("syncUpcoming start", { daysAhead });
    const { enabled, timeSlots, skipIfCompleted, setScheduledForDate, clearDate, setTimezone, timezone } = useReminderStore.getState();
    if (!enabled || timeSlots.length === 0) {
      await cancelAllKnown();
      log("syncUpcoming stop: disabled or no slots");
      return;
    }

    const granted = await ensurePermission();
    if (!granted) {
      log("syncUpcoming stop: permission denied");
      return;
    }
    await ensureAndroidChannel();

    await cancelPastDates();

    const currentTz = getDeviceTimezone();
    if (timezone !== currentTz) {
      setTimezone(currentTz);
      log("timezone updated", { currentTz });
    }

    const today = todayLocal();
    const touched = new Set<string>();

    for (let i = 0; i < daysAhead; i++) {
      const target = addDaysLocal(today, i);
      const dateKey = formatDateKey(target);
      touched.add(dateKey);

      if (i === 0 && skipIfCompleted) {
        const exists = await hasEntryForDate(target);
        if (exists) {
          await this.cancelForDate(dateKey);
          log("skip today because entry exists", { dateKey });
          continue;
        }
      }

      await this.cancelForDate(dateKey);
      const ids = await scheduleForDate(target, timeSlots, currentTz);
      if (ids.length > 0) {
        setScheduledForDate(dateKey, ids);
      } else {
        clearDate(dateKey);
      }
    }

    const existingKeys = Object.keys(useReminderStore.getState().scheduled);
    const extraKeys = existingKeys.filter((key) => !touched.has(key));
    for (const key of extraKeys) {
      await this.cancelForDate(key);
    }
    log("syncUpcoming done", { scheduledKeys: Array.from(touched) });
  },

  // 特定日付の予約を解除
  async cancelForDate(dateKey: string) {
    const { scheduled, clearDate } = useReminderStore.getState();
    const ids = scheduled[dateKey] ?? [];
    if (ids.length > 0) {
      await cancelList(ids);
      log("cancelForDate", { dateKey, count: ids.length });
    }
    clearDate(dateKey);
  },

  // エントリ保存後のハンドラ
  async handleEntrySaved() {
    const key = formatDateKey(todayLocal());
    await this.cancelForDate(key);
    await this.syncUpcoming();
    log("handleEntrySaved complete");
  },

  // AppState active 遷移時の同期
  async handleAppForeground() {
    const { enabled, skipIfCompleted } = useReminderStore.getState();
    if (!enabled) return;

    const timezone = getDeviceTimezone();
    const current = useReminderStore.getState().timezone;
    if (current && timezone !== current) {
      await cancelAllKnown();
      useReminderStore.getState().setTimezone(timezone);
      await this.syncUpcoming();
      log("appForeground timezone changed", { timezone });
      return;
    }

    if (skipIfCompleted) {
      const today = todayLocal();
      const hasEntry = await hasEntryForDate(today);
      if (hasEntry) {
        await this.cancelForDate(formatDateKey(today));
        log("appForeground cancelled today (entry exists)");
      }
    }

    await this.syncUpcoming();
    log("appForeground sync done");
  },

  // 設定変更時に外部から呼ぶ
  async handleSettingsChange() {
    await this.syncUpcoming();
    log("handleSettingsChange");
  },

  // 通知タップ時の遷移を登録
  addNotificationResponseListener() {
    return Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as { type?: string };
      if (data?.type === "daily-reminder") {
        router.push("/calendarview");
      }
    });
  },

  // テスト通知を 5 秒後に送信
  async sendTestNotification() {
    const granted = await ensurePermission();
    if (!granted) {
      throw new Error("permission-denied");
    }
    await ensureAndroidChannel();

    const trigger =
      Platform.OS === "android"
        ? { seconds: 5, channelId: REMINDER_CHANNEL_ID }
        : new Date(Date.now() + 5000); // iOS では date トリガーの方が 0 秒扱いになる挙動を回避しやすい

    await Notifications.scheduleNotificationAsync({
      content: {
        ...buildContent(formatDateKey(startOfLocalDay(new Date()))),
        title: i18n.t("reminder.testTitle"),
        body: i18n.t("reminder.testBody"),
      },
      trigger,
    });
  },
};

export default ReminderService;
