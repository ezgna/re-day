import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type TimeSlot = {
  id: string;
  hour: number;
  minute: number;
};

const DEFAULT_SLOT: TimeSlot = { id: "slot-20-00", hour: 20, minute: 0 };

type ReminderState = {
  enabled: boolean;
  timeSlots: TimeSlot[];
  skipIfCompleted: boolean;
  scheduled: Record<string, string[]>;
  timezone: string | null;
};

type ReminderActions = {
  setEnabled: (enabled: boolean) => void;
  setTimeSlots: (slots: TimeSlot[]) => void;
  setSkipIfCompleted: (value: boolean) => void;
  setScheduledForDate: (dateKey: string, ids: string[]) => void;
  clearDate: (dateKey: string) => void;
  resetScheduled: () => void;
  setTimezone: (timezone: string) => void;
};

const initialState: ReminderState = {
  enabled: true,
  timeSlots: [DEFAULT_SLOT],
  skipIfCompleted: true,
  scheduled: {},
  timezone: null,
};

export const useReminderStore = create<ReminderState & ReminderActions>()(
  persist(
    immer((set) => ({
      ...initialState,
      setEnabled: (enabled: boolean) =>
        set((state) => {
          state.enabled = enabled;
        }),
      setTimeSlots: (slots: TimeSlot[]) =>
        set((state) => {
          state.timeSlots = slots;
        }),
      setSkipIfCompleted: (value: boolean) =>
        set((state) => {
          state.skipIfCompleted = value;
        }),
      setScheduledForDate: (dateKey: string, ids: string[]) =>
        set((state) => {
          state.scheduled[dateKey] = ids;
        }),
      clearDate: (dateKey: string) =>
        set((state) => {
          delete state.scheduled[dateKey];
        }),
      resetScheduled: () =>
        set((state) => {
          state.scheduled = {};
        }),
      setTimezone: (timezone: string) =>
        set((state) => {
          state.timezone = timezone;
        }),
    })),
    {
      name: "reminder-settings",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        enabled: state.enabled,
        timeSlots: state.timeSlots,
        skipIfCompleted: state.skipIfCompleted,
        scheduled: state.scheduled,
        timezone: state.timezone,
      }),
    }
  )
);
