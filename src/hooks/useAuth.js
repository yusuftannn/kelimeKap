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

      router.replace("/(tabs)"); // Login sonrası yönlendirme
      return user;
    } catch (err) {
      setError(err.response?.data?.message || "Giriş hatası");
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await AuthService.register(email, password);
      router.replace("/(auth)/login");

      return result;
    } catch (err) {
      setError(err.response?.data?.message || "Kayıt hatası");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    router.replace("/(auth)/login");
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
  };
}
