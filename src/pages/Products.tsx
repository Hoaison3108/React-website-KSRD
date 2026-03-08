import React, { useState, useEffect } from 'react';
import Products from '../components/Products';
import Workflow from '../components/Workflow';
import Breadcrumb from '../components/Breadcrumb';
import SEO from '../components/SEO';
import SkeletonGrid from '../components/SkeletonGrid';

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-[72px]">
      <SEO 
        title="Sản phẩm" 
        description="Khám phá hệ sinh thái sản phẩm vật liệu xây dựng đa dạng của Rạng Đông: bê tông tươi, gạch block, cát đá xây dựng đạt tiêu chuẩn quốc tế."
      />
      <Breadcrumb />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2068&auto=format&fit=crop" 
            alt="Products Hero" 
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/70" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 border border-secondary/50 text-secondary text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
            Tiêu chuẩn quốc tế
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Giải Pháp <span className="text-secondary">Vật Liệu Toàn Diện</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Hệ sinh thái sản phẩm đa dạng từ bê tông, gạch không nung đến cát đá, đáp ứng mọi yêu cầu khắt khe nhất của công trình hiện đại.
          </p>
        </div>
      </section>

      <div className="container-custom py-16">
        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : (
          <Products viewMode="grid" hideHeader={true} />
        )}
      </div>
      <Workflow />
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bạn cần tư vấn về sản phẩm?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
            Đội ngũ kỹ thuật của Rạng Đông luôn sẵn sàng hỗ trợ bạn lựa chọn giải pháp vật liệu tối ưu nhất cho công trình.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/contact" 
              className="btn bg-secondary text-white hover:bg-orange-600 flex items-center gap-2 shadow-xl shadow-orange-900/20 px-8 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-1"
            >
              Liên hệ báo giá ngay
            </a>
            <a 
              href="tel:0909123456" 
              className="btn bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white hover:text-primary px-8 py-3 rounded-xl font-bold transition-all"
            >
              Hotline: 0909 123 456
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
