import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import SEO from '../components/SEO';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { news as localNews } from '../data/news';

import 'swiper/css';
import 'swiper/css/navigation';

interface NewsItem {
  id: string | number;
  title: string;
  date: string;
  displayDate: string;
  image: string;
  excerpt: string;
  content?: string[];
  detailImages?: string[];
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchNews = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Try fetching from Firestore first
        const docRef = doc(db, 'news', id);
        const docSnap = await getDoc(docRef);

        let fetchedNews: NewsItem | null = null;

        if (docSnap.exists()) {
          const data = docSnap.data();
          const dateObj = new Date(data.date);
          const displayDate = `${dateObj.getDate()} Th${dateObj.getMonth() + 1}`;

          fetchedNews = {
            id: docSnap.id,
            title: data.title,
            date: data.date,
            displayDate: displayDate,
            image: data.image,
            excerpt: data.summary || data.title,
            content: Array.isArray(data.content) ? data.content : (data.content ? [data.content] : []),
            detailImages: data.detailImages || []
          };
        } else {
          // Fallback to local data
          const local = localNews.find(n => n.id.toString() === id);
          if (local) {
            fetchedNews = {
              ...local,
              id: local.id.toString()
            } as any;
          }
        }

        if (fetchedNews) {
          setNewsItem(fetchedNews);

          // Fetch related news
          const newsRef = collection(db, 'news');
          const q = query(newsRef, limit(4));
          const querySnapshot = await getDocs(q);
          const relatedFromFirestore = querySnapshot.docs
            .map(d => {
              const dData = d.data();
              const dDateObj = new Date(dData.date);
              const dDisplayDate = `${dDateObj.getDate()} Th${dDateObj.getMonth() + 1}`;
              return {
                id: d.id,
                title: dData.title,
                date: dData.date,
                displayDate: dDisplayDate,
                image: dData.image,
                excerpt: dData.summary || dData.title,
                content: Array.isArray(dData.content) ? dData.content : (dData.content ? [dData.content] : []),
              } as NewsItem;
            })
            .filter(n => n.id !== id);
          
          // Combine with local news for "Related News"
          const combinedRelated = [...relatedFromFirestore];
          localNews.forEach(ln => {
            if (ln.id.toString() !== id && !combinedRelated.find(cr => cr.title === ln.title)) {
              combinedRelated.push({ ...ln, id: ln.id.toString() } as any);
            }
          });

          setRelatedNews(combinedRelated.slice(0, 4));
        } else {
          setNewsItem(null);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        // Fallback to local data on error
        const local = localNews.find(n => n.id.toString() === id);
        if (local) {
          setNewsItem({ ...local, id: local.id.toString() } as any);
          setRelatedNews(localNews.filter(n => n.id.toString() !== id).slice(0, 4) as any);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const getImageUrl = (image: any) => {
    if (typeof image === 'string') return image;
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h2>
        <Link to="/news" className="text-primary hover:underline flex items-center">
          <ArrowLeft size={20} className="mr-2" /> Quay lại trang tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[72px] pb-20 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <SEO 
        title={newsItem.title} 
        description={newsItem.excerpt}
      />
      <Breadcrumb customLastSegment={newsItem.title} />
      
      <div className="container-custom mt-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
          <div className="relative h-[400px]">
            <img 
              src={getImageUrl(newsItem.image)} 
              alt={newsItem.title} 
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <div className="flex items-center gap-4 mb-4 text-sm font-medium">
                <span className="bg-primary px-3 py-1 rounded text-xs font-bold uppercase">
                  {newsItem.displayDate}
                </span>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>Admin</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {newsItem.title}
              </h1>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium mb-8 leading-relaxed border-l-4 border-secondary pl-6 italic">
              {newsItem.excerpt}
            </p>
            
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              {newsItem.content ? (
                newsItem.content.map((paragraph, index) => (
                  <React.Fragment key={index}>
                    <p className="mb-6 text-justify">{paragraph}</p>
                    {newsItem.detailImages && newsItem.detailImages[index] && (
                      <figure className="mb-8">
                        <img 
                          src={getImageUrl(newsItem.detailImages[index])} 
                          alt={`Chi tiết ${index + 1}`} 
                          className="w-full rounded-xl shadow-lg object-cover max-h-[500px]"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                          Hình ảnh minh họa: {newsItem.title}
                        </figcaption>
                      </figure>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <>
                  <p>
                    Nội dung chi tiết đang được cập nhật. Vui lòng quay lại sau.
                  </p>
                </>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-slate-700">
              <Link 
                to="/news" 
                className="inline-flex items-center text-primary dark:text-blue-400 font-bold hover:text-secondary transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách tin tức
              </Link>
            </div>
          </div>
        </div>

        {/* Related News Swiper */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white">
              Tin tức <span className="text-secondary">liên quan</span>
            </h2>
            <div className="flex gap-2">
              <button className="swiper-button-prev-news w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-primary dark:text-white hover:bg-primary hover:text-white transition-colors border border-gray-100 dark:border-slate-700">
                <ChevronLeft size={20} />
              </button>
              <button className="swiper-button-next-news w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-primary dark:text-white hover:bg-primary hover:text-white transition-colors border border-gray-100 dark:border-slate-700">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={relatedNews.length > 3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: '.swiper-button-prev-news',
              nextEl: '.swiper-button-next-news',
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
            {relatedNews.map((item) => (
              <SwiperSlide key={item.id}>
                <Link 
                  to={`/news/${item.id}`} 
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full block"
                >
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded text-xs font-bold uppercase shadow-md">
                      {item.displayDate}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug line-clamp-2 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                      {item.excerpt}
                    </p>
                    <span className="mt-auto inline-flex items-center text-xs font-bold text-secondary uppercase group-hover:translate-x-1 transition-transform self-start">
                      XEM CHI TIẾT <ArrowRight size={14} className="ml-2" />
                    </span>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
