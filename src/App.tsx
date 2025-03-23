// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import StarBackground from './components/StarBackground/StarBackground';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ProfileProvider>
                <ToastProvider>
                    <BrowserRouter>
                        <Analytics />
                        <SpeedInsights />
                        <StarBackground />
                        <div className="min-h-screen flex flex-col relative">
                            <Header />
                            <main className="flex-grow">
                                <AppRoutes />
                            </main>
                            <Footer />
                        </div>
                    </BrowserRouter>
                </ToastProvider>
            </ProfileProvider>
        </AuthProvider>
    );
};

export default App;