import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <SEO title="404 - Không tìm thấy trang" description="Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển." />
      
      <div className="text-center max-w-lg">
        <h1 className="text-9xl font-black text-gray-200 dark:text-slate-800 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Rất tiếc, trang không tồn tại!</h2>
        <p className="text-gray-600 dark:text-slate-400 mb-10 text-lg">
          Trang bạn đang tìm kiếm có thể đã bị xóa, thay đổi tên hoặc tạm thời không khả dụng.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-primary/20"
          >
            <Home size={20} />
            VỀ TRANG CHỦ
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-white border border-gray-200 dark:border-slate-700 px-8 py-3 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
          >
            <ArrowLeft size={20} />
            QUAY LẠI
          </button>
        </div>
      </div>
    </div>
  );
}
