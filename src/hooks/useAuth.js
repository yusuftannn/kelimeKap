import { router } from "expo-router";
import { useState } from "react";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { useAuthStore } from "../store/useAuthStore";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await AuthService.login(email, password);
      const uid = result.id;

      const userData = await UserService.getUser(uid);

      useAuthStore.getState().setUser({
        id: uid,
        email: result.email,
        level: userData?.level ?? null,
        username: userData?.username ?? null,
      });

      if (!userData?.level) {
        router.replace("/level-select");
        return;
      }

      router.replace("/(tabs)");
    } catch (err) {
      setError("Giriş yapılamadı!");
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
      setError("Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    loading,
    error,
  };
}
