import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export const WordService = {
  async getWordsByLevel(level) {
    const q = query(collection(db, "words"), where("level", "==", level));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async getOrCreateUserWord(userId, wordId) {
    const q = query(
      collection(db, "userWords"),
      where("userId", "==", userId),
      where("wordId", "==", wordId)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      return snap.docs[0].id;
    }

    const ref = await addDoc(collection(db, "userWords"), {
      userId,
      wordId,
      correctCount: 0,
      wrongCount: 0,
      saved: false,
      status: "new",
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  },

  async markCorrect(userWordId) {
    await updateDoc(doc(db, "userWords", userWordId), {
      correctCount: increment(1),
      status: "known",
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async markWrong(userWordId) {
    await updateDoc(doc(db, "userWords", userWordId), {
      wrongCount: increment(1),
      status: "learning",
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async toggleSaved(userWordId, saved) {
    await updateDoc(doc(db, "userWords", userWordId), {
      saved,
      status: saved ? "saved" : "learning",
      updatedAt: serverTimestamp(),
    });
  },

  async getSavedWords(userId) {
    const q = query(
      collection(db, "userWords"),
      where("userId", "==", userId),
      where("saved", "==", true)
    );

    const snap = await getDocs(q);

    if (snap.empty) return [];

    const wordIds = snap.docs.map((d) => d.data().wordId);

    const wordsSnap = await getDocs(
      query(collection(db, "words"), where("__name__", "in", wordIds))
    );

    return wordsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
  async removeSavedWord(userId, wordId) {
    const q = query(
      collection(db, "userWords"),
      where("userId", "==", userId),
      where("wordId", "==", wordId)
    );

    const snap = await getDocs(q);

    if (snap.empty) return;

    const docId = snap.docs[0].id;

    await updateDoc(doc(db, "userWords", docId), {
      saved: false,
      status: "learning",
      updatedAt: serverTimestamp(),
    });
  },
  async getSavedWordsForStudy(userId) {
    const q = query(
      collection(db, "userWords"),
      where("userId", "==", userId),
      where("saved", "==", true)
    );

    const snap = await getDocs(q);
    if (snap.empty) return [];

    const wordIds = snap.docs.map((d) => d.data().wordId);

    const wordsSnap = await getDocs(
      query(collection(db, "words"), where("__name__", "in", wordIds))
    );

    return wordsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
  async getUserStats(userId) {
    const q = query(collection(db, "userWords"), where("userId", "==", userId));

    const snap = await getDocs(q);

    let stats = {
      total: 0,
      known: 0,
      learning: 0,
      new: 0,
      saved: 0,
      correct: 0,
      wrong: 0,
    };

    snap.docs.forEach((doc) => {
      const d = doc.data();

      stats.total += 1;
      stats.correct += d.correctCount || 0;
      stats.wrong += d.wrongCount || 0;

      if (d.saved) stats.saved += 1;

      switch (d.status) {
        case "known":
          stats.known += 1;
          break;
        case "learning":
          stats.learning += 1;
          break;
        case "new":
        default:
          stats.new += 1;
      }
    });

    return stats;
  },
};
