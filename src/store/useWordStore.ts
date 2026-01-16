import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Word } from "../services/words.service";

interface WordState {
  level: string | null;
  words: Word[];
  savedWords: Word[];
  currentIndex: number;

  setLevel: (level: string | null) => void;
  setWords: (words: Word[]) => void;
  nextWord: () => void;
  resetWords: () => void;
  saveWord: (word: Word) => void;
}

export const useWordStore = create<WordState>()(
  persist(
    (set, get) => ({
      level: null,
      words: [],
      savedWords: [],
      currentIndex: 0,

      setLevel: (level) => set({ level }),

      setWords: (words) =>
        set({
          words,
          currentIndex: 0,
        }),

      nextWord: () => {
        const { currentIndex, words } = get();
        if (currentIndex < words.length - 1) {
          set({ currentIndex: currentIndex + 1 });
        }
      },

      resetWords: () => set({ currentIndex: 0 }),

      saveWord: (word) =>
        set((state) => {
          if (state.savedWords.some((w) => w.id === word.id)) {
            return state;
          }
          return {
            savedWords: [...state.savedWords, word],
          };
        }),
    }),
    {
      name: "word-storage",
    }
  )
);
