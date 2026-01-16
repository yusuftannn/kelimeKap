import { router } from "expo-router";
import { useState } from "react";
import type { Word } from "../services/words.service";
import { WordService } from "../services/words.service";
import { useWordStore } from "../store/useWordStore";

interface UseWordsReturn {
  loadWords: () => Promise<void>;
  goNext: () => void;
  words: Word[];
  currentIndex: number;
  loading: boolean;
}

export default function useWords(): UseWordsReturn {
  const {
    level,
    words,
    currentIndex,
    nextWord,
    setWords,
    resetWords,
  } = useWordStore();

  const [loading, setLoading] = useState<boolean>(false);

  const loadWords = async (): Promise<void> => {
    if (!level) return;

    setLoading(true);
    try {
      resetWords();

      const data = await WordService.getWordsByLevel(level);
      setWords(data);
    } finally {
      setLoading(false);
    }
  };

  const goNext = (): void => {
    const isLast = currentIndex >= words.length - 1;

    if (isLast) {
      router.push("/learn/result");
      return;
    }

    nextWord();
  };

  return {
    loadWords,
    goNext,
    words,
    currentIndex,
    loading,
  };
}
