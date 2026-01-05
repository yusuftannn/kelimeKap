import { router } from "expo-router";
import { useState } from "react";
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
      });

      if (!userData?.level) {
        router.replace("/level-select");
        return;
      }

      router.replace("/(tabs)");
    } catch (err) {
      setError("Giriş yapılamadı!", err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      await AuthService.register(email, password);
      router.replace("/(auth)/login");
    } catch (e) {
      setError("Kayıt başarısız", e);
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = () => {
    setGuest();
    router.replace("/level-select");
  };

  return {
    login,
    register,
    guestLogin,
    loading,
    error,
  };
}
