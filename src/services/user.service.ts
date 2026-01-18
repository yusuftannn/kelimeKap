import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { AppUser, UpdateUserProfile } from "../types";
import { db } from "./firebase";

export const UserService = {
  async createUser(
    uid: string,
    email: string,
    username: string,
  ): Promise<void> {
    await setDoc(doc(db, "users", uid), {
      userId: uid,
      email,
      username, // 🔹 artık zorunlu
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      level: null,
      role: "user",
      name: null,
    } satisfies AppUser);
  },

  async updateLastLogin(uid: string): Promise<void> {
    if (!uid || uid === "guest") return;

    await setDoc(
      doc(db, "users", uid),
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true },
    );
  },

  async getUser(uid: string): Promise<AppUser | null> {
    if (!uid || uid === "guest") return null;

    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return snap.data() as AppUser;
  },

  async getUserByUsername(username: string): Promise<AppUser | null> {
    const q = query(collection(db, "users"), where("username", "==", username));

    const snap = await getDocs(q);
    if (snap.empty) return null;

    return snap.docs[0].data() as AppUser;
  },

  async isUsernameTaken(username: string): Promise<boolean> {
    const q = query(collection(db, "users"), where("username", "==", username));

    const snap = await getDocs(q);
    return !snap.empty;
  },

  async updateProfile(uid: string, data: UpdateUserProfile): Promise<void> {
    if (!uid || uid === "guest") return;

    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },
};
