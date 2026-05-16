"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  LogOut,
  UserCircle,
  Menu,
  X,
  ChevronDown,
  Check,
  User as UserIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentHash, setCurrentHash] = useState("");

  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }

  useEffect(() => {
    // Initial hash
    setCurrentHash(window.location.hash);

    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        try {
          const res = await fetch("/api/user/profile");
          const profileData = await res.json();
          if (res.ok) {
            setUserName(profileData.user.name || "");
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    }
    fetchData();
  }, [supabase.auth]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIsUpdating(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName }),
      });
      if (res.ok) {
        setIsDropdownOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Don't show navbar on login page
  if (pathname === "/login" || pathname === "/") return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[999] bg-background/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/profile" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-black text-xl italic">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            DSA <span className="text-primary">Tracker</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 border-r border-white/10 pr-8">
            <Link
              href="/profile"
              onClick={() => {
                if (pathname === "/profile") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  window.history.pushState(null, "", pathname);
                  setCurrentHash("");
                }
              }}
              className={`text-sm font-semibold transition-colors ${pathname === "/profile" && currentHash !== "#progress" ? "text-primary" : "text-slate-400 hover:text-white"}`}>
              Dashboard
            </Link>
            <Link
              href="/topics"
              className={`text-sm font-semibold transition-colors ${pathname === "/topics" ? "text-primary" : "text-slate-400 hover:text-white"}`}>
              Topics
            </Link>
            <Link
              href="/profile#progress"
              onClick={(e) => {
                if (pathname === "/profile") {
                  e.preventDefault();
                  document
                    .getElementById("progress")
                    ?.scrollIntoView({ behavior: "smooth" });
                  // Manually update hash if prevented default
                  window.history.pushState(null, "", "#progress");
                  setCurrentHash("#progress");
                }
              }}
              className={`text-sm font-semibold transition-colors ${pathname === "/profile" && currentHash === "#progress" ? "text-primary" : "text-slate-400 hover:text-white"}`}>
              Progress
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                  <UserCircle size={16} className="text-primary" />
                  <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                    {userName || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bg-background/90 right-0 mt-3 w-72 glass-card p-4 shadow-2xl z-[1000] border-white/10">
                      <div className="mb-4 pb-4 border-b border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                          Current User
                        </p>
                        <p className="text-sm font-bold text-white truncate">
                          {user.email}
                        </p>
                      </div>

                      <form onSubmit={handleUpdateName}>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                          Update Display Name
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your name"
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-primary outline-none transition-all"
                          />
                          <button
                            type="submit"
                            disabled={isUpdating}
                            className="p-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all disabled:opacity-50">
                            {isUpdating ? (
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                              <Check size={16} />
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-semibold group">
              <LogOut
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white/[0.02] border-t border-white/5 mt-4">
            <div className="flex flex-col gap-4 p-4">
              <Link
                href="/profile"
                onClick={() => {
                  if (pathname === "/profile") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                    setCurrentHash("");
                  }
                }}
                className={`text-lg font-bold ${pathname === "/profile" && currentHash !== "#progress" ? "text-primary" : "text-slate-300"}`}>
                Dashboard
              </Link>
              <Link
                href="/topics"
                className={`text-lg font-bold ${pathname === "/topics" ? "text-primary" : "text-slate-300"}`}>
                Topics
              </Link>
              <Link
                href="/profile#progress"
                onClick={(e) => {
                  if (pathname === "/profile") {
                    e.preventDefault();
                    document
                      .getElementById("progress")
                      ?.scrollIntoView({ behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                    window.history.pushState(null, "", "#progress");
                    setCurrentHash("#progress");
                  }
                }}
                className={`text-lg font-bold ${pathname === "/profile" && currentHash === "#progress" ? "text-primary" : "text-slate-300"}`}>
                Progress
              </Link>

              <div className="h-px bg-white/5 my-2" />

              {user && (
                <div className="py-4 border-t border-white/5 mt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                    Profile
                  </p>
                  <form
                    onSubmit={handleUpdateName}
                    className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-1">
                      <UserCircle size={20} className="text-primary" />
                      <span className="text-sm font-bold text-white truncate">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Display Name"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
                      />
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="px-4 bg-primary text-white rounded-xl hover:bg-primary/80 transition-all disabled:opacity-50">
                        {isUpdating ? (
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Check size={20} />
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 font-bold py-2">
                <LogOut size={20} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
