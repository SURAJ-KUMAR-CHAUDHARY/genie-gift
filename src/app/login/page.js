"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        
        if (res?.error) {
          setError(res.error);
        } else {
          router.push("/dashboard");
        }
      } else {
        // Signup
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name })
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Signup failed");
        }
        
        // Auto login after signup
        await signIn("credentials", { redirect: false, email, password });
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 min-h-[80vh] flex flex-col justify-center">
      <Link href="/" className="inline-flex items-center text-on-surface-variant hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back Home
      </Link>
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
          <Sparkles className="w-8 h-8 text-on-primary-container" />
        </div>
        <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-on-surface-variant mt-2">
          {isLogin ? "Log in to view your saved people and orders." : "Join GiftGenie to access smarter gifting."}
        </p>
      </div>

      <div className="glass-card p-8 rounded-2xl editorial-shadow border border-white/50">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-error bg-error-container p-3 rounded-lg text-sm font-medium">{error}</div>}
          
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 py-4 bg-primary text-white rounded-xl font-bold font-headline shadow-md hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin"/>}
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-medium text-on-surface-variant">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
