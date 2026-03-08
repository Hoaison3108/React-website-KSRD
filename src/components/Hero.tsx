import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { heroImages } from '../data/heroImages';

export default function Hero() {
  const { settings } = useSiteSettings();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const heroData = settings?.hero || {
    title: 'CUNG ỨNG VẬT LIỆU XÂY DỰNG BỀN VỮNG',
    subtitle: 'Khoáng Sản Rạng Đông đồng hành cùng mọi công trình trọng điểm với các sản phẩm từ khai thác khoáng sản tự nhiên và bê tông chất lượng cao.',
    backgroundImage: heroImages[0]
  };

  // If user has set a background image, we use it as the first one or only one
  const images = settings?.hero?.backgroundImage ? [settings.hero.backgroundImage, ...heroImages.slice(1)] : heroImages;

  return (
    <section id="hero" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex % images.length]}
            alt="Hero Background"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#104c8a]/90 to-[#104c8a]/40 z-10"></div>
      </div>

      <div className="container-custom relative z-20 text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h4 className="text-secondary text-base md:text-lg font-bold tracking-[2px] uppercase mb-4">
            TRAO CHẤT LƯỢNG - NHẬN NIỀM TIN
          </h4>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg uppercase">
            {heroData.title}
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-100">
            {heroData.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products" className="btn btn-primary shadow-lg shadow-blue-900/50">
              KHÁM PHÁ SẢN PHẨM
            </a>
            <a href="#about" className="btn btn-secondary">
              VỀ CHÚNG TÔI
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
