import React, { useState, useRef, ChangeEvent } from 'react';
import { uploadImage } from '../../services/storageService';

interface ImageUploaderProps {
  onUploadSuccess: (imageUrl: string) => void;
  onUploadError?: (error: Error) => void;
  folder?: string;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  folder = 'images',
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeMB = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de archivo no soportado. Por favor, sube: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxSizeBytes) {
      return `Archivo demasiado grande. El tamaño máximo es de ${maxSizeMB}MB`;
    }
    
    return null;
  };
  
  const processFile = async (file: File) => {
    // Validar el archivo
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setPreview(null);
      return;
    }
    
    // Mostrar la vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Simular progreso
    setIsUploading(true);
    setError(null);
    
    const simulateProgress = () => {
      setUploadProgress(prev => {
        if (prev < 90) return prev + 10;
        return prev;
      });
    };
    
    const interval = setInterval(simulateProgress, 200);
    
    try {
      // Subir el archivo a Firebase Storage
      const result = await uploadImage(file, folder);
      
      // Completar la carga
      clearInterval(interval);
      setUploadProgress(100);
      
      // Notificar éxito
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setPreview(null);
        onUploadSuccess(result.url);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      setError('Error al subir la imagen');
      
      if (err instanceof Error && onUploadError) {
        onUploadError(err);
      }
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-slate-600 bg-slate-800/30 hover:border-indigo-400 hover:bg-slate-800/50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={acceptedTypes.join(',')}
        />
        
        {isUploading ? (
          <div className="py-6 max-w-xl mx-auto">
            {preview && (
              <div className="mx-auto w-40 h-40 mb-6 overflow-hidden rounded-lg shadow-lg">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="w-full h-full object-contain bg-slate-900/50"
                />
              </div>
            )}
            <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-base text-indigo-300">Subiendo... {uploadProgress}%</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {preview ? (
              <div className="mx-auto w-48 h-48 overflow-hidden rounded-lg border border-slate-600 shadow-lg">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="w-full h-full object-contain bg-slate-900/50"
                />
              </div>
            ) : (
              <div className="py-6 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-slate-500 mx-auto mb-4"
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
              </div>
            )}
            
            <div className="text-center md:text-left py-4">
              <h3 className="text-lg font-medium text-white mb-2">
                {preview ? "Imagen lista para subir" : "Subir nueva imagen"}
              </h3>
              <p className="text-base text-slate-300 mb-3">
                {preview 
                  ? "Haz clic para cambiar la imagen seleccionada" 
                  : "Arrastra y suelta una imagen aquí o haz clic para seleccionar"}
              </p>
              <div className="text-sm text-slate-400 space-y-1">
                <p>Formatos permitidos: {acceptedTypes.map(type => type.split('/')[1]).join(', ')}</p>
                <p>Tamaño máximo: {maxSizeMB}MB</p>
                <p>Carpeta destino: {folder}</p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 text-sm text-red-400 bg-red-900/20 py-2 px-4 rounded-lg border border-red-800/30 max-w-xl mx-auto">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader; 