"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";

import { auth } from "@/lib/dashboard/firebase";

interface DashboardAuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<User>;
  logout: () => Promise<void>;
}

const DashboardAuthContext =
  createContext<DashboardAuthContextType | null>(null);

interface DashboardAuthProviderProps {
  children: ReactNode;
}

export function DashboardAuthProvider({
  children,
}: DashboardAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Firebase auth state error:",
          error
        );

        setUser(null);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  async function login(
    email: string,
    password: string
  ): Promise<User> {
    try {
      const result =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      return result.user;
    } catch (error: any) {
      switch (error?.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          throw new Error(
            "Adresse e-mail ou mot de passe incorrect."
          );

        case "auth/invalid-email":
          throw new Error(
            "Adresse e-mail invalide."
          );

        case "auth/user-disabled":
          throw new Error(
            "Ce compte a été désactivé."
          );

        case "auth/too-many-requests":
          throw new Error(
            "Trop de tentatives. Veuillez réessayer plus tard."
          );

        case "auth/network-request-failed":
          throw new Error(
            "Impossible de se connecter à Internet."
          );

        default:
          throw new Error(
            "Impossible de se connecter. Veuillez vérifier vos identifiants."
          );
      }
    }
  }

  async function logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      throw error;
    }
  }

  return (
    <DashboardAuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </DashboardAuthContext.Provider>
  );
}

export function useDashboardAuth(): DashboardAuthContextType {
  const ctx = useContext(
    DashboardAuthContext
  );

  if (!ctx) {
    throw new Error(
      "useDashboardAuth must be used inside <DashboardAuthProvider>"
    );
  }

  return ctx;
}