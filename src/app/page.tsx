import Link from 'next/link';
import { ArrowRight, Code2, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background blur */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-pulse delay-1000"></div>
      </div>

      <main className="max-w-7xl w-full px-8 py-24 text-center">
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 animate-fade-in">
            New: All Topics Added
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
            Master DSA with <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Precision</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            The ultimate DSA tracker for top tech interviews. Organize your learning, track progress, and conquer the coding world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 mb-24">
            <Link href="/login" className="btn-primary text-lg px-10 py-4 flex items-center gap-3">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link href="#features" className="px-10 py-4 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">
              View Curriculum
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left" id="features">
            {[
              { icon: Zap, title: 'Progress Board', desc: 'Visual dashboards for easy, medium, and hard problems.' },
              { icon: Code2, title: 'Multi-Resource', desc: 'Direct links to LeetCode, YouTube tutorials, and articles.' },
              { icon: ShieldCheck, title: 'Secure & Cloud', desc: 'Your progress is saved and accessible anywhere.' }
            ].map((f, i) => (
              <div key={i} className="glass-card p-10 group hover:border-primary transition-all">
                <f.icon className="text-primary w-10 h-10 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
