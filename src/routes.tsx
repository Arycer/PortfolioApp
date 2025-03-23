import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Lazy loading de las páginas
const LoginPage = lazy(() => import('./pages/Login'));
const AdminPage = lazy(() => import('./pages/Admin'));
const ImageManager = lazy(() => import('./pages/ImageManager'));
const StyleGuide = lazy(() => import('./pages/StyleGuide'));
const PortfolioPage = lazy(() => import('./pages/Portfolio'));

// Componente de carga con fallback personalizado
const LazyRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => (
    <Suspense fallback={<LoadingSpinner />}>
        {element}
    </Suspense>
);

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route 
                path="/login" 
                element={<LazyRoute element={<LoginPage />} />} 
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <LazyRoute element={<AdminPage />} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/images"
                element={
                    <ProtectedRoute>
                        <LazyRoute element={<ImageManager />} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/styleguide"
                element={
                    <ProtectedRoute>
                        <LazyRoute element={<StyleGuide />} />
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/" 
                element={<LazyRoute element={<PortfolioPage />} />} 
            />
        </Routes>
    );
};

export default AppRoutes; 