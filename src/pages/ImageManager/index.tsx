import React, {useState, useEffect, useCallback} from 'react';
import {getImages, deleteImage, uploadImageFromURL} from '../../services/storageService';
import {ImageInfo} from '../../types';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import {useToast} from '../../context/ToastContext';

const ImageManager: React.FC = () => {
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFolder, setActiveFolder] = useState<string>('images');
    const [searchTerm, setSearchTerm] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isUploadingUrl, setIsUploadingUrl] = useState(false);

    const {showToast} = useToast();

    const folders = [
        {id: 'images', name: 'General'},
        {id: 'projects', name: 'Proyectos'},
        {id: 'skills', name: 'Habilidades'},
        {id: 'profile', name: 'Perfil'}
    ];

    const loadImages = useCallback(async () => {
        setIsLoading(true);

        try {
            const imagesList = await getImages(activeFolder);
            // Ordenar por fecha más reciente primero
            imagesList.sort((a, b) =>
                b.createdAt.getTime() - a.createdAt.getTime()
            );
            setImages(imagesList);
        } catch (err) {
            console.error('Error al cargar imágenes:', err);
            showToast('Error al cargar las imágenes', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [activeFolder, showToast]);

    useEffect(() => {
        loadImages();
    }, [loadImages]);

    const handleUploadSuccess = () => {
        showToast('Imagen subida correctamente', 'success');
        loadImages(); // Recargar las imágenes después de una carga exitosa
    };

    // Manejar la subida de imagen desde URL
    const handleUploadFromUrl = async () => {
        if (!imageUrl.trim()) return;

        setIsUploadingUrl(true);
        try {
            await uploadImageFromURL(imageUrl, activeFolder);
            setImageUrl('');
            handleUploadSuccess();
        } catch (err) {
            console.error('Error al subir imagen desde URL:', err);
            showToast('No se pudo subir la imagen desde URL. Verifica que la URL sea válida y accesible.', 'error');
        } finally {
            setIsUploadingUrl(false);
        }
    };

    const handleDeleteImage = async (image: ImageInfo) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${image.name}"?`)) {
            try {
                await deleteImage(image.path);
                setImages(prevImages => prevImages.filter(img => img.id !== image.id));
                showToast('Imagen eliminada correctamente', 'success');
            } catch (err) {
                console.error('Error al eliminar la imagen:', err);
                showToast('Error al eliminar la imagen', 'error');
            }
        }
    };

    const handleFolderChange = (folder: string) => {
        setActiveFolder(folder);
        setSearchTerm('');
    };

    const filteredImages = images.filter(image =>
        image.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Función para formatear el tamaño de la imagen
    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return 'N/A';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    const handleCopyUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            showToast('URL copiada al portapapeles', 'success');
        } catch (err) {
            console.error('Error al copiar la URL:', err);
            showToast('Error al copiar la URL', 'error');
        }
    };

    return (
        <div className="py-8 px-4 md:px-8 w-full mx-auto">
            <div
                className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gestor de Imágenes</h1>
                    <p className="text-slate-400 mt-1">
                        Administra todas las imágenes de tu portafolio
                    </p>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar imágenes..."
                        className="w-full md:w-64 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
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
            </div>

            {/* Pestañas de carpetas */}
            <div className="flex overflow-x-auto whitespace-nowrap border-b border-slate-700 mb-6 pb-1 hide-scrollbar">
                {folders.map(folder => (
                    <button
                        key={folder.id}
                        onClick={() => handleFolderChange(folder.id)}
                        className={`px-4 py-2 mr-2 text-sm font-medium transition-colors ${
                            activeFolder === folder.id
                                ? 'text-indigo-400 border-b-2 border-indigo-400'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        {folder.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Sección para subir imágenes desde el dispositivo */}
                <div className="bg-slate-800/20 border border-slate-700/40 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-medium text-white mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                        </svg>
                        Subir imagen desde dispositivo
                    </h2>
                    <ImageUploader
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={(err) => showToast(err.message, 'error')}
                        folder={activeFolder}
                    />
                </div>

                {/* Sección para subir imágenes desde URL */}
                <div className="bg-slate-800/20 border border-slate-700/40 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-medium text-white mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M14.828 14.828a4 4 0 010-5.656l4-4a4 4 0 015.656 5.656l-1.1 1.1"/>
                        </svg>
                        Subir imagen desde URL
                    </h2>

                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-4">
                            Introduce la URL de una imagen disponible en internet para añadirla a tu colección. La
                            imagen se copiará y almacenará en tu cuenta.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="flex-1 px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                disabled={isUploadingUrl}
                            />
                            <button
                                onClick={handleUploadFromUrl}
                                disabled={!imageUrl.trim() || isUploadingUrl}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
                            >
                                {isUploadingUrl ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Subiendo...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                                        </svg>
                                        Subir Imagen
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-3 text-xs text-slate-500">
                            <p>Formatos soportados: JPG, PNG, GIF, WEBP</p>
                            <p>Tamaño máximo: 10MB</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-medium text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Imágenes en {folders.find(f => f.id === activeFolder)?.name}
                    {isLoading && (
                        <svg
                            className="animate-spin ml-2 h-5 w-5 text-indigo-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    )}
                </h2>

                {filteredImages.length > 0 && (
                    <div className="text-sm text-slate-400">
                        {filteredImages.length} {filteredImages.length === 1 ? 'imagen' : 'imágenes'}
                    </div>
                )}
            </div>

            {isLoading ? (
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/30 border border-slate-700/40 rounded-lg overflow-hidden shadow-md animate-pulse"
                        >
                            <div className="h-48 bg-slate-700/50"></div>
                            <div className="p-4">
                                <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-slate-700/50 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredImages.length > 0 ? (
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {filteredImages.map((image) => (
                        <div key={image.id}
                             className="bg-slate-800/20 border border-slate-700/40 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl flex flex-col">
                            <div className="aspect-video bg-slate-900/50 flex items-center justify-center overflow-hidden">
                                <img
                                    src={image.url}
                                    alt={image.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex-grow">
                                    <h3 className="text-white font-medium truncate mb-2" title={image.name}>
                                        {image.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded-md">
                                            {formatFileSize(image.size)}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded-md">
                                            {image.type?.split('/')[1] || 'imagen'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/40">
                                    <button
                                        onClick={() => handleCopyUrl(image.url)}
                                        className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center px-2 py-1 rounded hover:bg-slate-700/30 transition-colors"
                                        title="Copiar URL"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copiar URL
                                    </button>
                                    <button
                                        onClick={() => handleDeleteImage(image)}
                                        className="text-sm text-red-400 hover:text-red-300 flex items-center px-2 py-1 rounded hover:bg-slate-700/30 transition-colors"
                                        title="Eliminar imagen"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 px-4 bg-slate-800/20 border border-slate-700/40 rounded-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-slate-600 mx-auto mb-4"
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
                    <h3 className="text-lg font-medium text-white">No hay imágenes</h3>
                    <p className="text-slate-400 mt-2">
                        {searchTerm
                            ? `No se encontraron imágenes que coincidan con "${searchTerm}"`
                            : `Aún no hay imágenes en esta carpeta. ¡Sube una!`}
                    </p>
                </div>
            )}

            {/* CSS global para ocultar scrollbar */}
            <style>
                {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
            </style>
        </div>
    );
};

export default ImageManager; 