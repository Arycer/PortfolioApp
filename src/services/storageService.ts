import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export interface ImageInfo {
  id: string;
  name: string;
  url: string;
  path: string;
  type?: string;
  size?: number;
  createdAt: Date;
}

/**
 * Sube una imagen a Firebase Storage
 * @param file Archivo a subir
 * @param folder Carpeta donde se guardará (opcional)
 * @returns Información de la imagen subida
 */
export const uploadImage = async (file: File, folder: string = 'images'): Promise<ImageInfo> => {
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `${folder}/${fileName}`;
  const storageRef = ref(storage, filePath);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    const imageInfo: ImageInfo = {
      id: fileName,
      name: file.name,
      url: downloadURL,
      path: filePath,
      type: file.type,
      size: file.size,
      createdAt: new Date()
    };
    
    return imageInfo;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw error;
  }
};

/**
 * Sube una imagen a Firebase Storage desde una URL
 * @param imageUrl URL de la imagen a subir
 * @param folder Carpeta donde se guardará (opcional)
 * @returns Información de la imagen subida
 */
export const uploadImageFromURL = async (imageUrl: string, folder: string = 'images'): Promise<ImageInfo> => {
  try {
    // Crear una URL para análisis más seguro
    const parsedUrl = new URL(imageUrl);
    
    // Obtener la ruta de la URL
    const pathSegments = parsedUrl.pathname.split('/');
    let originalFileName = pathSegments[pathSegments.length - 1];
    
    // Si no hay nombre de archivo en la ruta, usar un nombre temporal
    if (!originalFileName || originalFileName === '' || originalFileName === '/') {
      originalFileName = `image_${Date.now()}`;
    }
    
    // Limpiar parámetros de consulta en el nombre del archivo (si los hay)
    if (originalFileName.includes('?')) {
      originalFileName = originalFileName.split('?')[0];
    }
    
    // Extraer extensión del archivo o determinar basada en tipo de contenido
    let fileExtension = originalFileName.split('.').pop();
    
    // Si no se puede determinar la extensión o no es válida
    if (!fileExtension || fileExtension === originalFileName || fileExtension.length > 5) {
      // Intentar determinar el tipo de extensión adecuada basada en el tipo de contenido
      fileExtension = 'jpg'; // Usar jpg como formato predeterminado
      originalFileName = `${originalFileName.replace(/\.[^/.]+$/, '')}_${Date.now()}.${fileExtension}`;
    }
    
    // Descargar la imagen manteniendo la URL completa
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Error al descargar la imagen: ${response.statusText}`);
    }
    
    // Obtener el tipo de contenido de la respuesta
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    const blob = await response.blob();
    
    // Crear un File a partir del Blob con el tipo de contenido correcto
    const file = new File([blob], originalFileName, { type: contentType });
    
    // Usar la función uploadImage para subir el archivo
    return await uploadImage(file, folder);
    
  } catch (error) {
    console.error('Error al subir la imagen desde URL:', error);
    throw error;
  }
};

/**
 * Obtiene todas las imágenes de una carpeta específica
 * @param folder Carpeta de donde obtener las imágenes
 * @returns Lista de información de imágenes
 */
export const getImages = async (folder: string = 'images'): Promise<ImageInfo[]> => {
  const folderRef = ref(storage, folder);
  
  try {
    const result = await listAll(folderRef);
    const imagesPromises = result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      const name = itemRef.name;
      const path = itemRef.fullPath;
      
      return {
        id: name,
        name: name,
        url: url,
        path: path,
        createdAt: new Date()
      };
    });
    
    return Promise.all(imagesPromises);
  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
    throw error;
  }
};

/**
 * Elimina una imagen de Firebase Storage
 * @param path Ruta de la imagen a eliminar
 */
export const deleteImage = async (path: string): Promise<void> => {
  const imageRef = ref(storage, path);
  
  try {
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    throw error;
  }
};

/**
 * Obtiene la URL de descarga de una imagen
 * @param path Ruta de la imagen
 * @returns URL de descarga
 */
export const getImageUrl = async (path: string): Promise<string> => {
  const imageRef = ref(storage, path);
  
  try {
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error al obtener la URL de la imagen:', error);
    throw error;
  }
}; 