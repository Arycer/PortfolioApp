import React, {useState, useRef} from 'react';
import {uploadImage} from '../../services/storageService';
import {useToast} from '../../context/ToastContext';

interface ImageUploaderProps {
    onUploadSuccess: () => void;
    onUploadError: (error: Error) => void;
    folder: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({onUploadSuccess, onUploadError, folder}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const {showToast} = useToast();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragOut = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            showToast('Por favor, sube una imagen válida (JPG, PNG, GIF o WEBP)', 'error');
            return;
        }

        // Validar tamaño (10MB máximo)
        const maxSize = 10 * 1024 * 1024; // 10MB en bytes
        if (file.size > maxSize) {
            showToast('La imagen no puede superar los 10MB', 'error');
            return;
        }

        setIsUploading(true);
        try {
            await uploadImage(file, folder);
            onUploadSuccess();
        } catch (err) {
            console.error('Error al subir la imagen:', err);
            onUploadError(err instanceof Error ? err : new Error('Error al subir la imagen'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <p className="text-sm text-slate-400 mb-4">
                Arrastra y suelta una imagen aquí o haz clic para seleccionar una. La imagen se subirá
                automáticamente.
            </p>

            <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    dragActive
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-600 hover:border-slate-500'
                }`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    disabled={isUploading}
                />

                <div className="text-center">
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <svg
                                className="animate-spin h-8 w-8 text-indigo-500 mb-2"
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
                            <span className="text-sm text-slate-400">Subiendo imagen...</span>
                        </div>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-slate-500 mx-auto mb-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                            </svg>
                            <p className="text-sm text-slate-400 mb-2">
                                Arrastra y suelta una imagen aquí
                            </p>
                            <p className="text-xs text-slate-500">
                                o haz clic para seleccionar
                            </p>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-3 text-xs text-slate-500">
                <p>Formatos soportados: JPG, PNG, GIF, WEBP</p>
                <p>Tamaño máximo: 10MB</p>
            </div>
        </div>
    );
};

export default ImageUploader; 