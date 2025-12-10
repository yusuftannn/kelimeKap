import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useAuthStore } from "../store/useAuthStore";
import { auth } from "./firebase";
import { UserService } from "./user.service";

export const AuthService = {
  async login(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);

    const user = {
      id: result.user.uid,
      email: result.user.email,
    };

    const { setUser } = useAuthStore.getState();
    setUser(user);

    return user;
  },

  async register(email, password) {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    const uid = result.user.uid;

    await UserService.createUser(uid, email);

    return {
      id: result.user.uid,
      email: result.user.email,
    };
  },

  async logout() {
    await signOut(auth);
    const { logout } = useAuthStore.getState();
    logout();
  },
};
