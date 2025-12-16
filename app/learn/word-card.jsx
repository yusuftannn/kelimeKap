import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Button from "../../src/components/Button";
import WordCard from "../../src/components/WordCard";
import { WordService } from "../../src/services/words.service";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function WordCardScreen() {
  const user = useAuthStore((s) => s.user);

  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.level) {
      router.replace("/level-select");
      return;
    }

    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      const data = await WordService.getWordsByLevel(user.level);

      if (!data || data.length === 0) {
        setError("Bu seviye için kelime bulunamadı.");
        return;
      }

      setWords(data);
    } catch (e) {
      console.log("WORD LOAD ERROR:", e);
      setError("Kelimeler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => {
    if (index + 1 >= words.length) {
      router.replace("/learn/result");
    } else {
      setIndex(index + 1);
    }
  };
  const handleCorrect = async () => {
    const userWordId = await WordService.getOrCreateUserWord(
      user.id,
      currentWord.id
    );

    await WordService.markCorrect(userWordId);
    goNext();
  };

  const handleWrong = async () => {
    const userWordId = await WordService.getOrCreateUserWord(
      user.id,
      currentWord.id
    );

    await WordService.markWrong(userWordId);
    goNext();
  };

  const handleSave = async () => {
    const userWordId = await WordService.getOrCreateUserWord(
      user.id,
      currentWord.id
    );

    await WordService.toggleSaved(userWordId, true);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  const currentWord = words[index];

  return (
    <View style={styles.container}>
      <WordCard
        front={currentWord.en}
        back={currentWord.tr}
        exampleEn={currentWord.example_en}
        exampleTr={currentWord.example_tr}
      />

      <View style={styles.actions}>
        <Button title="Bilmiyorum" variant="secondary" onPress={handleWrong} />
        <Button title="Kaydet" onPress={handleSave} />
        <Button title="Biliyorum" onPress={handleCorrect} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  actions: { marginTop: 20 },
});
