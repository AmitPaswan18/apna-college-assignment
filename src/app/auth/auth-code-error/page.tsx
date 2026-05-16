"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AuthCodeError() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-12 text-center border-red-500/20">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
          <AlertCircle size={40} />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The authentication link was invalid or has expired. This can happen if the link was already used or if it has been too long since it was sent.
        </p>
        
        <Link 
          href="/login" 
          className="btn-primary w-full h-14 flex items-center justify-center gap-2">
          <ArrowLeft size={18} />
          Back to Login
        </Link>
        
        <p className="mt-6 text-xs text-slate-500">
          If the problem persists, try signing up again or contact support.
        </p>
      </motion.div>
    </div>
  );
}
