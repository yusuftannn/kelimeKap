import { useAuthStore } from "../store/useAuthStore";
import api from "./api";

export const AuthService = {
  async login(email, password) {
    const res = await api.post("/auth/login", { email, password });

    const user = res.data.user;
    const token = res.data.token;

    const { setUser, setToken } = useAuthStore.getState();

    setUser(user);
    setToken(token);

    return user;
  },

  async register(email, password) {
    const res = await api.post("/auth/register", { email, password });
    return res.data;
  },

  async logout() {
    const { logout } = useAuthStore.getState();
    logout();
  },
};
