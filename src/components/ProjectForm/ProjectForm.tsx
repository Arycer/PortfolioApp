import React, {useEffect, useState} from 'react';
import {Project, ImageInfo} from '../../types';
import ImageUploader from '../ImageUploader/ImageUploader';
import {getImages} from '../../services/storageService';

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

    // Estado para manejar la selección de imagen
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [projectImages, setProjectImages] = useState<ImageInfo[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);

    useEffect(() => {
        if (project) {
            const {id, ...projectData} = project;
            setFormData(projectData);
        }
    }, [project]);

    // Cargar imágenes de proyectos
    const loadProjectImages = async () => {
        try {
            setLoadingImages(true);
            const images = await getImages('projects');
            setProjectImages(images);
        } catch (error) {
            console.error('Error al cargar imágenes de proyectos:', error);
        } finally {
            setLoadingImages(false);
        }
    };

    // Cargar imágenes cuando se abre el selector
    useEffect(() => {
        if (showImageSelector) {
            loadProjectImages();
        }
    }, [showImageSelector]);

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

    // Manejar la subida exitosa de una imagen
    const handleProjectImageUpload = (imageUrl: string) => {
        setFormData(prev => ({
            ...prev,
            image: imageUrl
        }));
        setShowImageSelector(false);
    };

    // Seleccionar una imagen existente
    const handleSelectImage = (image: ImageInfo) => {
        setFormData(prev => ({
            ...prev,
            image: image.url
        }));
        setShowImageSelector(false);
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

            {/* Sección de imagen del proyecto */}
            <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/40 shadow-md">
                <label className="block text-sm font-medium text-white mb-3">
                    Imagen del Proyecto
                </label>

                <div className="flex flex-col space-y-4">
                    {formData.image ? (
                        <div className="relative">
                            <img
                                src={formData.image}
                                alt="Imagen del proyecto"
                                className="w-full h-56 object-contain rounded-lg border-2 border-indigo-500/30 bg-slate-900/50"
                            />
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({...prev, image: ''}))}
                                className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 p-1.5 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-8 px-6 bg-slate-800/40 rounded-lg border border-slate-700/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 mx-auto mb-2"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <p className="text-slate-400">No has seleccionado ninguna imagen</p>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            type="button"
                            onClick={() => setShowImageSelector(true)}
                            className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 rounded-md text-white text-sm transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Seleccionar Imagen
                        </button>
                    </div>
                </div>

                {/* Modal selector de imágenes */}
                {showImageSelector && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                            <div
                                className="p-5 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
                                <h3 className="text-lg font-medium text-white">Seleccionar Imagen del Proyecto</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowImageSelector(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>

                            <div className="p-5">
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-white mb-3">Subir Nueva Imagen</h4>
                                    <ImageUploader
                                        onUploadSuccess={handleProjectImageUpload}
                                        folder="projects"
                                        maxSizeMB={10}
                                    />
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-white mb-3">Imágenes Disponibles</h4>

                                    {loadingImages ? (
                                        <div className="text-center py-8">
                                            <p className="text-slate-400">Cargando imágenes...</p>
                                        </div>
                                    ) : projectImages.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {projectImages.map(image => (
                                                <div key={image.id} onClick={() => handleSelectImage(image)}
                                                     className="cursor-pointer transition-transform hover:scale-105">
                                                    <img
                                                        src={image.url}
                                                        alt={image.name}
                                                        className="w-full h-40 object-cover rounded-lg border border-slate-700 hover:border-indigo-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div
                                            className="text-center py-8 px-6 bg-slate-800/40 rounded-lg border border-slate-700/50">
                                            <p className="text-slate-400">No hay imágenes disponibles en la carpeta de
                                                proyectos</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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