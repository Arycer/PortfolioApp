import React, {useEffect, useState} from 'react';
import {Skill} from '../SkillGrid/SkillGrid';
import Modal from '../Modal/Modal';
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
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (skill) {
            const {id, ...skillData} = skill;
            setFormData(skillData);
        }
    }, [skill]);

    // Cargar imágenes cuando se abre el selector
    const loadImages = async () => {
        setIsLoadingImages(true);
        setImageError(null);
        
        try {
            const imagesList = await getImages('images'); // Usar la carpeta general de imágenes
            // Ordenar por fecha más reciente primero
            imagesList.sort((a, b) => 
                b.createdAt.getTime() - a.createdAt.getTime()
            );
            setImages(imagesList);
        } catch (err) {
            console.error('Error al cargar imágenes:', err);
            setImageError('No se pudieron cargar las imágenes. Inténtalo de nuevo.');
        } finally {
            setIsLoadingImages(false);
        }
    };

    const handleOpenImageSelector = () => {
        setShowImageSelector(true);
        loadImages();
    };

    const handleSelectImage = (image: ImageInfo) => {
        setFormData(prev => ({...prev, icon: image.url}));
        setShowImageSelector(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    // Filtrar imágenes por término de búsqueda
    const filteredImages = images.filter(image => 
        image.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
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
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Icono
                    </label>
                    <div className="flex items-center space-x-4">
                        {formData.icon && (
                            <div className="w-16 h-16 bg-slate-800/50 rounded-lg overflow-hidden flex items-center justify-center">
                                <img
                                    src={formData.icon}
                                    alt="Icono preview"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={handleOpenImageSelector}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors duration-150"
                                >
                                    {formData.icon ? 'Cambiar icono' : 'Seleccionar icono'}
                                </button>
                                {formData.icon && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({...prev, icon: ''}))}
                                        className="px-4 py-2 text-sm font-medium text-red-400 bg-red-900/30 hover:bg-red-900/50 rounded-lg transition-colors duration-150"
                                    >
                                        Quitar
                                    </button>
                                )}
                            </div>
                            {formData.icon && (
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        readOnly
                                        className="w-full px-3 py-2 text-xs bg-slate-800/50 border border-slate-700 rounded text-slate-400 overflow-hidden"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
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

            {/* Modal para seleccionar imagen */}
            <Modal
                isOpen={showImageSelector}
                onClose={() => setShowImageSelector(false)}
                title="Seleccionar icono"
            >
                <div className="space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar imágenes..."
                            className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-slate-400 absolute right-3 top-2.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    {imageError && (
                        <div className="bg-red-600/20 border border-red-600/40 text-red-400 px-4 py-3 rounded-lg flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {imageError}
                        </div>
                    )}

                    {isLoadingImages ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, index) => (
                                <div 
                                    key={index} 
                                    className="bg-slate-800/30 border border-slate-700/40 rounded-lg overflow-hidden shadow-md animate-pulse h-40"
                                >
                                    <div className="h-32 bg-slate-700/50"></div>
                                    <div className="p-2">
                                        <div className="h-3 bg-slate-700/50 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredImages.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                            {filteredImages.map(image => (
                                <div
                                    key={image.id}
                                    onClick={() => handleSelectImage(image)}
                                    className="bg-slate-800/30 border border-slate-700/40 hover:border-indigo-500/50 rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                                >
                                    <div className="h-32 bg-slate-900/50 flex items-center justify-center">
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                    <div className="p-2">
                                        <div className="text-xs text-slate-300 truncate" title={image.name}>
                                            {image.name}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-slate-800/20 border border-slate-700/40 rounded-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-slate-600 mx-auto mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <h3 className="text-lg font-medium text-slate-300">No hay imágenes</h3>
                            <p className="text-slate-400 mt-2">
                                {searchTerm
                                    ? `No se encontraron imágenes que coincidan con "${searchTerm}"`
                                    : `No hay imágenes disponibles en la galería`}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowImageSelector(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-150"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SkillForm; 