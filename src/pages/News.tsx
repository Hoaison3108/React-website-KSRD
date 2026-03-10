import React, { useState, useEffect } from 'react';
import News from '../components/News';
import Breadcrumb from '../components/Breadcrumb';
import SEO from '../components/SEO';
import SkeletonGrid from '../components/SkeletonGrid';

export default function NewsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-[72px]">
      <SEO 
        title="Tin tức" 
        description="Cập nhật những tin tức mới nhất về hoạt động kinh doanh, sự kiện và xu hướng ngành vật liệu xây dựng từ Khoáng Sản Rạng Đông."
      />
      <Breadcrumb />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop" 
            alt="News Hero" 
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/70" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 border border-secondary/50 text-secondary text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
            Thông tin chính thống
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Tiêu Điểm & <span className="text-secondary">Xu Hướng</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Cập nhật liên tục các hoạt động nổi bật của Rạng Đông về hoạt động kinh doanh và sự kiện nổi bật.
          </p>
        </div>
      </section>

      <div className="container-custom py-16">
        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : (
          <News isPaginationEnabled={true} hideHeader={true} />
        )}
      </div>
    </div>
  );
}
