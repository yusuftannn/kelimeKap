import {
  collection,
  DocumentData,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { Level } from "../types";
import { db } from "./firebase";

export const LevelService = {
  async getLevels(): Promise<Level[]> {
    const q = query(collection(db, "levels"), orderBy("order", "asc"));

    const snap = await getDocs(q);

    return snap.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>): Level => ({
        id: doc.id,
        ...(doc.data() as Omit<Level, "id">),
      })
    );
  },
};
