import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../src/components/Button";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function Home() {
  const level = useAuthStore((s) => s.user?.level);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hazır mısın?</Text>
      <Text style={styles.subtitle}>Seviyen: {level}</Text>

      <Button
        title="Hemen Başla"
        onPress={() => router.push("/learn/word-card")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 20, marginBottom: 20, color: "#555" },
});
