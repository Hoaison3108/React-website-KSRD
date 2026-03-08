import React, { useState, useEffect } from 'react';
import ProjectHero from '../components/projects/ProjectHero';
import ProjectGrid from '../components/projects/ProjectGrid';
import Breadcrumb from '../components/Breadcrumb';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SkeletonGrid from '../components/SkeletonGrid';

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-[72px]">
      <SEO 
        title="Dự án" 
        description="Tổng hợp các dự án trọng điểm mà Khoáng Sản Rạng Đông đã và đang cung cấp vật liệu xây dựng: cao tốc, khu công nghiệp, resort cao cấp."
      />
      <Breadcrumb />
      
      <ProjectHero />
      
      <div className="container-custom py-16">
        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : (
          <ProjectGrid hideHeader={true} />
        )}
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">
            Bạn đang tìm đối tác cung ứng <span className="text-secondary block mt-3">vật liệu xây dựng uy tín?</span>
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
            Với kinh nghiệm và năng lực cung ứng vượt trội, chúng tôi tự tin đồng hành cùng mọi quy mô công trình.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn bg-secondary text-white hover:bg-orange-600 flex items-center gap-2 shadow-xl shadow-orange-900/20">
              Liên hệ ngay <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn bg-white text-primary hover:bg-gray-100">
              Xem năng lực sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
