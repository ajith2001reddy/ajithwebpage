'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, GitBranch, GitPullRequest, Clock, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const activities = [
  { type: 'commit', message: 'feat: Add RAG pipeline integration', branch: 'main', time: '2m ago', color: '#0071E3' },
  { type: 'push', message: 'Sync semantic embeddings to vector DB', branch: 'dev', time: '15m ago', color: '#10b981' },
  { type: 'branch', message: 'chore: Initialize infra-monitor alpha', branch: 'feature/infra', time: '1h ago', color: '#8b5cf6' },
  { type: 'merge', message: 'Merge PR #42: GPT-4o task orchestration', branch: 'main', time: '3h ago', color: '#f59e0b' },
];

const AnimatedCounter = ({ value, label, icon: Icon, color }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayValue(prev => (prev < value ? prev + 1 : prev));
    }, 50);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2 p-6 bg-white dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
      <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
        <Icon size={20} style={{ color }} />
      </div>
      <span className="text-3xl font-bold text-black dark:text-white mt-2">{displayValue}</span>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
};

const RolexGauge = () => {
    return (
      <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-gray-100 dark:border-gray-800 flex items-center justify-center bg-white dark:bg-black overflow-hidden shadow-inner">
        {/* Tick Marks */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-3 bg-gray-200 dark:bg-gray-800" 
            style={{ transform: `rotate(${i * 30}deg) translateY(-22px)` }} 
          />
        ))}
        
        {/* Hands */}
        {/* Fast hand (Commits) */}
        <motion.div 
          className="absolute w-[1px] h-20 bg-blue-600 origin-bottom rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ bottom: "50%" }}
        />
        {/* Medium hand (Pushes) */}
        <motion.div 
          className="absolute w-[2px] h-16 bg-gray-400 dark:bg-gray-600 origin-bottom rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          style={{ bottom: "50%" }}
        />
        {/* Slow hand (Branches) */}
        <motion.div 
          className="absolute w-[3px] h-12 bg-gray-300 dark:bg-gray-700 origin-bottom rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          style={{ bottom: "50%" }}
        />
        
        {/* Hub */}
        <div className="z-10 w-4 h-4 rounded-full bg-white dark:bg-black border-2 border-blue-600 flex items-center justify-center">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
        </div>

        {/* Labels */}
        <div className="absolute bottom-10 text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Live Sync</div>
      </div>
    );
};

export default function GitActivity() {
  return (
    <section id="activity" className="py-32 md:py-48 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-6 max-w-2xl">
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-500 uppercase tracking-widest">
                Pulse & Activity
              </p>
              <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white tracking-tighter leading-tight">
                Engineering <br className="hidden md:block" /> in motion.
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-normal leading-relaxed">
                Visualizing the real-time heartbeat of my development cycle—from rapid iterations to stable production deployments.
              </p>
            </div>
            
            {/* Visual Rolex Element */}
            <div className="flex-shrink-0">
               <RolexGauge />
            </div>
        </div>

        {/* Stats & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* Column 1: Counters */}
           <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
              <AnimatedCounter value={1284} label="Total Commits" icon={GitCommit} color="#0071E3" />
              <AnimatedCounter value={42} label="Active Branches" icon={GitBranch} color="#8b5cf6" />
              <div className="col-span-2 lg:col-span-1">
                 <AnimatedCounter value={99} label="Pulls Merged" icon={GitPullRequest} color="#10b981" />
              </div>
           </div>

           {/* Column 2 & 3: Timeline */}
           <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-bold text-black dark:text-white tracking-tight">Recent Deployments</h3>
                 <span className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live Connection
                 </span>
              </div>

              <div className="space-y-4">
                 {activities.map((act, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1, duration: 0.6 }}
                     className="group flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center transition-transform group-hover:scale-110">
                           <GitCommit size={20} style={{ color: act.color }} />
                        </div>
                        <div className="space-y-1">
                           <p className="text-sm font-semibold text-black dark:text-white line-clamp-1">{act.message}</p>
                           <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              <span className="px-2 py-0.5 rounded bg-gray-200/50 dark:bg-gray-800 text-gray-500">{act.branch}</span>
                              <div className="flex items-center gap-1">
                                 <Clock size={10} />
                                 {act.time}
                              </div>
                           </div>
                        </div>
                     </div>
                     <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                   </motion.div>
                 ))}
              </div>

              <button className="w-full py-5 rounded-3xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-widest hover:scale-[0.98] transition-transform flex items-center justify-center gap-3 active:scale-95 shadow-lg">
                 Visit Detailed Repository Trace <ArrowUpRight size={18} />
              </button>
           </div>
        </div>
      </div>
    </section>
  );
}

function ArrowUpRight({ size }) {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}
