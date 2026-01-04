import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type AdsConsentState = {
  // NPA: Non-Personalized Ads（パーソナライズされない広告）
  npa: boolean;
  setNpa: (value: boolean) => void;
};

export const selectNpa = (state: AdsConsentState) => state.npa;
export const selectSetNpa = (state: AdsConsentState) => state.setNpa;

export const useAdsConsentStore = create<AdsConsentState>()(
  persist(
    immer((set) => ({
      npa: false,
      setNpa: (value: boolean) =>
        set((state) => {
          state.npa = value;
        }),
    })),
    {
      name: "ads-consent",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ npa: state.npa }),
    }
  )
);

