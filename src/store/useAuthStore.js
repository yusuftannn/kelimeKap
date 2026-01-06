import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isGuest: false,

      setUser: (userData) =>
        set({
          user: userData,
          isGuest: false,
        }),

      setGuest: () =>
        set((state) => ({
          user:
            state.user?.id === "guest"
              ? state.user
              : {
                  id: "guest",
                  email: null,
                  name: null,
                  username: null,
                  level: null,
                },
          token: null,
          isGuest: true,
        })),

      logout: () =>
        set({
          user: null,
          token: null,
          isGuest: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
