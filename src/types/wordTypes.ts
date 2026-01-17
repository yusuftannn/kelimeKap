import { FirestoreTimestamp } from "./firestoreTypes";

export interface Word {
  id: string;
  word: string;
  meaning: string;
  level: string;
  example_en?: string;
  example_tr?: string;
}

export type WordStatus = "new" | "learning" | "known" | "saved";

export interface UserWord {
  userId: string;
  wordId: string;

  correctCount: number;
  wrongCount: number;

  saved: boolean;
  status: WordStatus;

  lastSeenAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
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
