import React, {useState} from 'react';
import {SocialLink} from '../../types';
import {sendContactMessage} from '../../services/mailService';
import {Input, Textarea, Button, Alert} from '../ui/StyledComponents';

interface ContactSectionProps {
    socialLinks: SocialLink[];
    contactEmail?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({socialLinks, contactEmail}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            await sendContactMessage(name, email, message);
            setSubmitStatus('success');
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setSubmitStatus('error');
            setErrorMessage('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitStatus('idle'), 3000);
        }
    };

    return (
        <section className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                        Contacto
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        ¿Tienes alguna pregunta o propuesta? No dudes en contactarme.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Formulario de contacto */}
                    <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                id="name"
                                label="Nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tu nombre"
                                required
                            />

                            <Input
                                id="email"
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                            />

                            <Textarea
                                id="message"
                                label="Mensaje"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tu mensaje..."
                                required
                                rows={4}
                            />

                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                Enviar mensaje
                            </Button>

                            {submitStatus === 'success' && (
                                <Alert variant="success">
                                    Mensaje enviado correctamente.
                                </Alert>
                            )}

                            {submitStatus === 'error' && (
                                <Alert variant="error">
                                    {errorMessage}
                                </Alert>
                            )}
                        </form>
                    </div>

                    {/* Redes sociales y información adicional */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-slate-200 mb-4">
                                Sígueme en redes sociales
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {socialLinks.map((link, index) => (
                                    <a
                                        key={link.id || `contact-social-link-${index}`}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-700 transition-all duration-300"
                                    >
                                        <img
                                            src={link.icon}
                                            alt={link.name}
                                            className="w-5 h-5"
                                        />
                                        <span className="text-slate-300 hover:text-white">
                                            {link.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-slate-200 mb-4">
                                Información adicional
                            </h3>
                            <p className="text-slate-400 mb-4">
                                También puedes contactarme directamente por correo electrónico o a través de mis redes
                                sociales.
                                Responderé lo antes posible.
                            </p>
                            {contactEmail && (
                                <div
                                    className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                    <a href={`mailto:${contactEmail}`}
                                       className="text-indigo-400 hover:text-indigo-300 transition-colors">
                                        {contactEmail}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection; 