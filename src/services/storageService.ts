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