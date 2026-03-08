/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import PageLoader from './components/PageLoader';
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/admin/Login';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for better initial performance
const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/About'));
const ProductsPage = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const ProjectsPage = lazy(() => import('./pages/Projects'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetail'));
const NewsPage = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const ContactPage = lazy(() => import('./pages/Contact'));
const RecruitmentPage = lazy(() => import('./pages/Recruitment'));
const RecruitmentDetail = lazy(() => import('./pages/RecruitmentDetail'));
const GalleryPage = lazy(() => import('./pages/Gallery'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/ProductsManager'));
const AdminProjects = lazy(() => import('./pages/admin/ProjectsManager'));
const AdminNews = lazy(() => import('./pages/admin/NewsManager'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));
const AdminRecruitment = lazy(() => import('./pages/admin/RecruitmentManager'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));

const MainLayout = () => (
  <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 font-sans transition-colors duration-300 flex flex-col">
    <Navbar />
    <main className="flex-grow">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
    <BackToTop />
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={
            <AuthProvider>
              <AdminLayout />
            </AuthProvider>
          }>
            <Route path="dashboard" element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="products" element={
              <Suspense fallback={<PageLoader />}>
                <AdminProducts />
              </Suspense>
            } />
            <Route path="projects" element={
              <Suspense fallback={<PageLoader />}>
                <AdminProjects />
              </Suspense>
            } />
            <Route path="news" element={
              <Suspense fallback={<PageLoader />}>
                <AdminNews />
              </Suspense>
            } />
            <Route path="messages" element={
              <Suspense fallback={<PageLoader />}>
                <AdminMessages />
              </Suspense>
            } />
            <Route path="recruitment" element={
              <Suspense fallback={<PageLoader />}>
                <AdminRecruitment />
              </Suspense>
            } />
            <Route path="settings" element={
              <Suspense fallback={<PageLoader />}>
                <AdminSettings />
              </Suspense>
            } />
          </Route>

          {/* Public Routes */}
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
        </Routes>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
