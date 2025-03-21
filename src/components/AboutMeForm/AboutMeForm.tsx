import React, {useEffect, useState} from 'react';
import {AboutMeData, SocialLink} from '../AboutMe/AboutMe';
import SortableList from '../SortableList/SortableList';
import SocialLinkPreview from '../SortableList/SocialLinkPreview';
import ImageUploader from '../ImageUploader/ImageUploader';
import { getImages, ImageInfo } from '../../services/storageService';
import ImagePreview from '../ImagePreview/ImagePreview';

interface AboutMeFormProps {
    data?: AboutMeData;
    onSubmit: (data: Omit<AboutMeData, 'id'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const AboutMeForm: React.FC<AboutMeFormProps> = ({
                                                     data,
                                                     onSubmit,
                                                     onCancel,
                                                     isSubmitting
                                                 }) => {
    const [formData, setFormData] = useState<Omit<AboutMeData, 'id'>>({
        username: '',
        greeting: '',
        description: '',
        socialLinks: [],
        contactEmail: '',
        profileImage: ''
    });

    const [newSocialLink, setNewSocialLink] = useState<Omit<SocialLink, 'id'>>({
        name: '',
        url: '',
        icon: '',
        order: 0
    });

    const [socialLinksViewMode, setSocialLinksViewMode] = useState<'form' | 'list'>('form');
    const [editingSocialLink, setEditingSocialLink] = useState<{ index: number, link: SocialLink } | null>(null);
    
    // Nuevo estado para controlar si el panel de redes sociales está abierto
    const [isSocialPanelOpen, setIsSocialPanelOpen] = useState(false);
    
    // Estado para manejar la selección de imagen
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [profileImages, setProfileImages] = useState<ImageInfo[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);

    useEffect(() => {
        if (data) {
            const {id, ...aboutData} = data;
            
            // Asegurarse de que todas las redes sociales tengan un order
            const socialLinksWithOrder = aboutData.socialLinks.map((link, index) => ({
                ...link,
                order: link.order !== undefined ? link.order : index
            }));
            
            setFormData({
                ...aboutData,
                socialLinks: socialLinksWithOrder
            });
        }
    }, [data]);

    // Efecto para cerrar el panel en pantallas pequeñas
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && isSocialPanelOpen) {
                setIsSocialPanelOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSocialPanelOpen]);

    // Cargar imágenes de perfil
    const loadProfileImages = async () => {
        try {
            setLoadingImages(true);
            const images = await getImages('profile');
            setProfileImages(images);
        } catch (error) {
            console.error('Error al cargar imágenes de perfil:', error);
        } finally {
            setLoadingImages(false);
        }
    };

    // Cargar imágenes cuando se abre el selector
    useEffect(() => {
        if (showImageSelector) {
            loadProfileImages();
        }
    }, [showImageSelector]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        
        if (editingSocialLink) {
            // Si estamos editando una red social existente
            const updatedLink = {...editingSocialLink.link, [name]: value};
            setEditingSocialLink({...editingSocialLink, link: updatedLink});
        } else {
            // Si estamos creando una nueva red social
            setNewSocialLink(prev => ({...prev, [name]: value}));
        }
    };

    const handleAddSocialLink = () => {
        if (newSocialLink.name && newSocialLink.url && newSocialLink.icon) {
            // Asignar el último orden + 1
            const lastOrder = formData.socialLinks.length > 0 
                ? Math.max(...formData.socialLinks.map(link => link.order || 0)) 
                : -1;
                
            const socialLinkWithOrder = {
                ...newSocialLink,
                order: lastOrder + 1
            };
            
            setFormData(prev => ({
                ...prev,
                socialLinks: [...prev.socialLinks, socialLinkWithOrder]
            }));
            setNewSocialLink({name: '', url: '', icon: '', order: 0});
        }
    };

    const handleSaveSocialLinkEdit = () => {
        if (editingSocialLink && editingSocialLink.link.name && editingSocialLink.link.url && editingSocialLink.link.icon) {
            const updatedLinks = [...formData.socialLinks];
            updatedLinks[editingSocialLink.index] = editingSocialLink.link;
            
            setFormData(prev => ({
                ...prev,
                socialLinks: updatedLinks
            }));
            
            setEditingSocialLink(null);
        }
    };

    const handleCancelSocialLinkEdit = () => {
        setEditingSocialLink(null);
    };

