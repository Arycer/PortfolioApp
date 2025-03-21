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

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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