'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden bg-transparent">
      <div className="max-w-4xl text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <p 
            onMouseEnter={() => window.dispatchEvent(new CustomEvent('astro-boost'))}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase cursor-help"
          >
            Digital Product Engineer
          </p>
          
          <h1 
            onMouseEnter={() => window.dispatchEvent(new CustomEvent('astro-boost'))}
            className="text-5xl md:text-8xl font-bold leading-[1.1] text-black dark:text-white tracking-tight cursor-default"
          >
            Crafting precision systems <br className="hidden md:block" /> with elegant design.
          </h1>

          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-normal max-w-2xl mx-auto leading-relaxed">
            I build scalable backend infrastructure and AI-powered applications that balance technical excellence with thoughtful user experience.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a
            href="#projects"
            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold rounded-full transition-all flex items-center gap-2"
          >
            View Work <ArrowRight size={16} />
          </a>
          <a
            href="#contact"
            className="px-10 py-4 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-black dark:text-white text-sm font-semibold rounded-full transition-all"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Subtle scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Scroll</p>
        <div className="w-[1px] h-10 bg-gradient-to-b from-gray-300 dark:from-gray-700 to-transparent" />
      </motion.div>
    </section>
  );
}
