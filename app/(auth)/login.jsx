import { router } from "expo-router";
import { Text, View } from "react-native";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function Login() {
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogin = () => {
    setUser({ email: "demo@mail.com" });
    router.replace("/(tabs)");
  };

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Giriş Yap</Text>

      <Input placeholder="Email" />
      <Input placeholder="Şifre" secureTextEntry />

      <Button title="Giriş Yap" onPress={handleLogin} />

      <Button
        title="Kayıt Ol"
        variant="secondary"
        onPress={() => router.push("/(auth)/register")}
      />
    </View>
  );
}
