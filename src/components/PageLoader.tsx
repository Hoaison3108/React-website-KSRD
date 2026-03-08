import React from 'react';
import { motion } from 'motion/react';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-gray-100 dark:border-slate-800 rounded-full"
        />
        {/* Progress Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
        />
        {/* Inner Logo/Icon Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-8 h-8 bg-secondary rounded-lg shadow-lg"
          />
        </div>
      </div>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-primary dark:text-white font-bold tracking-[4px] uppercase text-xs"
      >
        Đang tải dữ liệu...
      </motion.p>
    </div>
  );
}
