// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import './App.css';
import LoginPage from './pages/Login';
import PortfolioPage from './pages/Portfolio';
import AdminPage from './pages/Admin';
import ImageManager from './pages/ImageManager';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import StarBackground from './components/StarBackground/StarBackground.tsx';
import { Analytics } from "@vercel/analytics/react"

function App() {


    return (
        <AuthProvider>
            <ProfileProvider>
                <BrowserRouter>
                    <Analytics />
                    <StarBackground />
                    <div className="min-h-screen flex flex-col relative">
                        <Header />
                        <main className="flex-1 py-12 w-full">
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
                                <Route path="/" element={<PortfolioPage />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </BrowserRouter>
            </ProfileProvider>
        </AuthProvider>
    );
}

export default App;