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
  // Level'a göre kelimeleri getir
  async getWordsByLevel(level) {
    const q = query(
      collection(db, "words"),
      where("level", "==", level)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // userWords var mı kontrol et, yoksa oluştur
  async getOrCreateUserWord(userId, wordId) {
    const q = query(
      collection(db, "userWords"),
      where("userId", "==", userId),
      where("wordId", "==", wordId)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      // varsa mevcut doc id
      return snap.docs[0].id;
    }

    // yoksa oluştur
    const ref = await addDoc(collection(db, "userWords"), {
      userId,
      wordId,
      correctCount: 0,
      wrongCount: 0,
      saved: false,
      status: "",
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  },

  // Biliyorum
  async markCorrect(userWordId) {
    await updateDoc(doc(db, "userWords", userWordId), {
      correctCount: increment(1),
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  // Bilmiyorum
  async markWrong(userWordId) {
    await updateDoc(doc(db, "userWords", userWordId), {
      wrongCount: increment(1),
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  // Kaydet
  async toggleSaved(userWordId, saved) {
    await updateDoc(doc(db, "userWords", userWordId), {
      saved,
      updatedAt: serverTimestamp(),
    });
  },
};
