import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

export const LevelService = {
  async getLevels() {
    const q = query(collection(db, "levels"), orderBy("order", "asc"));

    const snap = await getDocs(q);

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};
