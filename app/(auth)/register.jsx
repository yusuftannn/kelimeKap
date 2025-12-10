import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import useAuth from "../../src/hooks/useAuth";

export default function Register() {
  const { register, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleRegister = () => {
    if (!email || !password) return;
    if (password !== password2) {
      alert("Şifreler eşleşmiyor.");
      return;
    }

    register(email.trim(), password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>

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

      <Input
        placeholder="Şifre Tekrar"
        secureTextEntry
        value={password2}
        onChangeText={setPassword2}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#2E6EF7" />
      ) : (
        <Button title="Kayıt Ol" onPress={handleRegister} />
      )}

      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.link}>Zaten bir hesabın var mı? Giriş Yap</Text>
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
    marginBottom: 24,
  },

  link: {
    textAlign: "center",
    color: "#2E6EF7",
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
  },

  error: {
    color: "red",
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "600",
  },
});
