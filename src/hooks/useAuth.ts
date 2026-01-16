import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { AuthService } from "../services/auth.service";
import type { AppUser } from "../services/user.service";
import { UserService } from "../services/user.service";
import { useAuthStore } from "../store/useAuthStore";

interface UseAuthReturn {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  guestLogin: () => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hydrated = useAuthStore((s) => s.hydrated);
  const setUser = useAuthStore((s) => s.setUser);
  const setGuest = useAuthStore((s) => s.setGuest);

  const login = async (email: string, password: string): Promise<void> => {
    if (!hydrated) return;
    try {
      setLoading(true);
      setError(null);

      const result = await AuthService.login(email, password);
      const uid = result.id;

      const userData: AppUser | null = await UserService.getUser(uid);

      setUser({
        id: uid,
        email: result.email,
        name: userData?.name ?? null,
        level: userData?.level ?? null,
        username: userData?.username ?? null,
        role: userData?.role ?? "user",
      });

      if (!userData?.level) {
        router.replace("/level-select");
        return;
      }

      router.replace("/(tabs)");
    } catch (err) {
      console.log("Giriş yapılamadı!", err);
      setError("LOGIN_FAILED");

      Toast.show({
        type: "error",
        text1: "Giriş Başarısız",
        text2: "Lütfen bilgilerinizi kontrol edin ve tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await AuthService.register(email, password);

      Toast.show({
        type: "success",
        text1: "Hoş geldin",
        text2: "Hesabın başarıyla oluşturuldu.",
        visibilityTime: 2000,
      });

      router.replace("/(auth)/login");
    } catch (err) {
      console.log("Kayıt başarısız", err);
      setError("REGISTER_FAILED");

      Toast.show({
        type: "error",
        text1: "Kayıt Başarısız",
        text2: "Hesap oluşturulurken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = (): void => {
    if (!hydrated) return;
    setGuest();

    const { user } = useAuthStore.getState();

    if (user?.level) {
      router.replace("/(tabs)");
    } else {
      router.replace("/level-select");
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!hydrated) return;
    const currentUser = useAuthStore.getState().user;

    if (!currentUser || currentUser.id === "guest") return;

    try {
      const userData: AppUser | null = await UserService.getUser(
        currentUser.id
      );

      useAuthStore.getState().setUser({
        ...currentUser,
        role: userData?.role ?? "user",
        level: userData?.level ?? null,
        name: userData?.name ?? null,
        username: userData?.username ?? null,
      });
    } catch (err) {
      console.log("User refresh error:", err);

      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "User refresh sırasında bir hata oluştu.",
      });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);

      await AuthService.logout();

      useAuthStore.getState().logout();

      router.replace("/(auth)/login");
    } catch (err) {
      console.log("Logout error:", err);

      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Çıkış yapılırken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    guestLogin,
    refreshUser,
    logout,
    loading,
    error,
  };
}
