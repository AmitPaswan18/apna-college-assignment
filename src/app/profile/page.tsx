"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { Topic, UserStats } from "@/types";

interface UserData {
  email: string;
  name?: string;
  stats: UserStats;
  totalStats: UserStats;
  periodicStats: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (res.ok) {
          setUserData(data.user);
          setTopics(data.topics);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="p-6 md:p-12 max-w-7xl mx-auto w-full">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
                Welcome back,{" "}
                <span className="text-primary italic">
                  {userData?.name || userData?.email.split("@")[0]}!
                </span>
              </h1>
              <p className="text-slate-400 text-lg">
                You're doing great. Keep the momentum going!
              </p>
            </div>
            <Link
              href="/topics"
              className="btn-primary flex items-center justify-center gap-2 group">
              Start Solving{" "}
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </header>

        {/* Periodic Activity Stats */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-300 uppercase tracking-widest text-[12px]">
            <BarChart3 size={16} className="text-primary" /> Recent Activity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                label: "Last 24 Hours",
                value: userData?.periodicStats.today || 0,
                icon: "🔥",
              },
              {
                label: "Last 7 Days",
                value: userData?.periodicStats.thisWeek || 0,
                icon: "⚡",
              },
              {
                label: "Last 30 Days",
                value: userData?.periodicStats.thisMonth || 0,
                icon: "🎯",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 border-white/5 bg-white/[0.02]">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {stat.label}
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  Problems Solved
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Progress by Difficulty */}
        <section id="progress" className="mb-12 scroll-mt-24">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-300 uppercase tracking-widest text-[12px]">
            <LayoutDashboard size={16} className="text-primary" /> Mastery
            Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["easy", "medium", "hard"] as const).map((level) => {
              const count = userData?.stats?.[level] || 0;
              const total = userData?.totalStats?.[level] || 1;
              const percent = Math.round((count / total) * 100);
              const colorClass =
                level === "easy"
                  ? "text-easy"
                  : level === "medium"
                    ? "text-medium"
                    : "text-hard";
              const bgClass =
                level === "easy"
                  ? "bg-easy/10"
                  : level === "medium"
                    ? "bg-medium/10"
                    : "bg-hard/10";
              const barClass =
                level === "easy"
                  ? "bg-easy"
                  : level === "medium"
                    ? "bg-medium"
                    : "bg-hard";

              return (
                <div
                  key={level}
                  className="glass-card p-8 flex flex-col gap-6 relative overflow-hidden group hover:border-white/20 transition-all">
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 blur-[80px] -mr-12 -mt-12 opacity-20 ${barClass}`}
                  />
                  <div className="flex justify-between items-center relative z-10">
                    <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
                      <CheckCircle2 size={24} />
                    </div>
                    <span className={`text-2xl font-black ${colorClass}`}>
                      {percent}%
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="capitalize text-lg font-bold mb-1">
                      {level}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      {count} of {total} Problems Mastered
                    </p>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        className={`h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${barClass}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Topics Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-300 uppercase tracking-widest text-[12px]">
              <BookOpen size={16} className="text-primary" /> Learning Tracks
            </h2>
            <Link
              href="/topics"
              className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              Explore All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.slice(0, 10).map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <LayoutDashboard size={64} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">
                    {topic.subtopicsCount} Problems
                  </p>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Progress
                    </span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                      {Math.round(
                        ((topic.completedCount || 0) /
                          (topic.subtopicsCount || 1)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((topic.completedCount || 0) / (topic.subtopicsCount || 1)) * 100}%`,
                      }}
                      className="h-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-500"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
