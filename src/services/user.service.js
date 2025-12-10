import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const UserService = {
  async createUser(uid, email) {
    await setDoc(doc(db, "users", uid), {
      userId: uid,
      email: email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      level: null,
      username: null,
      name: null,
      savedWords: [],
    });
  },

  async updateLastLogin(uid) {
    await setDoc(doc(db, "users", uid), {
      lastLogin: serverTimestamp(),
    }, { merge: true });
  }
};
