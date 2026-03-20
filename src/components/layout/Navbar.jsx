'use client';
import Link from 'next/link';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/70 dark:bg-black/70 backdrop-blur-lg border-b border-gray-100 dark:border-gray-900 py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          onMouseEnter={() => {
            window.dispatchEvent(new CustomEvent('astro-target', { detail: { x: -0.8, y: 0.8 } }));
            window.dispatchEvent(new CustomEvent('astro-boost'));
          }}
          onMouseLeave={() => window.dispatchEvent(new CustomEvent('astro-target', { detail: null }))}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 bg-[#0071E3] rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-500/20">
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
          <span className="text-sm font-bold tracking-tighter text-black dark:text-white uppercase">Ajith</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#projects"
            onClick={() => setIsMobileOpen(false)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium"
          >
            Work
          </Link>
          <Link
            href="#about"
            onClick={() => setIsMobileOpen(false)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium"
          >
            About
          </Link>
          <Link
            href="#contact"
            onClick={() => setIsMobileOpen(false)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium"
          >
            Contact
          </Link>
        </div>

        {/* Right Side - Dark Mode + Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun size={18} className="text-gray-400" />
            ) : (
              <Moon size={18} className="text-gray-600" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <X size={20} className="text-gray-900 dark:text-white" />
            ) : (
              <Menu size={20} className="text-gray-900 dark:text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-black"
        >
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
            <Link
              href="#projects"
              onClick={() => setIsMobileOpen(false)}
              className="block text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500 transition-colors py-2"
            >
              Work
            </Link>
            <Link
              href="#about"
              onClick={() => setIsMobileOpen(false)}
              className="block text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500 transition-colors py-2"
            >
              About
            </Link>
            <Link
              href="#contact"
              onClick={() => setIsMobileOpen(false)}
              className="block text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500 transition-colors py-2"
            >
              Contact
            </Link>
          </div>
        </motion.div>
      )}

      {/* Scroll Progress Bar */}
      <motion.div
        className="h-[0.5px] bg-blue-600 dark:bg-blue-500 origin-left"
        style={{ scaleX }}
      />
    </motion.header>
  );
}