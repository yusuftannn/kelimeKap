import { router } from "expo-router";
import { useState } from "react";
import { WordService } from "../services/words.service";
import { useWordStore } from "../store/useWordStore";

export default function useWords() {
  const { level, words, currentIndex, nextWord, resetWords } = useWordStore();
  const [loading, setLoading] = useState(false);

  const loadWords = async () => {
    if (!level) return;
    setLoading(true);

    try {
      await WordService.getWordsByLevel(level);
    } catch (error) {
      console.log("Kelime yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => {
    nextWord();

    if (currentIndex + 1 >= words.length) {
      router.push("/learn/result");
    }
  };

  const restartLevel = () => {
    resetWords();
    router.push("/learn/word-card");
  };

  return {
    loadWords,
    goNext,
    restartLevel,
    words,
    currentIndex,
    loading,
  };
}
