// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import './App.css';
import LoginPage from './pages/Login';
import PortfolioPage from './pages/Portfolio';
import AdminPage from './pages/Admin';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import StarBackground from './components/StarBackground/StarBackground.tsx';
import { useEffect } from 'react';

function App() {
    // Verificar que el componente se carga correctamente
    useEffect(() => {
        console.log("App component mounted");
    }, []);

    return (
        <AuthProvider>
            <BrowserRouter>
                <StarBackground />
                <div className="min-h-screen flex flex-col relative">
                    <Header />
                    <main className="flex-1 py-12">
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
                            <Route path="/" element={<PortfolioPage />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;