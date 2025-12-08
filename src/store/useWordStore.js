import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWordStore = create(
  persist(
    (set, get) => ({
      level: null,
      words: [],
      savedWords: [],
      currentIndex: 0,

      setLevel: (lvl) => set({ level: lvl }),

      setWords: (list) => set({ words: list, currentIndex: 0 }),

      nextWord: () => {
        const { currentIndex, words } = get();
        if (currentIndex < words.length - 1) {
          set({ currentIndex: currentIndex + 1 });
        }
      },

      resetWords: () => set({ currentIndex: 0 }),

      saveWord: (word) =>
        set((state) => {
          if (state.savedWords.some((w) => w.en === word.en)) return state;
          return { savedWords: [...state.savedWords, word] };
        }),
    }),
    {
      name: "word-storage",
    }
  )
);
