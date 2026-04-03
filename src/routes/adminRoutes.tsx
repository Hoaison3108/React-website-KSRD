import React, { lazy, Suspense } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
import PageLoader from '../components/PageLoader';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/admin/Login';

// Admin Pages
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('../pages/admin/ProductsManager'));
const AdminProjects = lazy(() => import('../pages/admin/ProjectsManager'));
const AdminNews = lazy(() => import('../pages/admin/NewsManager'));
const AdminMessages = lazy(() => import('../pages/admin/Messages'));
const AdminRecruitment = lazy(() => import('../pages/admin/RecruitmentManager'));
const AdminContact = lazy(() => import('../pages/admin/ContactManager'));
const AdminSettings = lazy(() => import('../pages/admin/Settings'));
const AdminUsers = lazy(() => import('../pages/admin/UserManager'));
const MediaManager = lazy(() => import('../pages/admin/MediaManager'));

export const adminRoutes = (
  <React.Fragment>
    <Route path="/management/login" element={<Login />} />
    <Route path="/management" element={
      <ProtectedRoute>
        <AuthProvider>
          <AdminLayout />
        </AuthProvider>
      </ProtectedRoute>
    }>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
      <Route path="products" element={<Suspense fallback={<PageLoader />}><AdminProducts /></Suspense>} />
      <Route path="projects" element={<Suspense fallback={<PageLoader />}><AdminProjects /></Suspense>} />
      <Route path="news" element={<Suspense fallback={<PageLoader />}><AdminNews /></Suspense>} />
      <Route path="messages" element={<Suspense fallback={<PageLoader />}><AdminMessages /></Suspense>} />
      <Route path="recruitment" element={<Suspense fallback={<PageLoader />}><AdminRecruitment /></Suspense>} />
      <Route path="contact" element={<Suspense fallback={<PageLoader />}><AdminContact /></Suspense>} />
      <Route path="settings" element={<Suspense fallback={<PageLoader />}><AdminSettings /></Suspense>} />
      <Route path="users" element={<Suspense fallback={<PageLoader />}><AdminUsers /></Suspense>} />
      <Route path="media" element={<Suspense fallback={<PageLoader />}><MediaManager /></Suspense>} />
    </Route>
  </React.Fragment>
);
