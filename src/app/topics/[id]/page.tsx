"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ExternalLink,
  Video,
  FileText,
  CheckCircle2,
  Circle,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { Topic, Subtopic } from "@/types";

export default function TopicDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTopic() {
      try {
        const res = await fetch(`/api/topics/${id}`);
        const data = await res.json();
        if (res.ok) setTopic(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopic();
  }, [id]);

  const toggleStatus = async (subtopicId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtopicId, status: !currentStatus }),
      });
      if (res.ok) {
        setTopic((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            subtopics: prev.subtopics?.map((st) =>
              st.id === subtopicId ? { ...st, completed: !currentStatus } : st,
            ),
          };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-slate-400">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Loading Topic...</p>
      </div>
    );

  if (!topic)
    return (
      <div className="p-12 text-center text-slate-400">Topic not found</div>
    );

  const subtopics = topic.subtopics || [];
  const completedCount = subtopics.filter((st) => st.completed).length;
  const totalCount = subtopics.length;
  const progressPercent = Math.round(
    (completedCount / (totalCount || 1)) * 100,
  );

  return (
    <div className="max-w-5xl mx-auto p-8 md:p-16">
      <header className="mb-12">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
          Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{topic.name}</h1>
            <p className="text-slate-400">{totalCount} problems total</p>
          </div>
          <div className="glass-card p-6 w-full md:w-56">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-2xl font-black text-primary">
                {progressPercent}%
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Complete
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </div>
      </header>

      {progressPercent === 100 && totalCount > 0 && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-6 mb-8 flex items-center gap-6 border-primary bg-primary/10">
          <Trophy className="text-primary w-10 h-10 shrink-0" />
          <div>
            <h3 className="text-lg font-bold">Topic Mastered!</h3>
            <p className="text-slate-400">
              You've completed all problems in {topic.name}. Excellent work!
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col gap-4">
        {subtopics.map((st, index) => (
          <motion.div
            key={st.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`glass-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-all hover:border-primary/50 group ${st.completed ? "bg-easy/[0.02] border-easy/20" : ""}`}>
            <div className="flex items-center gap-6">
              <button
                onClick={() => toggleStatus(st.id, st.completed || false)}
                className={`transition-all hover:scale-110 ${st.completed ? "text-easy" : "text-slate-600 hover:text-slate-400"}`}>
                {st.completed ? (
                  <CheckCircle2 size={28} />
                ) : (
                  <Circle size={28} />
                )}
              </button>
              <div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  {st.name}
                </h3>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      st.level === "EASY"
                        ? "text-easy border-easy/20 bg-easy/5"
                        : st.level === "MEDIUM"
                          ? "text-medium border-medium/20 bg-medium/5"
                          : "text-hard border-hard/20 bg-hard/5"
                    }`}>
                    {st.level}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {st.completed ? "Completed" : "In Progress"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {st.leetcodeLink && (
                <a
                  href={st.leetcodeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-[#FFA116] hover:bg-white/10 transition-all"
                  title="Practice on LeetCode">
                  <ExternalLink size={20} />
                </a>
              )}
              {st.youtubeLink && (
                <a
                  href={st.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-[#FF0000] hover:bg-white/10 transition-all"
                  title="Watch Tutorial">
                  <Video size={20} />
                </a>
              )}
              {st.articleLink && (
                <a
                  href={st.articleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-secondary hover:bg-white/10 transition-all"
                  title="Read Article">
                  <FileText size={20} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
