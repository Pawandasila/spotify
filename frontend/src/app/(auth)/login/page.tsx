"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { AuthLayout, AuthForm, SocialLogin } from "@/components/custom/auth";

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { loginUser, btnLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (formData: AuthFormData) => {
    setError(null);
    setSuccess(null);

    try {
      const result = await loginUser(
        formData.email,
        formData.password,
        (path: string) => router.push(path)
      );
      
      if (result.success) {
        setSuccess(result.message || "Login successful! Redirecting...");
      } else {
        setError(result.message || "Login failed");
      }
      
    } catch {
      setError("An unexpected error occurred");
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'twitter') => {
    setError(null);
    
    try {
      // TODO: Implement social login
      setError(`${provider} login not implemented yet`);
    } catch {
      setError("Social login failed");
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your SoundWave account"
    >
      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-primary text-sm">{success}</p>
        </div>
      )}

      <AuthForm 
        mode="login"
        onSubmit={handleLogin}
        isLoading={btnLoading}
      />

      <SocialLogin 
        onGoogleLogin={() => handleSocialLogin('google')}
        onTwitterLogin={() => handleSocialLogin('twitter')}
        isLoading={btnLoading}
      />

      {/* Sign up link */}
      <div className="text-center mt-8">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
