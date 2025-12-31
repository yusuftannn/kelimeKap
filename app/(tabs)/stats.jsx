import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PageHeader from "../../src/components/PageHeader";
import { WordService } from "../../src/services/words.service";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function Stats() {
  const user = useAuthStore((s) => s.user);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await WordService.getUserStats(user.id);
      setStats(data);
    } catch (e) {
      console.log("Stats error:", e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  if (!user || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const accuracy =
    stats.correct + stats.wrong > 0
      ? Math.round(
          (stats.correct / (stats.correct + stats.wrong)) * 100
        )
      : 0;

  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="İstatistikler" />

      <View style={styles.container}>
        <View style={[styles.card, styles.accuracyCard]}>
          <Text style={styles.accuracyValue}>{accuracy}%</Text>
          <Text style={styles.accuracyLabel}>Başarı Oranı</Text>
        </View>

        <View style={styles.kpiRow}>
          <KPI title="Toplam" value={stats.total} />
          <KPI title="Doğru" value={stats.correct} color="#2ecc71" />
          <KPI title="Yanlış" value={stats.wrong} color="#e74c3c" />
        </View>

        <View style={styles.card}>
          <Section title="Kelime Durumu">
            <Stat label="Biliyorum" value={stats.known} />
            <Stat label="Öğreniliyor" value={stats.learning} />
            <Stat label="Yeni" value={stats.new} />
            <Stat label="Kaydedilen" value={stats.saved} />
          </Section>
        </View>
      </View>
    </View>
  );
}

function KPI({ title, value, color = "#333" }) {
  return (
    <View style={styles.kpi}>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
      <Text style={styles.kpiTitle}>{title}</Text>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </>
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
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },

  accuracyCard: {
    alignItems: "center",
  },
  accuracyValue: {
    fontSize: 42,
    fontWeight: "800",
    color: "#4f46e5",
  },
  accuracyLabel: {
    marginTop: 4,
    fontSize: 14,
    color: "#777",
  },

  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  kpi: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: "center",
    elevation: 2,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  kpiTitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#777",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    color: "#555",
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
  },
});
