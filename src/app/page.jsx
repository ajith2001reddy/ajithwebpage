'use client';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';
import GitActivity from '@/components/sections/GitActivity';
import { Suspense } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden">
      <Navbar />
      <main className="relative z-10">
        <Suspense fallback={<LoadingScreen />}>
          <Hero />
          <Projects />
          <GitActivity />
          <Skills />
          <About />
          <Contact />
        </Suspense>
      </main>
      
      {/* Footer Signature */}
      <footer className="py-20 px-6 border-t border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <span className="text-xs text-gray-500 font-medium tracking-tight">© 2026 Ajith Pavan Reddy. Built with precision.</span>
           <div className="flex gap-8">
              <a href="https://github.com/ajithpavanreddy" className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors">GitHub</a>
              <a href="https://linkedin.com/in/ajithpavanreddykambam" className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
