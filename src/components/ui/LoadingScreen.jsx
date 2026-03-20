'use client';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="relative w-12 h-12 mb-12">
        <div className="absolute inset-0 border-2 border-slate-200 dark:border-white/5 rounded-full" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-t-blue-500 rounded-full"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
         <span className="text-[10px] font-bold tracking-[0.6em] uppercase text-slate-400 animate-pulse">Syncing_Nodes</span>
         <div className="flex gap-1 h-3 items-center">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 h-1 rounded-full bg-blue-500"
              />
            ))}
         </div>
      </div>
    </div>
  );
}
