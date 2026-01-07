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
        set((state) => {
          if (state.user?.id === "guest") {
            return state;
          }

          return {
            user: {
              id: "guest",
              role: "guest",
              email: null,
              name: "",
              username: "",
              level: null,
            },
            token: null,
            isGuest: true,
          };
        }),

      logout: () =>
        set((state) => ({
          user: state.user
            ? {
                id: "guest",
                email: null,
                name: state.user.name ?? "",
                username: state.user.username ?? "",
                level: state.user.level,
              }
            : null,
          token: null,
          isGuest: true,
        })),
    }),
    {
      name: "auth-storage",
    }
  )
);
