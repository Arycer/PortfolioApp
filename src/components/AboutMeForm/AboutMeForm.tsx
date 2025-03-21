import React, {useEffect, useState} from 'react';
import {AboutMeData, SocialLink} from '../AboutMe/AboutMe';

interface AboutMeFormProps {
    data?: AboutMeData;
    onSubmit: (data: Omit<AboutMeData, 'id'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const AboutMeForm: React.FC<AboutMeFormProps> = ({
                                                     data,
                                                     onSubmit,
                                                     onCancel,
                                                     isSubmitting
                                                 }) => {
    const [formData, setFormData] = useState<Omit<AboutMeData, 'id'>>({
        greeting: '',
        description: '',
        socialLinks: [],
        contactEmail: ''
    });

    const [newSocialLink, setNewSocialLink] = useState<Omit<SocialLink, 'id'>>({
        name: '',
        url: '',
        icon: ''
    });

    useEffect(() => {
        if (data) {
            const {id, ...aboutData} = data;
            setFormData(aboutData);
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setNewSocialLink(prev => ({...prev, [name]: value}));
    };

    const handleAddSocialLink = () => {
        if (newSocialLink.name && newSocialLink.url && newSocialLink.icon) {
            setFormData(prev => ({
                ...prev,
                socialLinks: [...prev.socialLinks, newSocialLink]
            }));
            setNewSocialLink({name: '', url: '', icon: ''});
        }
    };

    const handleRemoveSocialLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="greeting" className="block text-sm font-medium text-slate-300">
                    Saludo
                </label>
                <input
                    type="text"
                    id="greeting"
                    name="greeting"
                    value={formData.greeting}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                    Descripción
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    required
                />
            </div>

            <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-300">
                    Correo de Contacto
                </label>
                <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="tu@email.com"
                />
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">
                    Redes Sociales
                </label>

                {/* Lista de redes sociales */}
                <div className="space-y-3">
                    {formData.socialLinks.map((link, index) => (
                        <div key={index}
                             className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <img src={link.icon} alt={link.name} className="w-5 h-5"/>
                            <div className="flex-1">
                                <div className="font-medium text-slate-200">{link.name}</div>
                                <div className="text-sm text-slate-400">{link.url}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveSocialLink(index)}
                                className="px-2 py-1 text-sm text-red-400 hover:text-white bg-red-900/30 hover:bg-red-900/50 rounded transition-colors duration-150"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>

                {/* Formulario para agregar nueva red social */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={newSocialLink.name}
                            onChange={handleSocialLinkChange}
                            placeholder="Nombre"
                            className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <input
                            type="url"
                            name="url"
                            value={newSocialLink.url}
                            onChange={handleSocialLinkChange}
                            placeholder="URL"
                            className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <input
                            type="url"
                            name="icon"
                            value={newSocialLink.icon}
                            onChange={handleSocialLinkChange}
                            placeholder="URL del ícono"
                            className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600/50 hover:bg-indigo-600 rounded-lg transition-colors duration-150"
                >
                    Agregar Red Social
                </button>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-150"
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Guardando...' : data ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default AboutMeForm; 