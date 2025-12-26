import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../../src/components/Button";
import PageHeader from "../../src/components/PageHeader";
import { WordService } from "../../src/services/words.service";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function Saved() {
  const user = useAuthStore((s) => s.user);

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    try {
      const data = await WordService.getSavedWords(user.id);
      setWords(data);
    } catch (e) {
      console.log("Saved load error:", e);
    } finally {
      setLoading(false);
    }
  };
  const handleRemove = async (wordId) => {
    await WordService.removeSavedWord(user.id, wordId);

    setWords((prev) => prev.filter((w) => w.id !== wordId));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (words.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Henüz kaydedilmiş kelime yok.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="Kaydedilenler" />
      <View style={styles.container}>
        <Button
          title="Kaydedilenlerden Tekrar Çalış"
          onPress={() => router.push("/learn/word-card?mode=saved")}
        />
        <FlatList
          data={words}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.en}>{item.en}</Text>
              <Text style={styles.tr}>{item.tr}</Text>

              {item.example_tr && (
                <Text style={styles.example}>{item.example_tr}</Text>
              )}

              <Button
                title="Kaydı Kaldır"
                variant="secondary"
                onPress={() => handleRemove(item.id)}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  en: {
    fontSize: 20,
    fontWeight: "700",
  },
  tr: {
    fontSize: 16,
    marginTop: 4,
  },
  example: {
    fontSize: 13,
    color: "#777",
    marginTop: 6,
  },
});
