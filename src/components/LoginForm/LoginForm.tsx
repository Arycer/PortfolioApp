import {FormEvent, useState} from 'react';
import {Input, Button, Panel} from '../ui/StyledComponents';

interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
    isLoading?: boolean;
}

const LoginForm = ({onSubmit, isLoading}: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(email, password);
    };

    return (
        <Panel className="w-full max-w-xl p-8 space-y-8 shadow-2xl">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-200">
                    Iniciar Sesión
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                    Accede al panel de administración
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-5">
                    <Input
                        type="email"
                        id="email"
                        label="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                    />

                    <Input
                        type="password"
                        id="password"
                        label="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>
                <div className="pt-2">
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Iniciar Sesión
                    </Button>
                </div>
            </form>
        </Panel>
    );
};

export default LoginForm;
