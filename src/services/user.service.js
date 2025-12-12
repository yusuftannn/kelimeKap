import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
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
    await setDoc(
      doc(db, "users", uid),
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );
  },

  async getUser(uid) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data();
    }

    return null;
  },

  async updateLevel(uid, level) {
    await updateDoc(doc(db, "users", uid), {
      level: level,
    });
  },

  async updateUsername(uid, username) {
    await updateDoc(doc(db, "users", uid), {
      username: username,
    });
  }
};
