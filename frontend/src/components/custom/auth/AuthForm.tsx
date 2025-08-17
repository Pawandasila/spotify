"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading?: boolean;
}

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ 
  mode, 
  onSubmit, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const isLogin = mode === "login";

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {!isLogin && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-foreground placeholder:text-muted-foreground"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required={!isLogin}
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground block">
          Email {!isLogin && "Address"}
        </label>
        <input
          type="email"
          placeholder={isLogin ? "Enter your email" : "Enter your email address"}
          className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-foreground placeholder:text-muted-foreground"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground block">
          Password
        </label>
        <input
          type="password"
          placeholder={isLogin ? "Enter your password" : "Create a password"}
          className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-foreground placeholder:text-muted-foreground"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          required
        />
      </div>

      {!isLogin && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-foreground placeholder:text-muted-foreground"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            required={!isLogin}
          />
        </div>
      )}

      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:scale-[1.02]"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary-foreground/30  border-t-primary-foreground rounded-full animate-spin"></div>
            <span >{isLogin ? "Signing In..." : "Creating Account..."}</span>
          </div>
        ) : (
          isLogin ? "Sign In" : "Create Account"
        )}
      </Button>

      {!isLogin && (
        <p className="text-xs text-muted-foreground text-center">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:text-primary/80">
            Privacy Policy
          </Link>
        </p>
      )}
    </form>
  );
};

export default AuthForm;
