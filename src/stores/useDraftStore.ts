import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DraftState = {
  content: string;
  setContent: (text: string) => void;
  clear: () => void;
};

export const useDraftStore = create<DraftState>()(
  persist(
    immer((set) => ({
      content: "",
      setContent: (text: string) =>
        set((state) => {
          state.content = text;
        }),
      clear: () =>
        set((state) => {
          state.content = "";
        }),
    })),
    {
      name: "draft",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ content: state.content }),
    }
  )
);