import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";


export interface AppUser {
  userId: string;
  email: string;
  createdAt: unknown;
  lastLogin: unknown;
  updatedAt?: unknown;
  level: string | null;
  role: "user" | "admin";
  username: string | null;
  name: string | null;
}

export type UpdateUserProfile = Partial<
  Pick<AppUser, "level" | "username" | "name" | "role">
>;

export const UserService = {
  async createUser(uid: string, email: string): Promise<void> {
    await setDoc(doc(db, "users", uid), {
      userId: uid,
      email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      level: null,
      role: "user",
      username: null,
      name: null,
    } satisfies AppUser);
  },

  async updateLastLogin(uid: string): Promise<void> {
    await setDoc(
      doc(db, "users", uid),
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );
  },

  async getUser(uid: string): Promise<AppUser | null> {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return snap.data() as AppUser;
  },

  async updateProfile(
    uid: string,
    data: UpdateUserProfile
  ): Promise<void> {
    if (!uid || uid === "guest") return;

    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },
};
