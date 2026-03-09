import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Phone, Mail, MapPin, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion, AnimatePresence } from 'motion/react';
import Breadcrumb from '../components/Breadcrumb';
import SEO from '../components/SEO';
import { doc, getDoc, collection, getDocs, query, limit, where } from 'firebase/firestore';
import { db } from '../firebase';
import { saveContactMessage } from '../utils/firestoreUtils';
import { products as localProducts } from '../data/products';

import 'swiper/css';
import 'swiper/css/navigation';

interface Product {
  id: string | number;
  title: string;
  desc: string;
  image: string;
  gallery?: string[];
  badge: string;
  color: string;
  category?: string;
  details?: {
    features: string[];
    specifications: { label: string; value: string | string[]; }[];
    applications: string;
  };
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [quoteStatus, setQuoteStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setQuoteStatus('submitting');
    try {
      await saveContactMessage({
        ...quoteForm,
        service: `Báo giá: ${product.title}`,
        type: 'quote'
      });
      setQuoteStatus('success');
      setTimeout(() => {
        setIsQuoteModalOpen(false);
        setQuoteStatus('idle');
        setQuoteForm({ name: '', phone: '', email: '', message: '' });
      }, 2000);
    } catch (error) {
      console.error("Error submitting quote:", error);
      setQuoteStatus('error');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentImageIndex(0); // Reset image index when product changes

    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Try fetching from Firestore first
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        let fetchedProduct: Product | null = null;

        if (docSnap.exists()) {
          const data = docSnap.data();
          fetchedProduct = {
            id: docSnap.id,
            title: data.name,
            desc: data.description,
            image: data.images && data.images.length > 0 ? data.images[0] : '',
            gallery: data.images || [],
            badge: 'Mới',
            color: 'blue',
            category: data.category,
            details: {
              features: [],
              specifications: Object.entries(data.specifications || {}).map(([key, value]) => ({ label: key, value: String(value) })),
              applications: ''
            }
          };
        } else {
          // Fallback to local data
          const local = localProducts.find(p => p.id.toString() === id);
          if (local) {
            fetchedProduct = {
              ...local,
              id: local.id.toString()
            } as any;
          }
        }

        if (fetchedProduct) {
          setProduct(fetchedProduct);

          // Fetch related products
          const productsRef = collection(db, 'products');
          const q = query(productsRef, limit(4));
          const querySnapshot = await getDocs(q);
          const relatedFromFirestore = querySnapshot.docs
            .map(d => {
              const dData = d.data();
              return {
                id: d.id,
                title: dData.name,
                desc: dData.description,
                image: dData.images && dData.images.length > 0 ? dData.images[0] : '',
                badge: 'Mới',
                color: 'blue',
                category: dData.category
              } as Product;
            })
            .filter(p => p.id !== id);
          
          // Combine with local products for "Related Products"
          const combinedRelated = [...relatedFromFirestore];
          localProducts.forEach(lp => {
            if (lp.id.toString() !== id && !combinedRelated.find(cr => cr.title === lp.title)) {
              combinedRelated.push({ ...lp, id: lp.id.toString() } as any);
            }
          });

          setRelatedProducts(combinedRelated.slice(0, 4));
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Fallback to local data on error
        const local = localProducts.find(p => p.id.toString() === id);
        if (local) {
          setProduct({ ...local, id: local.id.toString() } as any);
          setRelatedProducts(localProducts.filter(p => p.id.toString() !== id).slice(0, 4) as any);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getImageUrl = (image: any) => {
    if (typeof image === 'string' && image.trim() !== '') return image;
    return undefined;
  };

  const nextImage = () => {
    if (!product) return;
    const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!product) return;
    const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sản phẩm</h2>
        <Link to="/products" className="text-primary hover:underline flex items-center">
          <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[80px] bg-gray-50 dark:bg-slate-900 min-h-screen">
      <SEO 
        title={product.title} 
        description={product.desc}
      />
      <Breadcrumb customLastSegment={product.title} />
      <div className="container-custom mt-8">

        {/* Product Content */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative h-[400px] lg:h-[500px] overflow-hidden group bg-gray-100 dark:bg-slate-700">
              <AnimatePresence mode='wait'>
                <motion.img 
                  key={currentImageIndex}
                  src={getImageUrl(product.gallery && product.gallery.length > 0 ? product.gallery[currentImageIndex] : product.image)} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Zoom Button */}
              <button 
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-md text-white p-2 rounded-lg hover:bg-black/70 cursor-pointer"
                title="Phóng to hình ảnh"
              >
                <Maximize2 size={20} />
              </button>
              
              {/* Navigation Buttons */}
              {product.gallery && product.gallery.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-primary shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95 z-10 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 duration-300"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-primary shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95 z-10 opacity-0 group-hover:opacity-100 translate-x-[10px] group-hover:translate-x-0 duration-300"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium border border-white/10 z-10">
                    {currentImageIndex + 1} / {product.gallery.length}
                  </div>

                  {/* Thumbnails Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {product.gallery.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentImageIndex === idx 
                            ? 'bg-white w-6' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute top-4 left-4 z-10">
                <span className={`px-4 py-2 rounded-lg text-white text-sm font-bold uppercase shadow-lg ${
                  product.color === 'blue' ? 'bg-primary' : 
                  product.color === 'orange' ? 'bg-secondary' : 'bg-green-600'
                }`}>
                  {product.badge}
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-6">
                {product.title}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {product.desc}
              </p>

              <div className="space-y-6 mb-10">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white border-l-4 border-secondary pl-4">
                  Đặc điểm nổi bật
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {product.details?.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  )) || (
                    <li className="text-gray-500 italic">Đang cập nhật...</li>
                  )}
                </ul>
              </div>

              <div className="flex flex-wrap gap-4 mt-auto">
                <button 
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="btn btn-primary flex items-center gap-2 shadow-lg shadow-blue-900/20"
                >
                  <Phone size={18} />
                  Liên hệ báo giá
                </button>
                <a 
                  href="mailto:hoaison3108@gmail.com" 
                  className="btn bg-white text-primary border border-gray-200 hover:bg-gray-50 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600 flex items-center gap-2"
                >
                  <Mail size={18} />
                  Gửi yêu cầu
                </a>
              </div>
            </div>
          </div>

          {/* Technical Specs & Applications */}
          <div className="border-t border-gray-100 dark:border-slate-700">
            {/* Applications Section */}
            <div className="p-8 lg:p-12 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-secondary flex items-center justify-center text-sm font-bold">01</span>
                Ứng dụng thực tế
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    {product.details?.applications || "Sản phẩm được ứng dụng rộng rãi trong các công trình xây dựng dân dụng và công nghiệp."}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 h-fit">
                  <h4 className="font-bold text-primary dark:text-blue-300 mb-2 flex items-center gap-2">
                    <MapPin size={18} />
                    Phạm vi cung cấp
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Chúng tôi cung cấp và vận chuyển tận nơi tại khu vực Bình Thuận, Đồng Nai, Bà Rịa - Vũng Tàu và các tỉnh lân cận.
                  </p>
                </div>
              </div>
            </div>

            {/* Specifications Section - Grid Layout */}
            <div className="p-8 lg:p-12 bg-gray-50/50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center text-sm font-bold">02</span>
                Thông số kỹ thuật chi tiết
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {product.details?.specifications?.map((spec, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                  >
                    <h4 className="font-bold text-primary dark:text-blue-400 mb-3 text-lg border-b border-gray-100 dark:border-slate-700 pb-2">
                      {spec.label}
                    </h4>
                    <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {Array.isArray(spec.value) ? (
                        <ul className="space-y-2">
                          {spec.value.map((line, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="whitespace-pre-line">{spec.value}</span>
                      )}
                    </div>
                  </div>
                )) || <p className="text-gray-500 italic col-span-full text-center">Đang cập nhật...</p>}
              </div>
            </div>
          </div>

          {/* Back to List Button */}
          <div className="p-8 lg:p-12 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            <Link 
              to="/products" 
              className="inline-flex items-center text-primary dark:text-blue-400 font-bold hover:text-secondary transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white">
              Sản phẩm <span className="text-secondary">liên quan</span>
            </h2>
            <div className="flex gap-2">
              <button className="swiper-button-prev-related w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-primary dark:text-white hover:bg-primary hover:text-white transition-colors border border-gray-100 dark:border-slate-700">
                <ChevronLeft size={20} />
              </button>
              <button className="swiper-button-next-related w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-primary dark:text-white hover:bg-primary hover:text-white transition-colors border border-gray-100 dark:border-slate-700">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={relatedProducts.length > 3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: '.swiper-button-prev-related',
              nextEl: '.swiper-button-next-related',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-4"
          >
            {relatedProducts
              .map((relatedProduct) => (
                <SwiperSlide key={relatedProduct.id}>
                  <Link 
                    to={`/products/${relatedProduct.id}`} 
                    className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 block h-full"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={getImageUrl(relatedProduct.image)} 
                        alt={relatedProduct.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <span className={`absolute bottom-4 left-4 px-2 py-1 rounded text-white text-xs font-bold uppercase ${
                        relatedProduct.color === 'blue' ? 'bg-primary' : 
                        relatedProduct.color === 'orange' ? 'bg-secondary' : 'bg-green-600'
                      }`}>
                        {relatedProduct.badge}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {relatedProduct.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                        {relatedProduct.desc}
                      </p>
                      <span className="text-sm font-bold text-secondary uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                        Xem chi tiết <ArrowLeft size={16} className="rotate-180" />
                      </span>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>

      {/* CTA Section */}
      <section className="mt-20 py-16 bg-gradient-to-r from-primary to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bạn quan tâm đến sản phẩm này?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
            Liên hệ ngay với chúng tôi để nhận báo giá chi tiết và tư vấn kỹ thuật chuyên sâu cho công trình của bạn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setIsQuoteModalOpen(true)}
              className="btn bg-secondary text-white hover:bg-orange-600 flex items-center gap-2 shadow-xl shadow-orange-900/20 px-8 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-1"
            >
              <Phone size={20} /> Liên hệ báo giá
            </button>
            <Link 
              to="/projects" 
              className="btn bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white hover:text-primary px-8 py-3 rounded-xl font-bold transition-all"
            >
              Xem dự án đã thực hiện
            </Link>
          </div>
        </div>
      </section>
      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 transition-colors z-10"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={32} />
            </button>
            
            <div className="relative w-full max-w-5xl h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              {/* Navigation Buttons in Lightbox */}
              {(product.gallery && product.gallery.length > 1) && (
                <>
                  <button 
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button 
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              <motion.img
                key={currentImageIndex}
                src={getImageUrl(product.gallery && product.gallery.length > 0 ? product.gallery[currentImageIndex] : product.image)}
                alt="Full size product"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />

              {/* Counter in Lightbox */}
              {(product.gallery && product.gallery.length > 1) && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-white/10 px-4 py-1 rounded-full">
                  {currentImageIndex + 1} / {product.gallery.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Quote Modal */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-700/50">
                <h3 className="text-xl font-bold text-primary dark:text-white">Yêu cầu báo giá</h3>
                <button 
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8">
                {quoteStatus === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Gửi yêu cầu thành công!</h4>
                    <p className="text-gray-600 dark:text-gray-400">Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                  </div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6 border border-blue-100 dark:border-blue-800">
                      <p className="text-sm text-primary dark:text-blue-300 font-medium">Sản phẩm quan tâm:</p>
                      <p className="text-lg font-bold text-primary dark:text-white">{product.title}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Họ tên *</label>
                      <input 
                        required
                        type="text" 
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Nhập họ tên của bạn"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Số điện thoại *</label>
                        <input 
                          required
                          type="tel" 
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="Số điện thoại"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input 
                          type="email" 
                          value={quoteForm.email}
                          onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="Địa chỉ email"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Ghi chú thêm</label>
                      <textarea 
                        rows={3}
                        value={quoteForm.message}
                        onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Ví dụ: Khối lượng dự kiến, địa điểm giao hàng..."
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={quoteStatus === 'submitting'}
                      className="w-full btn btn-primary py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-900/20 disabled:opacity-50 mt-4"
                    >
                      {quoteStatus === 'submitting' ? 'Đang gửi...' : 'Gửi yêu cầu báo giá'}
                    </button>
                    
                    {quoteStatus === 'error' && (
                      <p className="text-red-500 text-center text-sm mt-2">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
