import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import Toast from "react-native-toast-message";
import PageHeader from "../../src/components/PageHeader";
import { WordService } from "../../src/services/words.service";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function Stats() {
  const user = useAuthStore((s) => s.user);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await WordService.getUserStats(user.id);
      setStats(response);
    } catch (error) {
      console.log("Stats fetch error:", error);
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Veriler yüklenirken hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  const accuracy = useMemo(() => {
    if (!stats) return 0;

    const totalAnswers = stats.correct + stats.wrong;
    if (totalAnswers === 0) return 0;

    return Math.round((stats.correct / totalAnswers) * 100);
  }, [stats]);

  if (!user || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <PageHeader title="İstatistikler" />

      <View style={styles.container}>
        <AccuracyCard value={accuracy} />

        <View style={styles.kpiRow}>
          <KPI title="Toplam" value={stats.total} />
          <KPI title="Doğru" value={stats.correct} color={COLORS.success} />
          <KPI title="Yanlış" value={stats.wrong} color={COLORS.danger} />
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

function AccuracyCard({ value }) {
  return (
    <View style={[styles.card, styles.accuracyCard]}>
      <Text style={styles.accuracyValue}>{value}%</Text>
      <Text style={styles.accuracyLabel}>Başarı Oranı</Text>
    </View>
  );
}

function KPI({ title, value, color = COLORS.text }) {
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
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const COLORS = {
  primary: "#4f46e5",
  text: "#333",
  muted: "#777",
  success: "#2ecc71",
  danger: "#e74c3c",
  card: "#FFF",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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
    backgroundColor: COLORS.card,
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
    color: COLORS.primary,
  },
  accuracyLabel: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.muted,
  },

  kpiRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  kpi: {
    flex: 1,
    backgroundColor: COLORS.card,
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
    color: COLORS.muted,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  statLabel: {
    fontSize: 15,
    color: "#555",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
  },
});
