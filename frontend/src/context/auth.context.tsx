"use client";
import axios from "axios";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast, { Toaster } from "react-hot-toast";

const server = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export interface AuthTokens {
  access: string;
  refresh?: string;
}

export interface ApiError {
  response?: {
    data?: {
      detail?: string;
      message?: string;
    };
    status?: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuth: boolean;
  loading: boolean;
  btnLoading: boolean;
  loginUser: (
    email: string,
    password: string,
    navigate: (path: string) => void
  ) => Promise<{ success: boolean; message?: string; data?: User }>;
  registerUser: (
    name: string,
    email: string,
    password: string,
    navigate: (path: string) => void
  ) => Promise<{ success: boolean; message?: string; data?: User }>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // Load tokens and user data from localStorage on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem("auth_tokens");
    const storedUser = localStorage.getItem("auth_user");
    
    if (storedTokens && storedUser) {
      try {
        const parsedTokens = JSON.parse(storedTokens);
        const parsedUser = JSON.parse(storedUser);
        
        setTokens(parsedTokens);
        setUser(parsedUser);
        setIsAuth(true);
        setLoading(false);
      } catch {
        localStorage.removeItem("auth_tokens");
        localStorage.removeItem("auth_user");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  async function registerUser(
    name: string,
    email: string,
    password: string,
    navigate: (path: string) => void
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/users/register/`, {
        name,
        email,
        password,
        role: "user"
      });

      toast.success("Registration successful!");
      
      // Extract access token from registration response
      if (data.data && data.data.accessToken) {
        const authTokens: AuthTokens = {
          access: data.data.accessToken,
        };
        
        // Store tokens in localStorage
        localStorage.setItem("auth_tokens", JSON.stringify(authTokens));
        setTokens(authTokens);
        
        // Set user data from registration response
        if (data.data.user) {
          const userData: User = {
            id: data.data.user._id,
            name: data.data.user.name,
            email: data.data.user.email,
            role: data.data.user.role,
          };
          setUser(userData);
          // Store user data in localStorage
          localStorage.setItem("auth_user", JSON.stringify(userData));
        }
        
        setIsAuth(true);
        navigate("/dashboard");
      }
      
      setBtnLoading(false);
      return { 
        success: true, 
        message: data.message || "Registration successful!", 
        data: data
      };
      
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.detail || 
                          apiError.response?.data?.message || 
                          "Registration failed";
      toast.error(errorMessage);
      setBtnLoading(false);
      return { 
        success: false, 
        message: errorMessage,
        data: apiError.response?.data 
      };
    }
  }

  async function loginUser(
    email: string,
    password: string,
    navigate: (path: string) => void
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/users/login/`, {
        email,
        password,
      });

      toast.success("Login successful!");
      
      // Extract access token from login response (similar to registration)
      if (data.data && data.data.accessToken) {
        const authTokens: AuthTokens = {
          access: data.data.accessToken,
        };
        
        // Store tokens in localStorage
        localStorage.setItem("auth_tokens", JSON.stringify(authTokens));
        setTokens(authTokens);
        
        // Set user data from login response
        if (data.data.user) {
          const userData: User = {
            id: data.data.user._id,
            name: data.data.user.name,
            email: data.data.user.email,
            role: data.data.user.role,
          };
          setUser(userData);
          // Store user data in localStorage
          localStorage.setItem("auth_user", JSON.stringify(userData));
        }
        
        setIsAuth(true);
        navigate("/dashboard");
      }
      
      setBtnLoading(false);
      return { 
        success: true, 
        message: data.message || "Login successful!", 
        data: data 
      };
      
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.detail || 
                          apiError.response?.data?.message || 
                          "Login failed";
      toast.error(errorMessage);
      setBtnLoading(false);
      return { 
        success: false, 
        message: errorMessage,
        data: apiError.response?.data 
      };
    }
  }

  async function logoutUser() {
    localStorage.removeItem("auth_tokens");
    localStorage.removeItem("auth_user");
    setUser(null);
    setTokens(null);
    setIsAuth(false);
    toast.success("Logged out successfully");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        loading,
        isAuth,
        btnLoading,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Legacy exports for backward compatibility
export const GFContext = AuthContext;
export const GFProvider = AuthProvider;
export const useUserData = useAuth;
