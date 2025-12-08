import { router } from "expo-router";
import { Text, View } from "react-native";
import Button from "../../src/components/Button";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function Profile() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Profil</Text>

      <Button
        title="Çıkış Yap"
        onPress={() => {
          logout();
          router.replace("/(auth)/login");
        }}
      />
    </View>
  );
}
