import { router } from "expo-router";
import { useState } from "react";
import { AuthService } from "../services/auth.service";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const user = await AuthService.login(email, password);
      router.replace("/(tabs)");

      return user;
    } catch (e) {
      setError("Giriş yapılamadı");
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
