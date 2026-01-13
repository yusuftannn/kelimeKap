import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { useAuthStore } from "../store/useAuthStore";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setUser = useAuthStore((s) => s.setUser);
  const setGuest = useAuthStore((s) => s.setGuest);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await AuthService.login(email, password);
      const uid = result.id;

      const userData = await UserService.getUser(uid);

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
      Toast.show({
        type: "error",
        text1: "Giriş Başarısız",
        text2: "Lütfen bilgilerinizi kontrol edin ve tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
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
    } catch (e) {
      console.log("Kayıt başarısız", e);

      Toast.show({
        type: "error",
        text1: "Kayıt Başarısız",
        text2: "Hesap oluşturulurken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = () => {
    setGuest();

    const { user } = useAuthStore.getState();

    console.log("Guest user after set:", user);

    if (user?.level) {
      router.replace("/(tabs)");
    } else {
      router.replace("/level-select");
    }
  };

  const refreshUser = async () => {
    const currentUser = useAuthStore.getState().user;

    if (!currentUser || currentUser.id === "guest") return;

    try {
      const userData = await UserService.getUser(currentUser.id);

      useAuthStore.getState().setUser({
        ...currentUser,
        role: userData?.role ?? "user",
        level: userData?.level ?? null,
        name: userData?.name ?? null,
        username: userData?.username ?? null,
      });
    } catch (e) {
      console.log("User refresh error:", e);
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "User refresh bir hata oluştu.",
      });
    }
  };

  return {
    login,
    register,
    guestLogin,
    refreshUser,
    loading,
    error,
  };
}
