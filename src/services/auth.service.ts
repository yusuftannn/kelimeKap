import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";

export interface AuthResult {
  id: string;
  email: string | null;
}

export const AuthService = {
  async login(email: string, password: string): Promise<AuthResult> {
    const result: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return {
      id: result.user.uid,
      email: result.user.email,
    };
  },

  async register(email: string, password: string): Promise<AuthResult> {
    const result: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return {
      id: result.user.uid,
      email: result.user.email,
    };
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },
};
