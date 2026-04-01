'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

const highlights = [
  { label: 'Production Systems', value: '15+' },
  { label: 'Data Sources Unified', value: '50+' },
  { label: 'Years Engineering', value: '5+' },
];

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 px-6 overflow-hidden bg-transparent">
      <div className="hero-aurora" aria-hidden="true" />

      <div className="max-w-6xl w-full text-center space-y-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-7"
        >
          <p
            onMouseEnter={() => window.dispatchEvent(new CustomEvent('astro-boost'))}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-[0.2em] uppercase cursor-help bg-blue-50/80 dark:bg-blue-500/10 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-900/40"
          >
            <Sparkles size={14} /> AI Systems · Platform Engineering
          </p>

          <h1
            onMouseEnter={() => window.dispatchEvent(new CustomEvent('astro-boost'))}
            className="text-5xl md:text-8xl font-bold leading-[1.02] text-black dark:text-white tracking-tight cursor-default"
          >
            High-performance digital
            <br className="hidden md:block" /> products, engineered to scale.
          </h1>

          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 font-normal max-w-3xl mx-auto leading-relaxed">
            I design and deliver resilient backend infrastructure and AI-powered experiences with obsessive attention to speed,
            reliability, and elegant product detail.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a
            href="#projects"
            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold rounded-full transition-all flex items-center gap-2 shadow-xl shadow-blue-700/20"
          >
            Explore Portfolio <ArrowRight size={16} />
          </a>
          <a
            href="#contact"
            className="px-10 py-4 border border-gray-200 dark:border-gray-800 hover:bg-gray-50/90 dark:hover:bg-gray-900 text-black dark:text-white text-sm font-semibold rounded-full transition-all"
          >
            Start a Conversation
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur px-6 py-5"
            >
              <p className="text-3xl md:text-4xl font-bold text-black dark:text-white">{item.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-2"><ShieldCheck size={15} /> Reliability-first architecture</span>
          <span className="inline-flex items-center gap-2"><Cpu size={15} /> AI-ready product systems</span>
        </div>
      </div>
    </section>
  );
}
