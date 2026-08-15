import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-[#0B1120] dark:via-[#1A2234] dark:to-[#0B1120] from-purple-100 via-blue-100 to-pink-100 text-gray-900 dark:text-white transition-colors duration-300">

      {/* NAVBAR WITH MOVING TAGLINE */}
      <nav className="sticky top-0 z-50 bg-white/10 dark:bg-black/20 backdrop-blur-lg border-b border-black/10 dark:border-white/10">
        <div className="flex justify-between items-center px-6 md:px-20 py-4">
          <h2 className="text-2xl font-bold text-[#4f46e5]">
            TechLens
          </h2>

          <div className="hidden md:block overflow-hidden w-[480px]">
            <p className="animate-marquee whitespace-nowrap text-sm font-semibold text-[#4f46e5] dark:text-purple-300">
              TechLens: Instead of matching you and lovers via Rahu-Ketu, we match skills with your career goals 
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-[#4f46e5] transition">Login</Link>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-black/10 dark:bg-white/10 hover:scale-110 transition text-xl"
            >
              {isDark? '☀️' : '🌙'}
            </button>
            <Link to="/register" className="px-5 py-2 bg-[#4f46e5] text-white rounded-lg font-semibold hover:scale-105 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center px-6 md:px-20 py-20 md:py-32">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-black dark:text-white">
          Discover Your Skills. <br/>
          <span className="text-black dark:text-white">
            Fix Your Gaps.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Tell TechLens what you’re interested in. We’ll analyze what skills you
          already have, what you’re missing, and build you a personal learning roadmap.
        </p>
        <Link to="/register" className="px-8 py-4 bg-[#4f46e5] text-white rounded-xl text-lg font-semibold hover:scale-105 transition inline-block">
          Analyze My Skills
        </Link>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-20 py-16">
        <h3 className="text-center text-3xl font-bold mb-12 text-black dark:text-white">How It Works</h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-4xl mx-auto">
          {[
            { step: "1", title: "Choose Interest", desc: "Web Dev, Design, Data, AI, etc." },
            { step: "2", title: "Take Skill Test", desc: "Rate yourself. Get an instant score." },
            { step: "3", title: "Get Your Roadmap", desc: "Step-by-step plan to level up." }
          ].map((item) => (
            <div key={item.step} className="text-center flex-1">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#4f46e5] flex items-center justify-center text-2xl font-bold text-white">
                {item.step}
              </div>
              <h4 className="font-bold text-xl mb-2 text-black dark:text-white">{item.title}</h4>
              <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 md:px-20 py-20 bg-black/5 dark:bg-white/5">
        <h3 className="text-center text-3xl font-bold mb-12 text-black dark:text-white">What You Get</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="p-8 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-[#4f46e5] hover:scale-105 transition">
            <div className="text-4xl mb-4"></div>
            <h4 className="text-xl font-bold mb-3 text-black dark:text-white">Skill Self-Assessment</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Pick your field and rate yourself. Get a clear score of where you stand today.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-[#4f46e5] hover:scale-105 transition">
            <div className="text-4xl mb-4"></div>
            <h4 className="text-xl font-bold mb-3 text-black dark:text-white">Gap Analysis with AI</h4>
            <p className="text-gray-600 dark:text-gray-400">
              We compare you to industry skill maps and show exactly where you lack.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-[#4f46e5] hover:scale-105 transition">
            <div className="text-4xl mb-4"></div>
            <h4 className="text-xl font-bold mb-3 text-black dark:text-white">Personal Learning Roadmap</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Get courses, projects, and practice tasks tailored to fill your skill gaps.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-20">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white">Ready to Know Yourself?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8">No companies. No pressure. Just growth.</p>
        <Link to="/register" className="px-8 py-4 bg-[#4f46e5] text-white rounded-xl text-lg font-semibold hover:scale-105 transition inline-block">
          Start Your Analysis
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 border-t border-black/10 dark:border-white/10 text-gray-500">
        © 2026 TechLens. Know Yourself. Build Yourself.
      </footer>

      {/* CSS FOR MARQUEE */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
     .animate-marquee {
          animation: marquee 12s linear infinite;
        }
      `}</style>

    </div>
  );
};

export default Landing;