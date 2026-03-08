import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import AboutIntro from '../components/about/AboutIntro';
import CoreValues from '../components/about/CoreValues';
import Timeline from '../components/about/Timeline';
import Team from '../components/about/Team';
import Gallery from '../components/about/Gallery';
import Certificates from '../components/about/Certificates';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <div className="pt-[72px]">
      <SEO 
        title="Giới thiệu" 
        description="Tìm hiểu về hành trình hơn 10 năm phát triển của Khoáng Sản Rạng Đông, sứ mệnh, tầm nhìn và những giá trị cốt lõi mà chúng tôi theo đuổi."
      />
      <Breadcrumb />
      
      {/* Hero Section */}
       <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1599708153386-52e69d9c2746?q=80&w=2070&auto=format&fit=crop" 
            alt="About Hero" 
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/70" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 border border-secondary/50 text-secondary text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
            Hành trình kiến tạo
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Vững Bước & <span className="text-secondary">Vươn Xa</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Hơn một thập kỷ đồng hành cùng sự phát triển của hạ tầng Việt Nam, chúng tôi không ngừng nỗ lực để mang đến những giá trị bền vững nhất.
          </p>
        </div>
      </section>

      <AboutIntro />
      <CoreValues />
      <Timeline />
      <Team />  
      <Gallery />
      <Certificates />
      <Testimonials bgColor="bg-white dark:bg-slate-900" />   
    </div>
  );
}
