import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../../assets/images/logo.png";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import useAuth from "../../src/hooks/useAuth";

export default function Login() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) return;
    login(email.trim(), password);
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo}></Image>
      <View style={styles.content}>
        <Text style={styles.title}>Hoşgeldiniz</Text>
        <Text style={styles.subtitle}>Hadi başlayalım.</Text>
        <Text style={styles.subtitle}>İngilizce öğrenmeye hazır mısınız?</Text>
      </View>

      <Input placeholder="Email" value={email} onChangeText={setEmail} />

      <View style={styles.passwordWrapper}>
        <Input
          placeholder="Şifre"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
        />

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#2E6EF7" />
      ) : (
        <Button title="Giriş Yap" onPress={handleLogin} />
      )}

      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.link}>Hesabın yok mu? Kayıt Ol</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
        <Text style={styles.forgot}>Şifremi Unuttum</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  content: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 30,
    color: "#161711",
  },
  subtitle: {
    fontSize: 16,
    color: "#161711",
    marginBottom: 4,
  },

  link: {
    textAlign: "center",
    color: "#2E6EF7",
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
  },

  forgot: {
    textAlign: "center",
    color: "#888",
    marginTop: 8,
    fontSize: 14,
  },

  error: {
    color: "red",
    marginBottom: 10,
    fontWeight: "600",
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  passwordWrapper: {
    position: "relative",
    width: "100%",
  },

  eyeButton: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: [{ translateY: -12 }],
  },

  eyeText: {
    fontSize: 20,
  },
});
