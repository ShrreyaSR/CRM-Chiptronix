import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { crmApi } from "../api";
import { toast } from "sonner";

export type UserRole = "super-admin" | "admin" | "technician" | "sales" | "dealer";

export interface AuthUser {
  id: number;
  role: UserRole;
  name?: string;
  email?: string;
  phone?: string;
  username?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (emailOrPhone: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Logout function - defined first so it can be used in useEffect
  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      // Clear state
      setToken(null);
      setUser(null);

      // Navigate to login - use window.location for a hard redirect to ensure state is cleared
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear storage and force reload
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);

        // Verify token is still valid
        crmApi.auth
          .verify()
          .then(() => {
            setIsLoading(false);
          })
          .catch(() => {
            // Token invalid, clear storage
            logout();
          });
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        logout();
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (emailOrPhone: string, password: string, role: UserRole) => {
    try {
      const response = await crmApi.auth.login({
        emailOrPhone,
        password,
        role,
      });

      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data;

        // Store in localStorage
        localStorage.setItem("auth_token", newToken);
        localStorage.setItem("auth_user", JSON.stringify(userData));

        // Update state
        setToken(newToken);
        setUser(userData);

        // Navigate to appropriate dashboard
        window.location.href = `/${role === "super-admin" ? "super-admin" : role}`;
      } else {
        throw new Error(response.error?.message || "Login failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
