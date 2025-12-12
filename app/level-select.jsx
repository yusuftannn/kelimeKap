import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Button from "../src/components/Button";
import { UserService } from "../src/services/user.service";
import { useAuthStore } from "../src/store/useAuthStore";
import { useWordStore } from "../src/store/useWordStore";

export default function LevelSelect() {
  const user = useAuthStore((s) => s.user);
  const setLevelLocal = useWordStore((s) => s.setLevel);
  const updateAuthUser = useAuthStore((s) => s.setUser);

  const handleSelect = async (level) => {
    await UserService.updateLevel(user.id, level);

    setLevelLocal(level);
    updateAuthUser({ ...user, level });

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İngilizce Seviyeni Seç</Text>

      {["A1", "A2", "B1", "B2", "C1"].map((lvl) => (
        <Button key={lvl} title={lvl} onPress={() => handleSelect(lvl)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
});
