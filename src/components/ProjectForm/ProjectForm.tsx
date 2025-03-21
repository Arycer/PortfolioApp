import React, {useEffect, useState} from 'react';
import {Project} from '../ProjectCard/ProjectCard';

interface ProjectFormProps {
    project?: Project;
    onSubmit: (project: Omit<Project, 'id'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
                                                     project,
                                                     onSubmit,
                                                     onCancel,
                                                     isSubmitting
                                                 }) => {
    const [formData, setFormData] = useState<Omit<Project, 'id'>>({
        title: '',
        description: '',
        image: '',
        link: '',
        buttonText: '',
        detailedDescription: '',
        technologies: [],
        githubUrl: ''
    });
    
    const [newTechnology, setNewTechnology] = useState('');

    useEffect(() => {
        if (project) {
            const {id, ...projectData} = project;
            setFormData(projectData);
        }
    }, [project]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleAddTechnology = () => {
        if (newTechnology.trim()) {
            setFormData(prev => ({
                ...prev,
                technologies: [...(prev.technologies || []), newTechnology.trim()]
            }));
            setNewTechnology('');
        }
    };

    const handleRemoveTechnology = (index: number) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies?.filter((_, i) => i !== index) || []
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}
              className="space-y-6 bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-300">
                    Título
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                    Descripción breve
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label htmlFor="detailedDescription" className="block text-sm font-medium text-slate-300">
                    Descripción detallada
                </label>
                <textarea
                    id="detailedDescription"
                    name="detailedDescription"
                    value={formData.detailedDescription || ''}
                    onChange={handleChange}
                    rows={6}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tecnologías utilizadas
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {formData.technologies && formData.technologies.map((tech, index) => (
                        <div 
                            key={index} 
                            className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700/50 text-indigo-200"
                        >
                            <span>{tech}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveTechnology(index)}
                                className="text-indigo-400 hover:text-white"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Añadir tecnología"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                    />
                    <button
                        type="button"
                        onClick={handleAddTechnology}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600/50 hover:bg-indigo-600 rounded-lg transition-colors duration-150"
                    >
                        Añadir
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-medium text-slate-300">
                    URL de la imagen
                </label>
                <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-300">
                    URL del repositorio en GitHub (opcional)
                </label>
                <input
                    type="url"
                    id="githubUrl"
                    name="githubUrl"
                    value={formData.githubUrl || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://github.com/usuario/proyecto"
                />
            </div>

            <div>
                <label htmlFor="link" className="block text-sm font-medium text-slate-300">
                    URL del proyecto (opcional)
                </label>
                <input
                    type="url"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            <div>
                <label htmlFor="buttonText" className="block text-sm font-medium text-slate-300">
                    Texto del botón (opcional)
                </label>
                <input
                    type="text"
                    id="buttonText"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ver proyecto"
                />
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
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Guardando...' : project ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default ProjectForm; 