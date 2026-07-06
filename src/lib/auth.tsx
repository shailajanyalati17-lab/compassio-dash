import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = { name: string; email: string; company?: string };

type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, _password: string) => Promise<void>;
  register: (name: string, email: string, _password: string) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "bizpilot.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) window.localStorage.setItem(KEY, JSON.stringify(u));
      else window.localStorage.removeItem(KEY);
    }
  };

  const value: AuthCtx = {
    user,
    isAuthenticated: !!user,
    login: async (email) => {
      await new Promise((r) => setTimeout(r, 500));
      const name = email.split("@")[0].replace(/[^a-zA-Z]/g, " ") || "Founder";
      persist({ name: name.charAt(0).toUpperCase() + name.slice(1), email, company: "BizPilot Inc." });
    },
    register: async (name, email) => {
      await new Promise((r) => setTimeout(r, 600));
      persist({ name, email, company: "BizPilot Inc." });
    },
    logout: () => persist(null),
    updateUser: (patch) => persist(user ? { ...user, ...patch } : null),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
