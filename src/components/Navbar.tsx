import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import { motion, useScroll, useSpring } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggle } = useDarkMode(); // Assuming useDarkMode returns { isDark, toggle }
  const location = useLocation();

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Giới thiệu', href: '/about' },
    { name: 'Sản phẩm', href: '/products' },
    { name: 'Dự án', href: '/projects' },
    { name: 'Tin tức', href: '/news' },
    { name: 'Tuyển dụng', href: '/recruitment' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navbar is sticky (solid bg) if scrolled OR if NOT on home page
  const isSticky = isScrolled || !isHomePage;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isSticky ? 'bg-primary py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-secondary origin-left z-[60]"
        style={{ scaleX }}
      />
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className={`w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-xl shadow-lg transition-all ${isSticky ? 'scale-90' : ''}`}>
            RĐ
          </div>
          <div className="flex flex-col font-heading">
            <span className="text-lg md:text-xl font-extrabold text-white uppercase leading-none">KHOÁNG SẢN</span>
            <span className="text-xs md:text-sm font-bold text-secondary uppercase leading-none mt-1">RẠNG ĐÔNG</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = link.href === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(link.href);
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-bold transition-colors uppercase ${
                  isActive ? 'text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="flex items-center gap-2 border-l border-white/20 pl-4">
            <button
              onClick={toggle}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-4">
          <button
            onClick={toggle}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-primary shadow-xl transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] py-4' : 'max-h-0 py-0'}`}>
        <div className="flex flex-col items-center gap-4">
          {navLinks.map((link) => {
            const isActive = link.href === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base font-bold py-2 border-b border-white/10 w-full text-center hover:bg-white/5 transition-colors ${
                  isActive ? 'text-white bg-white/10' : 'text-white/70'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

