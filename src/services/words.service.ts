import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  increment,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

/* =======================
   MODELLER & TİPLER
======================= */

export type WordStatus = "new" | "learning" | "known" | "saved";

export interface Word {
  id: string;
  word: string;
  meaning: string;
  level: string;
  example_en?: string;
  example_tr?: string;
}

export interface UserWord {
  userId: string;
  wordId: string;
  correctCount: number;
  wrongCount: number;
  saved: boolean;
  status: WordStatus;
  lastSeenAt: unknown;
  updatedAt: unknown;
}

export interface UserStats {
  total: number;
  known: number;
  learning: number;
  new: number;
  saved: number;
  correct: number;
  wrong: number;
}

/* =======================
   SERVICE
======================= */

export const WordService = {
  async getWordsByLevel(level: string): Promise<Word[]> {
    const q = query(collection(db, "words"), where("level", "==", level));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>): Word => ({
        id: doc.id,
        ...(doc.data() as Omit<Word, "id">),
      })
    );
  },

  async getOrCreateUserWord(
    userId: string,
    wordId: string
  ): Promise<string> {
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
      status: "new" as WordStatus,
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } satisfies UserWord);

    return ref.id;
  },

  async markCorrect(userWordId: string): Promise<void> {
    await updateDoc(doc(db, "userWords", userWordId), {
      correctCount: increment(1),
      status: "known" as WordStatus,
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async markWrong(userWordId: string): Promise<void> {
    await updateDoc(doc(db, "userWords", userWordId), {
      wrongCount: increment(1),
      status: "learning" as WordStatus,
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async toggleSaved(
    userWordId: string,
    saved: boolean
  ): Promise<void> {
    await updateDoc(doc(db, "userWords", userWordId), {
      saved,
      status: saved ? "saved" : "learning",
      updatedAt: serverTimestamp(),
    });
  },

  async getSavedWords(userId: string): Promise<Word[]> {
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

    return wordsSnap.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>): Word => ({
        id: doc.id,
        ...(doc.data() as Omit<Word, "id">),
      })
    );
  },

  async removeSavedWord(
    userId: string,
    wordId: string
  ): Promise<void> {
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
      status: "learning" as WordStatus,
      updatedAt: serverTimestamp(),
    });
  },

  async getSavedWordsForStudy(userId: string): Promise<Word[]> {
    return this.getSavedWords(userId);
  },

  async getUserStats(userId: string): Promise<UserStats> {
    const q = query(
      collection(db, "userWords"),
      where("userId", "==", userId)
    );

    const snap = await getDocs(q);

    const stats: UserStats = {
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

      switch (d.status as WordStatus) {
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
