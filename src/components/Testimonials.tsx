import React from 'react';
import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { testimonials } from '../data/testimonials';

interface TestimonialsProps {
  bgColor?: string;
}

export default function Testimonials({ bgColor = 'bg-gray-50 dark:bg-slate-800' }: TestimonialsProps) {
  return (
    <section className={`section-padding ${bgColor}`}>
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-xl text-gray-900 dark:text-white mb-4">
            ĐỐI TÁC NÓI GÌ VỀ CHÚNG TÔI
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto"></div>
        </div>

        <div className="overflow-hidden px-4 -mx-4 pb-12">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="!pb-12"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index} className="h-auto">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full border border-transparent hover:border-primary/10">
                  <div>
                    <div className="flex gap-1 text-secondary mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-slate-300 italic text-sm leading-relaxed mb-6 line-clamp-4 md:h-[5.75rem]">
                      "{item.comment}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0 border-2 border-white shadow-sm">
                      <img 
                        src={item.avatar} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <strong className="block text-slate-900 dark:text-white font-bold text-sm">{item.name}</strong>
                      <span className="text-xs text-gray-600 dark:text-slate-400">{item.role} - {item.company}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
