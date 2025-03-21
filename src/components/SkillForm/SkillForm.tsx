import React, {useEffect, useState} from 'react';
import {Skill} from '../SkillGrid/SkillGrid';
import ImageUploader from '../ImageUploader/ImageUploader';
import { getImages, ImageInfo } from '../../services/storageService';

interface SkillFormProps {
    skill?: Skill;
    onSubmit: (skillData: Omit<Skill, 'id'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const SkillForm: React.FC<SkillFormProps> = ({
                                                 skill,
                                                 onSubmit,
                                                 onCancel,
                                                 isSubmitting
                                             }) => {
    const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
        name: '',
        icon: ''
    });

    // Estado para manejar la selección de imagen
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [skillImages, setSkillImages] = useState<ImageInfo[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);

    useEffect(() => {
        if (skill) {
            const {id, ...skillData} = skill;
            setFormData(skillData);
        }
    }, [skill]);

    // Cargar imágenes de habilidades
    const loadSkillImages = async () => {
        try {
            setLoadingImages(true);
            const images = await getImages('skills');
            setSkillImages(images);
        } catch (error) {
            console.error('Error al cargar imágenes de habilidades:', error);
        } finally {
            setLoadingImages(false);
        }
    };

    // Cargar imágenes cuando se abre el selector
    useEffect(() => {
        if (showImageSelector) {
            loadSkillImages();
        }
    }, [showImageSelector]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    // Manejar la subida exitosa de una imagen
    const handleSkillIconUpload = (imageUrl: string) => {
        setFormData(prev => ({
            ...prev,
            icon: imageUrl
        }));
        setShowImageSelector(false);
    };

    // Seleccionar una imagen existente
    const handleSelectImage = (image: ImageInfo) => {
        setFormData(prev => ({
            ...prev,
            icon: image.url
        }));
        setShowImageSelector(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                    Nombre
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                />
            </div>

            {/* Sección de icono de la habilidad */}
            <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/40 shadow-md">
                <label className="block text-sm font-medium text-white mb-3">
                    Icono de la Habilidad
                </label>
                
                <div className="flex flex-col space-y-4">
                    {formData.icon ? (
                        <div className="relative flex justify-center">
                            <div className="w-24 h-24 relative">
                                <img 
                                    src={formData.icon} 
                                    alt="Icono de la habilidad" 
                                    className="w-full h-full object-contain rounded-lg border-2 border-indigo-500/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, icon: '' }))}
                                    className="absolute -top-2 -right-2 bg-red-600/80 hover:bg-red-600 p-1.5 rounded-full transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 px-6 bg-slate-800/40 rounded-lg border border-slate-700/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-slate-400">No has seleccionado ningún icono</p>
                        </div>
                    )}
                    
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            type="button"
                            onClick={() => setShowImageSelector(true)}
                            className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 rounded-md text-white text-sm transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Seleccionar Icono
                        </button>
                    </div>
                </div>
                
                {/* Modal selector de imágenes */}
                {showImageSelector && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                            <div className="p-5 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
                                <h3 className="text-lg font-medium text-white">Seleccionar Icono de Habilidad</h3>
                                <button 
                                    type="button" 
                                    onClick={() => setShowImageSelector(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="p-5">
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-white mb-3">Subir Nuevo Icono</h4>
                                    <ImageUploader 
                                        onUploadSuccess={handleSkillIconUpload}
                                        folder="skills"
                                        maxSizeMB={10}
                                    />
                                </div>
                                
                                <div>
                                    <h4 className="text-sm font-medium text-white mb-3">Iconos Disponibles</h4>
                                    
                                    {loadingImages ? (
                                        <div className="text-center py-8">
                                            <p className="text-slate-400">Cargando iconos...</p>
                                        </div>
                                    ) : skillImages.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {skillImages.map(image => (
                                                <div key={image.id} onClick={() => handleSelectImage(image)} className="cursor-pointer transition-transform hover:scale-105 flex items-center justify-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-indigo-500">
                                                    <img 
                                                        src={image.url} 
                                                        alt={image.name} 
                                                        className="w-16 h-16 object-contain"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 px-6 bg-slate-800/40 rounded-lg border border-slate-700/50">
                                            <p className="text-slate-400">No hay iconos disponibles en la carpeta de habilidades</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
                    {isSubmitting ? 'Guardando...' : skill ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default SkillForm; 