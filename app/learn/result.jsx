import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Result() {
  const { mode, total, correct, wrong, saved } = useLocalSearchParams();

  const isSavedMode = mode === "saved";
  const isWeakMode = mode === "weak";
  const stats = {
    total: Number(total || 0),
    correct: Number(correct || 0),
    wrong: Number(wrong || 0),
    saved: Number(saved || 0),
  };
  const hasStats = stats.total > 0;
  const successRate = hasStats
    ? Math.round((stats.correct / stats.total) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons
          name={isSavedMode ? "bookmark" : isWeakMode ? "refresh" : "trophy"}
          size={48}
          color="#2563EB"
        />
      </View>

      <Text style={styles.title}>
        {isSavedMode
          ? "Kaydedilenleri Bitirdin!"
          : isWeakMode
            ? "Zorlandıklarını Tekrar Ettin!"
            : "Bu Seviyeyi Tamamladın!"}
      </Text>

      <Text style={styles.subtitle}>
        {isSavedMode
          ? "Kaydettiğin tüm kelimeleri başarıyla tekrar ettin."
          : isWeakMode
            ? "Önceden zorlayan kelimelere geri dönmek öğrenmeyi kalıcı hale getirir."
          : "Harika iş! Öğrenme yolculuğunda bir adım daha ileri gittin."}
      </Text>

      {hasStats && (
        <View style={styles.summary}>
          <SummaryItem label="Toplam" value={stats.total} />
          <SummaryItem
            label="Doğru"
            value={stats.correct}
            color="#1F9D55"
          />
          <SummaryItem label="Yanlış" value={stats.wrong} color="#E5533D" />
          <SummaryItem label="Başarı" value={`${successRate}%`} />
          {stats.saved > 0 && (
            <SummaryItem label="Kaydedilen" value={stats.saved} />
          )}
        </View>
      )}

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

function SummaryItem({ label, value, color = "#2563EB" }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
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
    marginBottom: 24,
    lineHeight: 22,
  },

  summary: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 26,
  },

  summaryItem: {
    minWidth: "30%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  summaryValue: {
    fontSize: 22,
    fontWeight: "800",
  },

  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#667085",
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
