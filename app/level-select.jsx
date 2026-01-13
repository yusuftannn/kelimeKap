import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Button from "../src/components/Button";
import PageHeader from "../src/components/PageHeader";
import { LevelService } from "../src/services/level.service";
import { UserService } from "../src/services/user.service";
import { useAuthStore } from "../src/store/useAuthStore";
import { useWordStore } from "../src/store/useWordStore";

export default function LevelSelect() {
  const user = useAuthStore((s) => s.user);
  const updateAuthUser = useAuthStore((s) => s.setUser);
  const setLevelLocal = useWordStore((s) => s.setLevel);
  const isGuest = useAuthStore((s) => s.isGuest);

  const [levels, setLevels] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user?.level) {
        router.replace("/(tabs)");
        return;
      }

      loadLevels();
    }, [user?.level])
  );

  const loadLevels = useCallback(async () => {
    try {
      setLoading(true);
      const data = await LevelService.getLevels();
      setLevels(data);
    } catch (e) {
      console.log("Level load error:", e);
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Seviyeler yüklenirken hata oluştu.",
        visibilityTime: 2500,
      });
    } finally {
      setLoading(false);
    }
  }, []);
  const handleSave = async () => {
    if (!selected) return;

    try {
      setSaving(true);

      if (!isGuest) {
        await UserService.updateProfile(user.id, {
          level: selected.code,
        });
      }

      setLevelLocal(selected.code);
      updateAuthUser({ ...user, level: selected.code });

      router.replace("/(tabs)");
    } catch (e) {
      console.log("Level save error:", e);
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Seviyeler kaydedilirken hata oluştu.",
        visibilityTime: 2500,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="İngilizce Seviyeni Seç" showBack={false} />

      <View style={styles.container}>
        {levels.map((level) => {
          const isSelected = selected?.id === level.id;

          return (
            <TouchableOpacity
              key={level.id}
              activeOpacity={0.8}
              onPress={() => setSelected(level)}
              style={[styles.card, isSelected && styles.cardSelected]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.levelTitle}>
                  {level.code} · {level.title}
                </Text>

                <View style={[styles.check, isSelected && styles.checkActive]}>
                  {isSelected && <Text style={styles.checkText}>✓</Text>}
                </View>
              </View>

              <Text style={styles.desc}>{level.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button
          title={saving ? "Kaydediliyor..." : "Kaydet"}
          disabled={!selected || saving}
          onPress={handleSave}
        />
      </View>
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

  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#FFF",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  cardSelected: {
    borderColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  levelTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  desc: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },

  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
  },
  checkActive: {
    borderColor: "#4F46E5",
    backgroundColor: "#4F46E5",
  },
  checkText: {
    color: "#FFF",
    fontWeight: "700",
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#EEE",
    backgroundColor: "#FFF",
  },
});
