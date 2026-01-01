import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
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
  const [search, setSearch] = useState("");

  const loadSaved = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const data = await WordService.getSavedWords(user.id);
      setWords(data);
    } catch (error) {
      console.error("Saved words load error:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [loadSaved])
  );

  const handleRemove = useCallback(
    async (wordId) => {
      try {
        await WordService.removeSavedWord(user.id, wordId);
        setWords((prev) => prev.filter((w) => w.id !== wordId));
      } catch (error) {
        console.error("Remove saved word error:", error);
      }
    },
    [user?.id]
  );

  const filteredWords = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return words;

    return words.filter(
      (w) => w.en?.toLowerCase().includes(q) || w.tr?.toLowerCase().includes(q)
    );
  }, [search, words]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ED7A58" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="Kaydedilenler" />
      <View style={styles.container}>
        <TextInput
          style={styles.search}
          placeholder="Kelime ara (EN / TR)"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
        {words.length > 0 && (
          <Button
            title="Kaydedilenlerden Tekrar Çalış"
            onPress={() => router.push("/learn/word-card?mode=saved")}
          />
        )}
        <FlatList
          data={filteredWords}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text style={styles.empty}>Aramanıza uygun kelime bulunamadı.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.word}>{item.en}</Text>
              <View style={styles.line} />
              <Text style={styles.word}>{item.tr}</Text>

              {item.example_en && (
                <Text style={styles.example}>“{item.example_en}”</Text>
              )}

              <Button
                title="Kaydı Kaldır"
                variant="danger"
                style={styles.removeBtn}
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
    backgroundColor: "rgba(250,220,219,0.7)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  word: {
    fontSize: 20,
    fontWeight: "700",
  },
  removeBtn: {
    color: "#fff",
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ED7A58",
  },
  line: {
    width: "70%",
    height: 6,
    backgroundColor: "#ED7A58",
    marginVertical: 15,
  },
  example: {
    fontSize: 13,
    color: "#777",
    marginVertical: 12,
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
