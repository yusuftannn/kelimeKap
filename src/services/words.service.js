import { collection, getDocs } from "firebase/firestore";
import { useWordStore } from "../store/useWordStore";
import { db } from "./firebase";

export const WordService = {
  async getWordsByLevel(level) {
    const ref = collection(db, "words", level, "items"); 
    const snap = await getDocs(ref);

    const words = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const { setWords } = useWordStore.getState();
    setWords(words);

    return words;
  },

  async saveWordToProfile(word) {
    const { saveWord } = useWordStore.getState();
    saveWord(word);
    return true;
  },
};
