"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Loader2, ArrowRight, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase');

    if (!isConfigured) {
      setError('Please configure your Supabase URL and Key in the .env file.');
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });
        if (error) throw error;
        setError("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/profile");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-12 text-center">
        <div className="mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/40 text-white">
            {isSignUp ? <UserPlus size={24} /> : <Lock size={24} />}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-slate-400">
            {isSignUp
              ? "Join us to start your DSA journey"
              : "Login to track your DSA progress"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-6 text-left">
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-12"
              required
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-12"
              required
            />
          </div>

          {error && (
            <p
              className={`text-sm text-center ${error.includes("Check your email") ? "text-easy" : "text-accent"}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary w-full h-14 flex items-center justify-center gap-2"
            disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {isSignUp ? "Sign Up" : "Login"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-slate-400 text-sm">
          <p>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-bold hover:underline">
              {isSignUp ? "Login" : "Sign up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
