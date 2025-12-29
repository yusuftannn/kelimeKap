import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Result() {
  const { mode } = useLocalSearchParams();

  const isSavedMode = mode === "saved";

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons
          name={isSavedMode ? "bookmark" : "trophy"}
          size={48}
          color="#2563EB"
        />
      </View>

      <Text style={styles.title}>
        {isSavedMode ? "Kaydedilenleri Bitirdin!" : "Bu Seviyeyi Tamamladın!"}
      </Text>

      <Text style={styles.subtitle}>
        {isSavedMode
          ? "Kaydettiğin tüm kelimeleri başarıyla tekrar ettin."
          : "Harika iş! Öğrenme yolculuğunda bir adım daha ileri gittin."}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/")}
        activeOpacity={0.85}
      >
        <Ionicons name="home-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Anasayfaya Dön</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  iconWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#101828",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#667085",
    marginBottom: 36,
    lineHeight: 22,
  },

  button: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
