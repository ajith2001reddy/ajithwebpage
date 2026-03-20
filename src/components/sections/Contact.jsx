'use client';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, ArrowRight } from 'lucide-react';
import { CONFIG } from '@/constants/config';

export default function Contact() {
  return (
    <section id="contact" className="py-32 md:py-48 px-6 bg-transparent">
      <div className="max-w-4xl mx-auto text-center space-y-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-500 uppercase tracking-widest">
            The Nexus
          </p>
          <h2 className="text-5xl md:text-8xl font-bold text-black dark:text-white tracking-tighter leading-none">
            Let&apos;s build <br className="hidden md:block" /> with precision.
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-normal max-w-2xl mx-auto leading-relaxed">
            I&apos;m currently open to collaborations, infrastructure engineering roles, and high-impact AI projects. Connect with me directly below.
          </p>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2, duration: 0.8 }}
           className="pt-12"
        >
           <a 
              href={`mailto:${CONFIG.EMAIL}`}
              className="group inline-flex items-center gap-6 px-12 py-5 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-full text-lg shadow-2xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300"
           >
              <Mail size={24} />
              <span>Contact Directly</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
           </a>
        </motion.div>

        {/* Social Ecosystem */}
        <div className="pt-24 grid grid-cols-2 gap-8 md:flex md:justify-center md:gap-16 items-center border-t border-gray-100 dark:border-gray-800">
           <a href={CONFIG.LINKEDIN} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 group">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800 transition-all group-hover:scale-110 group-hover:shadow-lg">
                 <Linkedin size={24} className="text-gray-400 group-hover:text-blue-600" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-black dark:group-hover:text-white uppercase tracking-widest">LinkedIn</span>
           </a>

           <a href={CONFIG.GITHUB} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 group">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800 transition-all group-hover:scale-110 group-hover:shadow-lg">
                 <Github size={24} className="text-gray-400 group-hover:text-black dark:group-hover:text-white" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-black dark:group-hover:text-white uppercase tracking-widest">GitHub</span>
           </a>
        </div>
      </div>
    </section>
  );
}
