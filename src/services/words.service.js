import { useWordStore } from "../store/useWordStore";
import api from "./api";

export const WordService = {
  async getWordsByLevel(level) {
    const res = await api.get(`/words/${level}`);

    const { setWords } = useWordStore.getState();
    setWords(res.data.words);

    return res.data.words;
  },

  async saveWordToProfile(word) {
    const res = await api.post(`/words/save`, { word });

    const { saveWord } = useWordStore.getState();
    saveWord(word);

    return res.data;
  },
};
