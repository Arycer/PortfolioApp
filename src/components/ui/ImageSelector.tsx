import React, {useState, useEffect} from 'react';
import {ImageInfo} from '../../types';
import {getImages} from '../../services/storageService';
import {Button, SearchInput} from './StyledComponents';
import Modal from '../Modal/Modal';

interface ImageSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage: (url: string) => void;
    title?: string;
    folder?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
    isOpen,
    onClose,
    onSelectImage,
    title = "Seleccionar imagen",
    folder = "images"
}) => {
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Cargar imágenes cuando se abre el selector y limpiar búsqueda al cerrar
    useEffect(() => {
        if (isOpen) {
            loadImages();
        } else {
            setSearchTerm('');
        }
    }, [isOpen, folder]);

    const loadImages = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const imagesList = await getImages(folder);
            // Ordenar por fecha más reciente primero
            imagesList.sort((a: ImageInfo, b: ImageInfo) =>
                b.createdAt.getTime() - a.createdAt.getTime()
            );
            setImages(imagesList);
        } catch (err) {
            console.error('Error al cargar imágenes:', err);
            setError('No se pudieron cargar las imágenes. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    // Filtrar imágenes según término de búsqueda
    const filteredImages = images.filter(image =>
        image.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={title}
            maxWidth="4xl"
        >
            <div className="space-y-6 w-full">
                <div className="relative">
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar imágenes..."
                        className="w-full"
                        onClear={handleClearSearch}
                    />
                </div>

                <div className="min-h-[400px] flex items-center justify-center">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : error ? (
                        <div
                            className="text-center py-8 text-red-400 bg-red-900/20 border border-red-800/30 rounded-lg w-full">
                            <p>{error}</p>
                            <button
                                onClick={loadImages}
                                className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : filteredImages.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-h-[450px] overflow-y-auto p-4">
                            {filteredImages.map((image) => (
                                <div
                                    key={image.id}
                                    onClick={() => onSelectImage(image.url)}
                                    className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-700/50 bg-slate-800/30 aspect-square flex items-center justify-center p-4 hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/20 transition-all duration-200"
                                >
                                    <img
                                        src={image.url}
                                        alt={image.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                    <div
                                        className="absolute inset-0 bg-indigo-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-2">
                                        <span className="text-white text-sm font-medium mb-1">Seleccionar</span>
                                        <span className="text-white/70 text-xs text-center truncate w-full">{image.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-slate-800/20 border border-slate-700/40 rounded-lg w-full">
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
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        size="sm"
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ImageSelector; 