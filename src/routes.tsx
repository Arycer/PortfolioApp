import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import AdminPage from './pages/Admin';
import ImageManager from './pages/ImageManager';
import StyleGuide from './pages/StyleGuide';
import PortfolioPage from './pages/Portfolio';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/images"
                element={
                    <ProtectedRoute>
                        <ImageManager />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/styleguide"
                element={
                    <ProtectedRoute>
                        <StyleGuide />
                    </ProtectedRoute>
                }
            />
            <Route path="/" element={<PortfolioPage />} />
        </Routes>
    );
};

export default AppRoutes; 