import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Button from "../../src/components/Button";
import PageHeader from "../../src/components/PageHeader";
import WordCard from "../../src/components/WordCard";
import { WordService } from "../../src/services/words.service";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function WordCardScreen() {
  const user = useAuthStore((s) => s.user);
  const { mode } = useLocalSearchParams();

  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.level) {
      router.replace("/level-select");
      return;
    }

    loadWords();
  }, [user?.level, loadWords]);

  const loadWords = useCallback(async () => {
    try {
      let data = [];

      if (mode === "saved") {
        data = await WordService.getSavedWordsForStudy(user.id);
      } else {
        data = await WordService.getWordsByLevel(user.level);
      }

      if (!data || data.length === 0) {
        setError("Çalışılacak kelime bulunamadı.");
        return;
      }

      setWords(data);
    } catch (e) {
      console.log("WORD LOAD ERROR:", e);
      setError("Kelimeler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [mode, user?.id, user?.level]);

  const goNext = () => {
    setActionType(null);

    if (index + 1 >= words.length) {
      router.replace({
        pathname: "/learn/result",
        params: { mode },
      });
    } else {
      setIndex((prev) => prev + 1);
    }
  };
  const handleCorrect = async () => {
    setActionType("correct");

    const userWordId = await WordService.getOrCreateUserWord(
      user.id,
      currentWord.id
    );

    await WordService.markCorrect(userWordId);
    goNext();
  };
  const handleWrong = async () => {
    setActionType("wrong");

    const userWordId = await WordService.getOrCreateUserWord(
      user.id,
      currentWord.id
    );

    await WordService.markWrong(userWordId);
    goNext();
  };

  const handleSave = async () => {
    if (actionType) return;

    setActionType("save");

    const userWordId = await WordService.getOrCreateUserWord(
      user.id,
      currentWord.id
    );

    await WordService.toggleSaved(userWordId, true);

    setSaved(true);
    setActionType(null);
  };
  useEffect(() => {
    setSaved(false);
    setActionType(null);
  }, [index]);

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
    <View style={{ flex: 1 }}>
      <PageHeader title="Öğren" showBack={false} />
      <View style={styles.container}>
        <WordCard
          front={currentWord.en}
          back={currentWord.tr}
          exampleEn={currentWord.example_en}
          exampleTr={currentWord.example_tr}
        />

        <View style={styles.actions}>
          <Button
            title={actionType === "wrong" ? "İşleniyor..." : "Bilmiyorum"}
            variant="danger"
            onPress={handleWrong}
            disabled={actionType !== null}
          />

          <Button
            title={saved ? "Kaydedildi" : "Kaydet"}
            variant="outline"
            onPress={handleSave}
            disabled={actionType !== null || saved}
          />

          <Button
            title={actionType === "correct" ? "İşleniyor..." : "Biliyorum"}
            variant="success"
            onPress={handleCorrect}
            disabled={actionType !== null}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  actions: { marginTop: 20 },
});
