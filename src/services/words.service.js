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
};
