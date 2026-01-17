import { FirestoreTimestamp } from "./firestoreTypes";

export type UserRole = "user" | "admin";

export interface AppUser {
  userId: string;
  email: string;

  createdAt: FirestoreTimestamp;
  lastLogin: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;

  level: string | null;
  role: UserRole;

  username: string | null;
  name: string | null;
}

export type UpdateUserProfile = Partial<
  Pick<AppUser, "level" | "username" | "name" | "role">
>;
