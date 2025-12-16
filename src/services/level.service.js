import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

export const LevelService = {
  async getLevels() {
    const q = query(
      collection(db, "levels"),
      orderBy("order", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};
