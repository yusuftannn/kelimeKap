import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WordService } from "../../src/services/words.service";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function Stats() {
  const user = useAuthStore((s) => s.user);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await WordService.getUserStats(user.id);
      setStats(data);
    } catch (e) {
      console.log("Stats error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text>İstatistik bulunamadı.</Text>
      </View>
    );
  }

  const accuracy =
    stats.correct + stats.wrong > 0
      ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)
      : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İstatistikler</Text>

      <View style={styles.card}>
        <Stat label="Toplam Çalışılan" value={stats.total} />
        <Stat label="Biliyorum" value={stats.known} />
        <Stat label="Öğreniliyor" value={stats.learning} />
        <Stat label="Yeni" value={stats.new} />
        <Stat label="Kaydedilen" value={stats.saved} />
      </View>

      <View style={styles.card}>
        <Stat label="Doğru Sayısı" value={stats.correct} />
        <Stat label="Yanlış Sayısı" value={stats.wrong} />
        <Stat label="Başarı Oranı" value={`${accuracy}%`} />
      </View>
    </View>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
  },
});
