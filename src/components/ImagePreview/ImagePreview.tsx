import React, {useState} from 'react';
import {ImageInfo} from '../../types';

interface ImagePreviewProps {
    image: ImageInfo;
    onDelete: (image: ImageInfo) => void;
    onSelect?: (image: ImageInfo) => void;
    isSelectable?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
                                                       image,
                                                       onDelete,
                                                       onSelect,
                                                       isSelectable = false
                                                   }) => {
    const [copied, setCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleCopyUrl = () => {
        const fullUrl = image.url;

        navigator.clipboard.writeText(fullUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Error al copiar la URL:', err);
            });
    };

    const formatFileSize = (bytes: number | undefined): string => {
        if (bytes === undefined) return 'Desconocido';
        if (bytes === 0) return '0 Bytes';

        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div
            className="bg-slate-800/30 border border-slate-700/40 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden group">
                <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 z-10 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopyUrl}
                            className="bg-blue-600/80 hover:bg-blue-600 p-2 rounded-full transition-colors"
                            title="Copiar URL"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(image)}
                            className="bg-red-600/80 hover:bg-red-600 p-2 rounded-full transition-colors"
                            title="Eliminar imagen"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                        {isSelectable && (
                            <button
                                onClick={() => onSelect?.(image)}
                                className="bg-green-600/80 hover:bg-green-600 p-2 rounded-full transition-colors"
                                title="Seleccionar imagen"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M5 13l4 4L19 7"/>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-48 object-contain bg-slate-900/50 object-center transition-transform duration-300 group-hover:scale-105"
                />
                {copied && (
                    <div
                        className="absolute top-2 right-2 bg-green-600/90 text-white text-xs px-3 py-1 rounded-full z-20">
                        URL copiada
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="text-sm font-medium text-white truncate mb-1" title={image.name}>
                    {image.name}
                </div>
                <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {formatFileSize(image.size)}
          </span>
                    <span className="text-xs text-slate-400">
            {formatDate(image.createdAt)}
          </span>
                </div>
            </div>
        </div>
    );
};

export default ImagePreview; 