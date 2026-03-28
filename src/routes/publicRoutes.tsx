import React, { lazy, Suspense } from 'react';
import { Route, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import PageLoader from '../components/PageLoader';

// Lazy load pages for better initial performance
const Home = lazy(() => import('../pages/Home'));
const AboutPage = lazy(() => import('../pages/About'));
const ProductsPage = lazy(() => import('../pages/Products'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const ProjectsPage = lazy(() => import('../pages/Projects'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetail'));
const NewsPage = lazy(() => import('../pages/News'));
const NewsDetail = lazy(() => import('../pages/NewsDetail'));
const ContactPage = lazy(() => import('../pages/Contact'));
const RecruitmentPage = lazy(() => import('../pages/Recruitment'));
const RecruitmentDetail = lazy(() => import('../pages/RecruitmentDetail'));
const GalleryPage = lazy(() => import('../pages/Gallery'));
const NotFound = lazy(() => import('../pages/NotFound'));

const MainLayout = () => (
  <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 font-sans transition-colors duration-300 flex flex-col">
    <Navbar />
    <main className="grow">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
    <BackToTop />
  </div>
);

export const publicRoutes = (
  <Route path="/" element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="products" element={<ProductsPage />} />
    <Route path="products/:id" element={<ProductDetail />} />
    <Route path="projects" element={<ProjectsPage />} />
    <Route path="projects/:id" element={<ProjectDetailPage />} />
    <Route path="news" element={<NewsPage />} />
    <Route path="news/:id" element={<NewsDetail />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="recruitment" element={<RecruitmentPage />} />
    <Route path="recruitment/:id" element={<RecruitmentDetail />} />
    <Route path="gallery" element={<GalleryPage />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);
