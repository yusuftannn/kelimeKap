import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
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
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    wrong: 0,
    saved: 0,
  });

  function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const loadWords = useCallback(async () => {
    try {
      let data = [];

      if (mode === "saved") {
        data = await WordService.getSavedWordsForStudy(user.id, user.level);
      } else if (mode === "weak") {
        data = await WordService.getWeakWordsForStudy(user.id, user.level);
      } else {
        data = await WordService.getWordsByLevel(user.level);
      }

      if (!data || data.length === 0) {
        setError("Çalışılacak kelime bulunamadı.");
        Toast.show({
          type: "error",
          text1: "Kelime bulunamadı",
          text2:
            mode === "weak"
              ? "Zorlandığın kelime bulunmuyor."
              : "Bu seviye için çalışılacak kelime yok.",
          visibilityTime: 2500,
        });
        return;
      }

      setWords(shuffleArray(data));
    } catch (e) {
      console.log("WORD LOAD ERROR:", e);
      setError("Kelimeler yüklenemedi.");
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Kelimeler yüklenirken bir sorun oluştu.",
        visibilityTime: 2500,
      });
    } finally {
      setLoading(false);
    }
  }, [mode, user?.id, user?.level]);

  useEffect(() => {
    if (!user?.level) {
      router.replace("/level-select");
      return;
    }

    loadWords();
  }, [user?.level, loadWords]);

  const goNext = (nextStats = sessionStats) => {
    setActionType(null);

    if (index + 1 >= words.length) {
      router.replace({
        pathname: "/learn/result",
        params: {
          mode,
          total: words.length,
          correct: nextStats.correct,
          wrong: nextStats.wrong,
          saved: nextStats.saved,
        },
      });
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  const handleCorrect = async () => {
    try {
      setActionType("correct");

      const userWordId = await WordService.getOrCreateUserWord(
        user.id,
        currentWord.id,
        user.level,
      );

      await WordService.markCorrect(userWordId);
      const nextStats = {
        ...sessionStats,
        correct: sessionStats.correct + 1,
      };
      setSessionStats(nextStats);
      goNext(nextStats);
    } catch (e) {
      console.log("CORRECT ERROR:", e);

      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Kelime işaretlenirken hata oluştu.",
        visibilityTime: 2500,
      });

      setActionType(null);
    }
  };

  const handleWrong = async () => {
    try {
      setActionType("wrong");

      const userWordId = await WordService.getOrCreateUserWord(
        user.id,
        currentWord.id,
        user.level,
      );

      await WordService.markWrong(userWordId);
      const nextStats = {
        ...sessionStats,
        wrong: sessionStats.wrong + 1,
      };
      setSessionStats(nextStats);
      goNext(nextStats);
    } catch (e) {
      console.log("WRONG ERROR:", e);

      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Kelime işaretlenirken hata oluştu.",
        visibilityTime: 2500,
      });

      setActionType(null);
    }
  };

  const handleSave = async () => {
    if (actionType) return;

    try {
      setActionType("save");

      const userWordId = await WordService.getOrCreateUserWord(
        user.id,
        currentWord.id,
        user.level,
      );

      await WordService.toggleSaved(userWordId, true);

      setSaved(true);
      setSessionStats((prev) => ({
        ...prev,
        saved: prev.saved + 1,
      }));

      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Kelime başarıyla kaydedildi.",
        visibilityTime: 2000,
      });
    } catch (e) {
      console.log("SAVE ERROR:", e);

      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Kelime kaydedilemedi.",
        visibilityTime: 2500,
      });
    } finally {
      setActionType(null);
    }
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
  const progress = words.length ? ((index + 1) / words.length) * 100 : 0;

  return (
    <View style={{ flex: 1 }}>
      <PageHeader title="Öğren" showBack={false} />
      <View style={styles.container}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            {index + 1} / {words.length}
          </Text>
          <Text style={styles.progressMeta}>
            D: {sessionStats.correct}  Y: {sessionStats.wrong}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

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
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#101828",
  },
  progressMeta: {
    fontSize: 13,
    fontWeight: "600",
    color: "#667085",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 8,
  },
});
