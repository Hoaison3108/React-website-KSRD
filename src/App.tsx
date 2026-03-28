/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import { adminRoutes } from './routes/adminRoutes';
import { publicRoutes } from './routes/publicRoutes';

export default function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <ErrorBoundary>
          <Router>
            <ScrollToTop />
            <Routes>
              {adminRoutes}
              {publicRoutes}
            </Routes>
          </Router>
        </ErrorBoundary>
      </ToastProvider>
    </HelmetProvider>
  );
}
