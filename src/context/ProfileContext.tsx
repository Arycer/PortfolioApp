import React, { createContext, useState, useContext, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AboutMeData, ProfileContextProps, ProfileProviderProps } from '../types';

const defaultContextValue: ProfileContextProps = {
  profileData: null,
  isLoading: true,
  error: null,
  refreshProfileData: async () => {},
};

const ProfileContext = createContext<ProfileContextProps>(defaultContextValue);

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const [profileData, setProfileData] = useState<AboutMeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Intentamos obtener el documento 'main' de la colección 'aboutMe'
      const aboutMeRef = doc(db, 'aboutMe', 'main');
      const aboutMeDoc = await getDoc(aboutMeRef);
      
      if (aboutMeDoc.exists()) {
        setProfileData({
          id: aboutMeDoc.id,
          ...aboutMeDoc.data()
        } as AboutMeData);
      } else {
        // Si no hay documento, establecemos un perfil predeterminado
        setProfileData({
          username: 'Arycer',
          greeting: 'Mi Portafolio',
          description: 'Bienvenido a mi portafolio',
          socialLinks: [],
          profileImage: '/arycer.png'
        });
      }
    } catch (err) {
      console.error('Error al cargar datos del perfil:', err);
      setError('No se pudo cargar la información del perfil');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargamos los datos al montar el componente
  useEffect(() => {
    fetchProfileData();
  }, []);

  const refreshProfileData = async () => {
    await fetchProfileData();
  };

  return (
    <ProfileContext.Provider 
      value={{ 
        profileData, 
        isLoading, 
        error, 
        refreshProfileData 
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}; 