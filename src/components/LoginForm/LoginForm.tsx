import { useState, FormEvent } from 'react';

interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(email, password);
    };

    return (
        <div className="w-full max-w-xl p-8 space-y-8 bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 shadow-2xl">
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
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                            Correo Electrónico
                        </label>
                        <div className="mt-1">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                            Contraseña
                        </label>
                        <div className="mt-1">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-2">
                    <button
                        type="submit"
                        className="relative w-full px-4 py-3 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg transition-colors duration-150 ease-in-out"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
