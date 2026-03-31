import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Phone } from 'lucide-react';
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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isSticky ? 'bg-slate-50/95 py-3 backdrop-blur-md border-b border-primary/10' : 'bg-slate-50 py-5 shadow-sm'}`}>
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-secondary origin-left z-[60]"
        style={{ scaleX }}
      />
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 md:gap-2 group">
          <img 
            src="/logo-rdg.png" 
            alt="Logo Khoáng Sản Rạng Đông" 
            className={`h-10 md:h-12 w-auto object-contain transition-all duration-300 ${isSticky ? 'scale-90' : ''}`}
          />
          <img 
            src="/company-name.png" 
            alt="Khoáng Sản Rạng Đông" 
            className="h-10 md:h-12 w-auto object-contain mt-1"
          />
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
                className={`text-sm font-bold transition-all uppercase tracking-wide ${
                  isActive ? 'text-primary' : 'text-slate-800 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="flex items-center gap-4 border-l border-slate-300 pl-4 lg:pl-6 ml-2">
            {/* Hotline */}
            <a href="tel:0252652666" className="flex items-center gap-2 text-primary hover:text-secondary transition-colors group">
              {/* <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <Phone size={14} className="animate-pulse" />
              </div> */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1">Hotline</span>
                <span className="text-sm font-extrabold leading-none tracking-wide">0252 652 666</span>
              </div>
            </a>

            <button
              onClick={toggle}
              className="p-2 rounded-full text-slate-700 hover:bg-primary/10 hover:text-primary transition-all"
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
            className="p-2 rounded-full text-slate-700 hover:bg-primary/10 hover:text-primary transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-800 hover:text-primary transition-colors focus:outline-none"
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

          {/* Mobile Hotline */}
          <a href="tel:0252652666" className="mt-2 flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full text-white hover:bg-white/20 transition-colors shadow-sm">
            <Phone size={18} className="animate-pulse" />
            <span className="font-bold tracking-wider">0252 652 666</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
