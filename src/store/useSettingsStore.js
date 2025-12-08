import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: "light",
      soundEnabled: true,
      notificationsEnabled: true,

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      toggleSound: () =>
        set((state) => ({
          soundEnabled: !state.soundEnabled,
        })),

      toggleNotifications: () =>
        set((state) => ({
          notificationsEnabled: !state.notificationsEnabled,
        })),
    }),
    {
      name: "settings-storage",
    }
  )
);
