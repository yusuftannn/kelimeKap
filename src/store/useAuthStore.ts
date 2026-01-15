import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserRole = "user" | "admin" | "guest";

export interface AuthUser {
  id: string;
  email: string | null;
  role: UserRole;
  name: string | null;
  username: string | null;
  level: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isGuest: boolean;
  hydrated: boolean;

  setUser: (userData: AuthUser) => void;
  setGuest: () => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isGuest: false,
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      setUser: (userData) =>
        set({
          user: userData,
          isGuest: false,
        }),

      setGuest: () =>
        set((state) => {
          if (state.user?.id === "guest") return state;

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
        set({
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
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
