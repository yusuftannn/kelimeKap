import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { AuthUser } from "../types";
import { auth } from "./firebase";
import { UserService } from "./user.service";

export const AuthService = {
  async login(email: string, password: string): Promise<AuthUser> {
    const result: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      id: result.user.uid,
      email: result.user.email,
    };
  },

  async register(email: string, password: string): Promise<AuthUser> {
    const result: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid: string = result.user.uid;

    await UserService.createUser(uid, email);

    return {
      id: uid,
      email: result.user.email,
    };
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },
};
