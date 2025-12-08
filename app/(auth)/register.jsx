import { router } from "expo-router";
import { Text, View } from "react-native";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";

export default function Register() {
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Kayıt Ol</Text>

      <Input placeholder="Email" />
      <Input placeholder="Şifre" secureTextEntry />
      <Input placeholder="Şifre Tekrar" secureTextEntry />

      <Button title="Kayıt Ol" onPress={() => router.replace("/(auth)/login")} />
    </View>
  );
}
