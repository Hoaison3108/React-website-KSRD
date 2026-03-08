import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Products from '../components/Products';
import Workflow from '../components/Workflow';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import Projects from '../components/Projects';
import News from '../components/News';
import Contact from '../components/Contact';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <>
      <SEO 
        title="Trang chủ" 
        description="Chào mừng bạn đến với Khoáng Sản Rạng Đông. Chúng tôi cung cấp các giải pháp vật liệu xây dựng toàn diện, từ bê tông tươi đến khoáng sản tự nhiên."
      />
      <Hero />
      <About />
      <Products />
      <Workflow />
      <Stats />
      <Testimonials />
      <Projects />
      <News />
      <Contact />
    </>
  );
}
