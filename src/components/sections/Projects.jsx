'use client';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const projects = [
  {
    title: 'LLM Knowledge Assistant',
    description: 'A modular RAG pipeline using semantic embeddings and vector databases for scalable, grounded query processing.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop',
    tech: ['Python', 'LangChain', 'FAISS', 'OpenAI'],
    links: { github: 'https://github.com/ajith2001reddy/LLM-Knowledge-Assistant-RAG-System-', demo: '#' },
    accent: '#0071E3'
  },
  {
    title: 'Infra Monitor Auto',
    description: 'Linux-based monitoring system for anomaly detection and distributed resource observability.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
    tech: ['Python', 'Linux', 'Logging', 'Systems'],
    links: { github: 'https://github.com/ajith2001reddy', demo: '#' },
    accent: '#10b981'
  },
  {
    title: 'AI Personal Assistant',
    description: 'NLP-based task orchestration system processing user commands to trigger complex automated workflows.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop',
    tech: ['Python', 'NLP', 'APIs', 'Automation'],
    links: { github: 'https://github.com/ajith2001reddy/AI-Personal-Assistant-for-Task-Automation', demo: '#' },
    accent: '#8b5cf6'
  },
];

function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => {
        setIsHovered(true);
        window.dispatchEvent(new CustomEvent('astro-boost'));
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="group block rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-900/40 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gray-50 dark:bg-black">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-all duration-700 ease-in-out ${isHovered ? 'scale-105 opacity-80' : 'scale-100 opacity-100'}`}
        />
        <div className="absolute top-6 right-6">
          <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/90 dark:bg-black/90 rounded-full shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 block">
            <Github size={18} className="text-gray-900 dark:text-white" />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 md:p-10 space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white tracking-tight">
            {project.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-light leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-full tracking-wide uppercase"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link */}
        <div className="flex items-center gap-2 pt-4 text-blue-600 dark:text-blue-500 font-bold text-sm tracking-tight group/link cursor-pointer">
          View Project Detail <ArrowUpRight size={16} className="transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-32 md:py-48 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-500 uppercase tracking-widest">
            Selected Work
          </p>
          <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white tracking-tighter">
            Digital solutions <br className="hidden md:block" /> with real-world impact.
          </h2>
        </div>

        {/* Grid - FIXED: Proper ProjectCard rendering */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}