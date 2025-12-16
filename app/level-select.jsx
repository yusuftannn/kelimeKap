import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Button from "../src/components/Button";
import { LevelService } from "../src/services/level.service";
import { UserService } from "../src/services/user.service";
import { useAuthStore } from "../src/store/useAuthStore";
import { useWordStore } from "../src/store/useWordStore";

export default function LevelSelect() {
  const user = useAuthStore((s) => s.user);
  const setLevelLocal = useWordStore((s) => s.setLevel);
  const updateAuthUser = useAuthStore((s) => s.setUser);

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      const data = await LevelService.getLevels();
      setLevels(data);
    } catch (e) {
      console.log("Level load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (level) => {
    await UserService.updateLevel(user.id, level.code);

    setLevelLocal(level.code);
    updateAuthUser({ ...user, level: level.code });

    router.replace("/(tabs)");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İngilizce Seviyeni Seç</Text>

      {levels.map((level) => (
        <View key={level.id} style={styles.card}>
          <Text style={styles.levelTitle}>
            {level.code} · {level.title}
          </Text>

          <Text style={styles.desc}>{level.description}</Text>

          <Button
            title="Seç"
            onPress={() => handleSelect(level)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFF",
    marginBottom: 16,
    elevation: 2,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
});
