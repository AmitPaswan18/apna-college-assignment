"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Search,
  ExternalLink,
  FileText,
  Plus,
  X,
  Video,
  Filter,
  BarChart,
  Trash2,
} from "lucide-react";
import { Topic, Subtopic } from "@/types";

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isAddingSubtopic, setIsAddingSubtopic] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [subtopicForm, setSubtopicForm] = useState({
    name: "",
    leetcodeLink: "",
    youtubeLink: "",
    articleLink: "",
    level: "EASY" as "EASY" | "MEDIUM" | "HARD",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTopics() {
      try {
        setLoading(true);
        const res = await fetch("/api/user/profile");
        if (!res.ok) {
          throw new Error("Failed to fetch topics");
        }
        const data = await res.json();
        setTopics(data.topics);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong while fetching topics.");
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

  const toggleTopic = (id: string) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  const toggleSubtopic = async (
    topicId: string,
    subtopicId: string,
    currentStatus: boolean,
  ) => {
    try {
      const res = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtopicId, status: !currentStatus }),
      });
      if (res.ok) {
        setTopics((prev) =>
          prev.map((t) => {
            if (t.id === topicId) {
              const updatedSubtopics = t.subtopics?.map((st) =>
                st.id === subtopicId
                  ? { ...st, completed: !currentStatus }
                  : st,
              );
              const completedCount =
                updatedSubtopics?.filter((st) => st.completed).length || 0;
              return { ...t, subtopics: updatedSubtopics, completedCount };
            }
            return t;
          }),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSubtopic = async (topicId: string, subtopicId: string) => {
    if (!confirm("Are you sure you want to delete this subtopic?")) return;

    try {
      const res = await fetch(`/api/subtopics/${subtopicId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTopics((prev) =>
          prev.map((t) => {
            if (t.id === topicId) {
              const updatedSubtopics = t.subtopics?.filter(
                (st) => st.id !== subtopicId,
              );
              const completedCount =
                updatedSubtopics?.filter((st) => st.completed).length || 0;
              const subtopicsCount = updatedSubtopics?.length || 0;
              return {
                ...t,
                subtopics: updatedSubtopics,
                completedCount,
                subtopicsCount,
              };
            }
            return t;
          }),
        );
      } else {
        alert("Failed to delete subtopic");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleAddSubtopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddingSubtopic) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/topics/${isAddingSubtopic}/subtopics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subtopicForm),
      });

      if (res.ok) {
        const newSt = await res.json();
        setTopics((prev) =>
          prev.map((t) => {
            if (t.id === isAddingSubtopic) {
              return {
                ...t,
                subtopics: [
                  ...(t.subtopics || []),
                  { ...newSt, completed: false },
                ],
                subtopicsCount: (t.subtopicsCount || 0) + 1,
              };
            }
            return t;
          }),
        );
        setIsAddingSubtopic(null);
        setSubtopicForm({
          name: "",
          leetcodeLink: "",
          youtubeLink: "",
          articleLink: "",
          level: "EASY",
        });
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to add subtopic");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  const filteredTopics = topics.filter((t) => {
    const searchLower = search.toLowerCase();
    const topicMatch = t.name.toLowerCase().includes(searchLower);
    const subtopicMatch = t.subtopics?.some((st) => {
      const matchesSearch = st.name.toLowerCase().includes(searchLower);
      const matchesLevel = levelFilter === "ALL" || st.level === levelFilter;
      return (topicMatch && matchesLevel) || (matchesSearch && matchesLevel);
    });
    return topicMatch || subtopicMatch;
  });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-slate-400 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse font-medium">Loading topics...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-slate-400 gap-6">
        <div className="text-red-500/20 bg-red-500/10 p-6 rounded-full">
          <Search size={48} className="text-red-500" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Fetch Error</h2>
          <p className="max-w-md">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-semibold">
          Try Again
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-8 md:p-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Topics</h1>
        <p className="text-slate-400 mb-8">Explore these exciting topics!</p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12 bg-white/5 border-white/10"
            />
          </div>

          <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
            {["ALL", "EASY", "MEDIUM", "HARD"].map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  levelFilter === level
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}>
                {level}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {filteredTopics.length === 0 ? (
          <div className="glass-card py-20 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/5">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Search size={32} className="text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No results found
            </h3>
            <p className="text-slate-400 max-w-sm">
              We couldn't find any topics or subtopics matching "
              <span className="text-primary font-semibold">{search}</span>"
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-6 text-primary hover:underline font-semibold">
              Clear search
            </button>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedTopic === topic.id;
            const isDone =
              topic.completedCount === topic.subtopicsCount &&
              (topic.subtopicsCount || 0) > 0;

            return (
              <div
                key={topic.id}
                className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className={`w-full flex items-center justify-between p-6 transition-all ${
                    isExpanded
                      ? "bg-white/[0.02] text-white"
                      : "text-slate-300 hover:text-white"
                  }`}>
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-xl ${isExpanded ? "bg-primary text-white" : "bg-white/5 text-slate-400 group-hover:text-primary transition-colors"}`}>
                      <BarChart size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-lg tracking-tight">
                        {topic.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            isDone
                              ? "bg-easy/20 text-easy border border-easy/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          }`}>
                          {isDone ? "Completed" : "In Progress"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {topic.completedCount} / {topic.subtopicsCount} Solved
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-2 rounded-full transition-transform duration-300 ${isExpanded ? "rotate-180 bg-white/10" : "bg-white/5"}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-white/[0.01]">
                      <div className="p-8 overflow-x-auto border-t border-white/5">
                        <div className="flex justify-between items-center mb-8">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full" />
                            <h2 className="text-2xl font-bold text-white">
                              Sub Topics
                            </h2>
                          </div>
                          <button
                            onClick={() => setIsAddingSubtopic(topic.id)}
                            className="px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white text-sm font-bold flex items-center gap-2 transition-all active:scale-95">
                            <Plus size={18} /> Add New Subtopic
                          </button>
                        </div>
                        <table className="w-full text-left border-collapse min-w-[800px]">
                          <thead>
                            <tr className="border-b border-white/5 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                              <th className="pb-4 pt-2 px-4">Status</th>
                              <th className="pb-4 pt-2 px-4">Problem Name</th>
                              <th className="pb-4 pt-2 px-4 text-center">
                                Practice
                              </th>
                              <th className="pb-4 pt-2 px-4 text-center">
                                Video
                              </th>
                              <th className="pb-4 pt-2 px-4 text-center">
                                Article
                              </th>
                              <th className="pb-4 pt-2 px-4 text-center">
                                Difficulty
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {topic.subtopics
                              ?.filter((st) => {
                                const matchesSearch =
                                  st.name
                                    .toLowerCase()
                                    .includes(search.toLowerCase()) ||
                                  topic.name
                                    .toLowerCase()
                                    .includes(search.toLowerCase());
                                const matchesLevel =
                                  levelFilter === "ALL" ||
                                  st.level === levelFilter;
                                return matchesSearch && matchesLevel;
                              })
                              .map((st) => {
                                const leetcodeUrl =
                                  st.leetcodeLink &&
                                  st.leetcodeLink !== "https://leetcode.com"
                                    ? st.leetcodeLink
                                    : `https://leetcode.com/search/?q=${encodeURIComponent(st.name)}`;
                                const youtubeUrl =
                                  st.youtubeLink &&
                                  st.youtubeLink !== "https://youtube.com"
                                    ? st.youtubeLink
                                    : `https://www.youtube.com/results?search_query=${encodeURIComponent(st.name)}`;
                                const gfgUrl =
                                  st.articleLink &&
                                  st.articleLink !== "https://geeksforgeeks.org"
                                    ? st.articleLink
                                    : `https://www.geeksforgeeks.org/search/?gq=${encodeURIComponent(st.name)}`;

                                return (
                                  <tr
                                    key={st.id}
                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-4 px-4">
                                      <input
                                        type="checkbox"
                                        checked={st.completed}
                                        onChange={() =>
                                          toggleSubtopic(
                                            topic.id,
                                            st.id,
                                            st.completed || false,
                                          )
                                        }
                                        className="w-5 h-5 accent-primary cursor-pointer"
                                      />
                                    </td>
                                    <td className="py-4 px-4 font-medium text-slate-200">
                                      <div className="flex items-center justify-between">
                                        <span>{st.name}</span>
                                        <button
                                          onClick={() =>
                                            deleteSubtopic(topic.id, st.id)
                                          }
                                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-lg transition-all"
                                          title="Delete Subtopic">
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                      <a
                                        href={leetcodeUrl}
                                        target="_blank"
                                        className="text-primary hover:underline text-sm font-semibold flex items-center justify-center gap-1">
                                        Practise <ExternalLink size={14} />
                                      </a>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                      <a
                                        href={youtubeUrl}
                                        target="_blank"
                                        className="text-primary hover:underline text-sm font-semibold flex items-center justify-center gap-1">
                                        Watch <Video size={14} />
                                      </a>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                      <a
                                        href={gfgUrl}
                                        target="_blank"
                                        className="text-primary hover:underline text-sm font-semibold flex items-center justify-center gap-1">
                                        Read <FileText size={14} />
                                      </a>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                      <span
                                        className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest ${
                                          st.level === "EASY"
                                            ? "text-easy bg-easy/10 border border-easy/20"
                                            : st.level === "MEDIUM"
                                              ? "text-medium bg-medium/10 border border-medium/20"
                                              : "text-hard bg-hard/10 border border-hard/20"
                                        }`}>
                                        {st.level}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Add Subtopic Modal */}
      <AnimatePresence>
        {isAddingSubtopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingSubtopic(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card mt-10 w-full max-w-lg p-8 relative z-10 border-primary/30 max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setIsAddingSubtopic(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6">Add New Subtopic</h2>
              <form onSubmit={handleAddSubtopic} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={subtopicForm.name}
                    onChange={(e) =>
                      setSubtopicForm({ ...subtopicForm, name: e.target.value })
                    }
                    placeholder="e.g. Dijkstra's Algorithm"
                    className="input-field w-full bg-white/5 border-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">
                      Level
                    </label>
                    <select
                      value={subtopicForm.level}
                      onChange={(e) =>
                        setSubtopicForm({
                          ...subtopicForm,
                          level: e.target.value as any,
                        })
                      }
                      className="input-field w-full bg-[#1a1a1c] border-white/10 appearance-none cursor-pointer">
                      <option value="EASY" className="bg-[#1a1a1c] text-white">
                        EASY
                      </option>
                      <option
                        value="MEDIUM"
                        className="bg-[#1a1a1c] text-white">
                        MEDIUM
                      </option>
                      <option value="HARD" className="bg-[#1a1a1c] text-white">
                        HARD
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">
                      LeetCode Link
                    </label>
                    <input
                      type="url"
                      value={subtopicForm.leetcodeLink}
                      onChange={(e) =>
                        setSubtopicForm({
                          ...subtopicForm,
                          leetcodeLink: e.target.value,
                        })
                      }
                      placeholder="https://leetcode.com/..."
                      className="input-field w-full bg-white/5 border-white/10 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">
                    YouTube Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={subtopicForm.youtubeLink}
                    onChange={(e) =>
                      setSubtopicForm({
                        ...subtopicForm,
                        youtubeLink: e.target.value,
                      })
                    }
                    placeholder="https://youtube.com/..."
                    className="input-field w-full bg-white/5 border-white/10 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">
                    Article Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={subtopicForm.articleLink}
                    onChange={(e) =>
                      setSubtopicForm({
                        ...subtopicForm,
                        articleLink: e.target.value,
                      })
                    }
                    placeholder="https://geeksforgeeks.org/..."
                    className="input-field w-full bg-white/5 border-white/10 text-sm"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingSubtopic(null)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-primary py-3 px-6 font-bold flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Create Subtopic"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
