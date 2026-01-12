"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Usuario } from "./types";
import { login as apiLogin, register as apiRegister, getMe } from "./api";

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<Usuario | null>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      getMe(storedToken)
        .then((user) => setUsuario(user))
        .catch(() => {
          setUsuario(null);
          setToken(null);
          localStorage.removeItem("access_token");
        })
        .finally(() => setIsLoaded(true));
    } else {
      setIsLoaded(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<Usuario | null> => {
    try {
      const res = await apiLogin({ email, password });
      if (res && res.access_token) {
        setToken(res.access_token);
        localStorage.setItem("access_token", res.access_token);
        const user = await getMe(res.access_token);
        setUsuario(user);
        return user;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      await apiRegister(data);
      return true;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("access_token");
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
