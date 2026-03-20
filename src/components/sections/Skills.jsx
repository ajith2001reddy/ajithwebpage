'use client';
import { motion } from 'framer-motion';

const skillCategories = [
  {
    category: 'Languages',
    skills: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'C++'],
  },
  {
    category: 'Backend & Infrastructure',
    skills: ['FastAPI', 'Node.js', 'PostgreSQL', 'MongoDB', 'REST APIs', 'Microservices'],
  },
  {
    category: 'Cloud & Systems',
    skills: ['Linux', 'Docker', 'Kubernetes', 'Distributed Systems', 'Observability'],
  },
  {
    category: 'AI & Data Science',
    skills: ['LLMs', 'RAG (LangChain)', 'FAISS', 'TensorFlow', 'NLP Scaling'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-32 md:py-48 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-500 uppercase tracking-widest">
            Technical Arsenal
          </p>
          <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white tracking-tighter">
            Technologies I master.
          </h2>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-bold text-black dark:text-white tracking-tight">
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-4">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:border-blue-500/30 hover:shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
