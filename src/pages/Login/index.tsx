import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const { signIn, user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/admin');
        }
    }, [user, navigate]);

    const handleLogin = async (email: string, password: string) => {
        try {
            setError('');
            await signIn(email, password);
            navigate('/admin');
        } catch (error) {
            setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="flex-1 w-full flex items-center justify-center px-4">
            <div className="w-full">
                {error && (
                    <div className="max-w-xl mx-auto mb-4 p-4 text-sm text-red-400 bg-red-900/50 rounded-lg border border-red-800/50" role="alert">
                        {error}
                    </div>
                )}
                <div className="flex justify-center">
                    <LoginForm onSubmit={handleLogin} />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
