import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import useAuth from "../../src/hooks/useAuth";

export default function Login() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) return;
    login(email.trim(), password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <Input
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#2E6EF7" />
      ) : (
        <Button title="Giriş Yap" onPress={handleLogin} />
      )}

      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.link}>Hesabın yok mu? Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
        <Text style={styles.forgot}>Şifremi Unuttum</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 30,
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
});
