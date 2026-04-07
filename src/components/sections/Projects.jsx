'use client';
import { motion } from 'framer-motion';
import { Github, ArrowUpRight, Gauge, Shield, Brain } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const projects = [
  {
    title: 'Intelligent Agent Workflow System',
    description: 'Agentic workflow platform for reasoning, planning, and multi-step execution with external tool/API orchestration and end-to-end automation.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop',
    tech: ['Python', 'LangGraph', 'LangChain', 'REST APIs', 'LLM Evaluation'],
    links: { github: 'https://github.com/ajithpavanreddy' },
    outcome: 'Reduced manual intervention by automating decision-making workflows with robust evaluation and observability.',
    icon: Brain,
  },
  {
    title: 'LLM Knowledge Assistant',
    description: 'Enterprise RAG system using LangChain and vector search to improve retrieval quality and deliver context-aware responses.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop',
    tech: ['Python', 'LangChain', 'Vector Search', 'Prompt Engineering'],
    links: { github: 'https://github.com/ajithpavanreddy' },
    outcome: 'Improved answer relevance and reduced hallucinations through iterative testing and prompt tuning.',
    icon: Shield,
  },
  {
    title: 'Microservices Backend System',
    description: 'Scalable backend architecture built with FastAPI and containerized deployment workflows for reliable service delivery.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
    tech: ['FastAPI', 'Docker', 'Kubernetes', 'CI/CD'],
    links: { github: 'https://github.com/ajithpavanreddy' },
    outcome: 'Enabled automated testing and deployment with resilient API communication and data handling patterns.',
    icon: Gauge,
  },
  {
    title: 'AI Brain Tumor Detection',
    description: 'Medical image classification project focused on deep learning-based tumor detection with strong model validation practices.',
    image: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=1200&h=800&fit=crop',
    tech: ['Deep Learning', 'Computer Vision', 'Data Augmentation', 'Model Evaluation'],
    links: { github: 'https://github.com/ajithpavanreddy' },
    outcome: 'Improved model robustness through preprocessing, augmentation, and performance-metric-driven validation.',
    icon: Brain,
  },
];

function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = project.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => {
        setIsHovered(true);
        window.dispatchEvent(new CustomEvent('astro-boost'));
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="group rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-900 bg-white/70 dark:bg-gray-900/50 backdrop-blur hover:border-blue-200 dark:hover:border-blue-900/60 transition-all duration-500"
    >
      <div className="relative h-64 md:h-80 overflow-hidden bg-gray-50 dark:bg-black">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-all duration-700 ease-in-out ${isHovered ? 'scale-105 opacity-80' : 'scale-100 opacity-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/80 text-xs font-semibold text-gray-700 dark:text-gray-200">
          <Icon size={14} /> Featured Build
        </div>
        <div className="absolute top-5 right-5">
          <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/90 dark:bg-black/90 rounded-full shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 block">
            <Github size={18} className="text-gray-900 dark:text-white" />
          </a>
        </div>
      </div>

      <div className="p-8 md:p-10 space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white tracking-tight">{project.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">{project.description}</p>
        </div>

        <p className="text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-xl px-4 py-3">
          {project.outcome}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((tag) => (
            <span key={tag} className="px-4 py-1.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-full tracking-wide uppercase">
              {tag}
            </span>
          ))}
        </div>

        <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 pt-2 text-blue-600 dark:text-blue-500 font-bold text-sm tracking-tight group/link cursor-pointer">
          Open Repository <ArrowUpRight size={16} className="transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
        </a>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-32 md:py-48 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-500 uppercase tracking-widest">Selected Work</p>
          <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white tracking-tighter">
            Built for measurable impact,
            <br className="hidden md:block" /> designed for exceptional experience.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