    const handleEditSocialLink = (index: number) => {
        setEditingSocialLink({
            index,
            link: {...formData.socialLinks[index]}
        });
    };

    const handleRemoveSocialLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index)
        }));
        
        // Si estábamos editando este enlace, cancelar la edición
        if (editingSocialLink && editingSocialLink.index === index) {
            setEditingSocialLink(null);
        }
    };

    const handleSocialLinksReorder = (reorderedLinks: SocialLink[]) => {
        // Asignar nuevos órdenes basados en la posición en el array
        const updatedLinks = reorderedLinks.map((link, index) => ({
            ...link,
            order: index
        }));
        
        setFormData(prev => ({
            ...prev,
            socialLinks: updatedLinks
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    // Toggle para abrir/cerrar el panel de redes sociales
    const toggleSocialPanel = () => {
        setIsSocialPanelOpen(prev => !prev);
    };

    // Manejar la subida exitosa de una imagen de perfil
    const handleProfileImageUpload = (imageUrl: string) => {
        setFormData(prev => ({
            ...prev,
            profileImage: imageUrl
        }));
        setShowImageSelector(false);
    };

    // Seleccionar una imagen existente
    const handleSelectImage = (image: ImageInfo) => {
        setFormData(prev => ({
            ...prev,
            profileImage: image.url
        }));
        setShowImageSelector(false);
    };

    return (
        <div className="flex relative transition-all duration-500 ease-in-out">
            {/* Panel principal con el formulario básico */}
            <div className={`transition-all duration-500 ease-in-out w-full ${isSocialPanelOpen ? 'lg:mr-[500px] md:mr-[450px] transform md:-translate-x-4' : ''}`}>
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    {/* Sección de imagen de perfil */}
                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/40 shadow-md">
                        <label className="block text-sm font-medium text-white mb-3">
                            Imagen de Perfil
                        </label>
                        
                        <div className="flex flex-col space-y-4">
                            {formData.profileImage ? (
                                <div className="relative">
                                    <img 
                                        src={formData.profileImage} 
                                        alt="Imagen de perfil" 
                                        className="w-40 h-40 object-cover rounded-lg border-2 border-indigo-500/30 mx-auto"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, profileImage: '' }))}
                                        className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 p-1.5 rounded-full transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8 px-6 bg-slate-800/40 rounded-lg border border-slate-700/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-slate-400">No has seleccionado ninguna imagen</p>
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
                                    Seleccionar Imagen
                                </button>
                            </div>
                        </div>
                        
                        {/* Modal selector de imágenes */}
                        {showImageSelector && (
                            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                                <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <div className="p-5 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
                                        <h3 className="text-lg font-medium text-white">Seleccionar Imagen de Perfil</h3>
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
                                            <h4 className="text-sm font-medium text-white mb-3">Subir Nueva Imagen</h4>
                                            <ImageUploader 
                                                onUploadSuccess={handleProfileImageUpload}
                                                folder="profile"
                                                maxSizeMB={2}
                                            />
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-medium text-white mb-3">Imágenes Disponibles</h4>
                                            
                                            {loadingImages ? (
                                                <div className="text-center py-8">
                                                    <p className="text-slate-400">Cargando imágenes...</p>
                                                </div>
                                            ) : profileImages.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                    {profileImages.map(image => (
                                                        <div key={image.id} onClick={() => handleSelectImage(image)} className="cursor-pointer transition-transform hover:scale-105">
                                                            <img 
                                                                src={image.url} 
                                                                alt={image.name} 
                                                                className="w-full h-40 object-cover rounded-lg border border-slate-700 hover:border-indigo-500"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 px-6 bg-slate-800/40 rounded-lg border border-slate-700/50">
                                                    <p className="text-slate-400">No hay imágenes disponibles en la carpeta de perfil</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/40 shadow-md">
                        <label htmlFor="username" className="block text-sm font-medium text-white mb-1.5">
                            Nombre de Usuario <span className="text-xs text-indigo-400">(aparece en la cabecera)</span>
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 text-base rounded-lg bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                            placeholder="Tu nombre o alias"
                        />
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/40 shadow-md">
                        <label htmlFor="greeting" className="block text-sm font-medium text-white mb-1.5">
                            Saludo
                        </label>
                        <input
                            type="text"
                            id="greeting"
                            name="greeting"
                            value={formData.greeting}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 text-base rounded-lg bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                            placeholder="Ej: Hola, mi nombre es..."
                        />
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/40 shadow-md">
                        <label htmlFor="description" className="block text-sm font-medium text-white mb-1.5">
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className="mt-1 block w-full px-4 py-3 text-base rounded-lg bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            required
                            placeholder="Escribe una breve descripción sobre ti..."
                        />
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/40 shadow-md">
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-white mb-1.5">
                            Correo de Contacto
                        </label>
                        <input
                            type="email"
                            id="contactEmail"
                            name="contactEmail"
                            value={formData.contactEmail || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 text-base rounded-lg bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="tu@email.com"
                        />
                    </div>

                    {/* Sección colapsada de redes sociales */}
                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/40 shadow-md">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <label className="text-sm font-medium text-white">
                                    Redes Sociales
                                </label>
                                <span className="text-xs text-slate-200 bg-indigo-600/30 px-2.5 py-0.5 rounded-full border border-indigo-500/40">
                                    {formData.socialLinks.length}
                                </span>
                            </div>
                            
                            {/* Botón para abrir/cerrar panel de redes sociales */}
                            <button
                                type="button"
                                onClick={toggleSocialPanel}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors duration-200 shadow-sm"
                            >
                                {isSocialPanelOpen ? (
                                    <>
                                        <span>Cerrar panel</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        <span>Gestionar Redes</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-md transition-colors duration-150 shadow-sm"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {isSubmitting ? 'Guardando...' : data ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Panel lateral para gestionar redes sociales - se muestra/oculta con animación */}
            <div 
                className={`fixed top-0 right-0 h-full bg-slate-900/95 backdrop-blur-sm shadow-2xl overflow-y-auto transition-all duration-500 ease-in-out z-30 ${
                    isSocialPanelOpen 
                    ? 'lg:w-[500px] md:w-[450px] w-full opacity-100 translate-x-0'
                    : 'w-0 opacity-0 translate-x-full'
                }`}
            >
                {/* Contenido del panel - solo visible cuando está abierto */}
                {isSocialPanelOpen && (
                    <div className="p-5 md:p-6 h-full overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Gestionar Redes Sociales
                            </h3>
                            <button 
                                onClick={toggleSocialPanel}
                                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/50 transition-colors"
                                aria-label="Cerrar panel"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Tabs para cambiar entre modos */}
                        <div className="flex mb-8 bg-slate-800/50 rounded-lg p-1 shadow-inner">
                            <button
                                onClick={() => setSocialLinksViewMode('form')}
                                className={`flex-1 py-3 text-sm font-medium rounded-md transition-all ${
                                    socialLinksViewMode === 'form' 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Editar Redes
                                </div>
                            </button>
                            <button
                                onClick={() => setSocialLinksViewMode('list')}
                                className={`flex-1 py-3 text-sm font-medium rounded-md transition-all ${
                                    socialLinksViewMode === 'list' 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                    Ordenar Lista
                                </div>
                            </button>
                        </div>
                        
                        {socialLinksViewMode === 'form' ? (
                            <>
                                {/* Lista de redes sociales */}
                                <div className="space-y-3 max-h-[35vh] overflow-y-auto mb-8 pr-1 custom-scrollbar">
                                    {formData.socialLinks.length > 0 ? (
                                        formData.socialLinks.map((link, index) => (
                                            <div key={link.id || `social-link-${index}`}
                                                className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-200"
                                            >
                                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-700/70 rounded-lg shadow-inner">
                                                    <img src={link.icon} alt={link.name} className="w-6 h-6"/>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-white text-base">{link.name}</div>
                                                    <div className="text-xs text-slate-400 truncate">{link.url}</div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditSocialLink(index)}
                                                        className="p-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 rounded transition-colors duration-150"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSocialLink(index)}
                                                        className="p-1.5 text-xs text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 rounded transition-colors duration-150"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 px-6 text-slate-500 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="font-medium">No hay redes sociales</p>
                                            <p className="text-xs mt-2">Añade tu primera red social utilizando el formulario de abajo</p>
                                        </div>
                                    )}
                                </div>

                                {/* Formulario para editar/agregar nueva red social */}
                                <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-lg shadow-lg">
                                    <h3 className="text-sm font-medium text-white mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        {editingSocialLink ? 'Editar Red Social' : 'Añadir Nueva Red Social'}
                                    </h3>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                                <span className="flex items-center">
                                                    Nombre 
                                                    <span className="text-red-400 ml-1">*</span>
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editingSocialLink ? editingSocialLink.link.name : newSocialLink.name}
                                                onChange={handleSocialLinkChange}
                                                placeholder="Ej: LinkedIn, GitHub, Twitter..."
                                                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                                <span className="flex items-center">
                                                    URL de la red social
                                                    <span className="text-red-400 ml-1">*</span>
                                                </span>
                                            </label>
                                            <input
                                                type="url"
                                                name="url"
                                                value={editingSocialLink ? editingSocialLink.link.url : newSocialLink.url}
                                                onChange={handleSocialLinkChange}
                                                placeholder="https://www.ejemplo.com/perfil"
                                                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                                <span className="flex items-center">
                                                    URL del ícono
                                                    <span className="text-red-400 ml-1">*</span>
                                                </span>
                                            </label>
                                            <input
                                                type="url"
                                                name="icon"
                                                value={editingSocialLink ? editingSocialLink.link.icon : newSocialLink.icon}
                                                onChange={handleSocialLinkChange}
                                                placeholder="URL de la imagen del ícono"
                                                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            />
                                            <p className="text-xs text-slate-500 mt-1.5">
                                                Puedes usar iconos de 
                                                <a 
                                                    href="https://github.com/devicons/devicon/tree/master/icons" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-400 hover:text-indigo-300 mx-1"
                                                >
                                                    DevIcon
                                                </a>
                                                o cualquier otra fuente de iconos
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-3">
                                        {editingSocialLink ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={handleCancelSocialLinkEdit}
                                                    className="px-4 py-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-md transition-colors duration-200"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSaveSocialLinkEdit}
                                                    className="px-4 py-2 text-sm text-white bg-indigo-600/80 hover:bg-indigo-600 rounded-md transition-colors duration-200 flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Guardar Cambios
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleAddSocialLink}
                                                className="px-4 py-2 text-sm text-white bg-indigo-600/80 hover:bg-indigo-600 rounded-md transition-colors duration-200 flex items-center"
                                                disabled={!newSocialLink.name || !newSocialLink.url || !newSocialLink.icon}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Añadir Red Social
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Lista ordenable de redes sociales */
                            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-5 shadow-lg">
                                <div className="mb-6">
                                    <h3 className="text-white font-medium flex items-center mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                        </svg>
                                        Ordenar Redes Sociales
                                    </h3>
                                    <p className="text-sm text-slate-400">
                                        Arrastra y suelta para reordenar tus redes sociales. El orden se guardará automáticamente y se reflejará en tu portafolio.
                                    </p>
                                </div>
                                
                                <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/50 min-h-[300px]">
                                    {formData.socialLinks.length > 0 ? (
                                        <SortableList
                                            items={formData.socialLinks}
                                            onReorder={handleSocialLinksReorder}
                                            renderItem={(item) => (
                                                <SocialLinkPreview
                                                    socialLink={item}
                                                    id={item.id || item.name}
                                                    onEdit={() => {
                                                        const index = formData.socialLinks.findIndex(link => 
                                                            link.id === item.id || (link.name === item.name && link.url === item.url)
                                                        );
                                                        if (index !== -1) {
                                                            setSocialLinksViewMode('form');
                                                            handleEditSocialLink(index);
                                                        }
                                                    }}
                                                    onDelete={() => {
                                                        const index = formData.socialLinks.findIndex(link => 
                                                            link.id === item.id || (link.name === item.name && link.url === item.url)
                                                        );
                                                        if (index !== -1) {
                                                            handleRemoveSocialLink(index);
                                                        }
                                                    }}
                                                />
                                            )}
                                            itemKey={(item) => item.id || item.name}
                                            droppableId="social-links-list"
                                            className="space-y-2"
                                        />
                                    ) : (
                                        <div className="text-center py-10 px-6 text-slate-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="font-medium">No hay redes sociales para ordenar</p>
                                            <p className="text-xs mt-2">Primero añade algunas redes sociales desde la pestaña "Editar"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Overlay para cerrar el panel cuando se hace clic fuera */}
            {isSocialPanelOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20"
                    onClick={toggleSocialPanel}
                />
            )}
        </div>
    );
};

export default AboutMeForm; 