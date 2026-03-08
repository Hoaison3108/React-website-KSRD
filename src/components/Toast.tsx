import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  show: boolean;
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ show, message, type = 'success', onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="text-green-500" size={24} />,
    error: <AlertCircle className="text-red-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
  };

  const bgColors = {
    success: 'bg-white dark:bg-slate-800 border-green-100 dark:border-green-900/30',
    error: 'bg-white dark:bg-slate-800 border-red-100 dark:border-red-900/30',
    info: 'bg-white dark:bg-slate-800 border-blue-100 dark:border-blue-900/30',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
          className={`fixed bottom-8 left-1/2 z-[9999] flex items-center gap-4 p-4 pr-12 rounded-2xl shadow-2xl border min-w-[320px] max-w-[90vw] ${bgColors[type]}`}
        >
          <div className="shrink-0">
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              {type === 'success' ? 'Thành công!' : type === 'error' ? 'Có lỗi xảy ra!' : 'Thông báo'}
            </p>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
              {message}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
          
          {/* Progress bar */}
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: 0 }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className={`absolute bottom-0 left-0 h-1 rounded-b-2xl ${
              type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
