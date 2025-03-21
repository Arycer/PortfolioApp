import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import {useAuth} from '../../context/AuthContext';
import {Alert} from '../../components/ui/StyledComponents';

const LoginPage = () => {
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {signIn, user} = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/admin');
        }
    }, [user, navigate]);

    const handleLogin = async (email: string, password: string) => {
        try {
            setError('');
            setIsLoading(true);
            await signIn(email, password);
            navigate('/admin');
        } catch (error) {
            setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 w-full flex items-center justify-center px-4">
            <div className="w-full">
                {error && (
                    <div className="max-w-xl mx-auto mb-4">
                        <Alert variant="error">{error}</Alert>
                    </div>
                )}
                <div className="flex justify-center">
                    <LoginForm onSubmit={handleLogin} isLoading={isLoading}/>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
