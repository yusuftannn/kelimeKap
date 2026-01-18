import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { useAuthStore } from "../store/useAuthStore";

interface UseAuthReturn {
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string,
  ) => Promise<void>;
  guestLogin: () => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hydrated = useAuthStore((s) => s.hydrated);
  const setUser = useAuthStore((s) => s.setUser);
  const setGuest = useAuthStore((s) => s.setGuest);

  const login = async (identifier: string, password: string): Promise<void> => {
    if (!hydrated) return;

    try {
      setLoading(true);
      setError(null);

      let email = identifier.trim().toLowerCase();

      if (!email.includes("@")) {
        const userByUsername = await UserService.getUserByUsername(email);

        if (!userByUsername) {
          throw new Error("USER_NOT_FOUND");
        }

        email = userByUsername.email;
      }

      const result = await AuthService.login(email, password);
      const uid = result.id;

      const userData = await UserService.getUser(uid);

      if (!userData) {
        throw new Error("USER_DOC_NOT_FOUND");
      }

      setUser({
        id: uid,
        email: userData.email,
        name: userData.name ?? null,
        level: userData.level ?? null,
        username: userData.username ?? null,
        role: userData.role ?? "user",
      });

      if (!userData.level) {
        router.replace("/level-select");
      } else {
        router.replace("/(tabs)");
      }
    } catch (err) {
      console.log("Login error:", err);
      setError("LOGIN_FAILED");

      Toast.show({
        type: "error",
        text1: "Giriş Başarısız",
        text2: "Email / kullanıcı adı veya şifre hatalı.",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedUsername = username.trim().toLowerCase();

      const isTaken = await UserService.isUsernameTaken(normalizedUsername);

      if (isTaken) {
        Toast.show({
          type: "error",
          text1: "Kullanıcı Adı Kullanılıyor",
          text2: "Lütfen farklı bir kullanıcı adı seçin.",
        });
        return;
      }

      const result = await AuthService.register(normalizedEmail, password);

      await UserService.createUser(
        result.id,
        normalizedEmail,
        normalizedUsername,
      );

      Toast.show({
        type: "success",
        text1: "Hoş Geldin!",
        text2: "Hesabın başarıyla oluşturuldu.",
        visibilityTime: 2000,
      });

      router.replace("/(auth)/login");
    } catch (err: any) {
      console.log("Register error:", err);

      if (err?.code === "auth/email-already-in-use") {
        Toast.show({
          type: "error",
          text1: "Bu Email Zaten Kullanılıyor",
          text2: "Lütfen farklı bir email adresi deneyin.",
        });
        return;
      }

      if (err?.code === "auth/invalid-email") {
        Toast.show({
          type: "error",
          text1: "Geçersiz Email",
          text2: "Lütfen geçerli bir email adresi girin.",
        });
        return;
      }

      if (err?.code === "auth/weak-password") {
        Toast.show({
          type: "error",
          text1: "Zayıf Şifre",
          text2: "Şifre en az 6 karakter olmalıdır.",
        });
        return;
      }

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
      const userData = await UserService.getUser(currentUser.id);
      if (!userData) return;

      setUser({
        ...currentUser,
        role: userData.role ?? "user",
        level: userData.level ?? null,
        name: userData.name ?? null,
        username: userData.username ?? null,
      });
    } catch (err) {
      console.log("Refresh user error:", err);
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
