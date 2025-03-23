import React, {useEffect, useState} from 'react';
import {AboutMeData, SocialLink} from '../../types';
import SortableList from '../SortableList/SortableList';
import SocialLinkPreview from '../SortableList/SocialLinkPreview';
import {Input, Textarea, Button, Panel, ImageContainer} from '../ui/StyledComponents';
import ImageSelector from '../ui/ImageSelector';
import Modal from '../Modal/Modal';

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

    const [editingSocialLink, setEditingSocialLink] = useState<{ index: number, link: SocialLink } | null>(null);
    const [showSocialLinksModal, setShowSocialLinksModal] = useState(false);
    const [showImageSelector, setShowImageSelector] = useState(false);

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

    const handleSelectImage = (url: string) => {
        setFormData(prev => ({
            ...prev,
            profileImage: url
        }));
        setShowImageSelector(false);
    };

    // Ordenar enlaces sociales por orden
    const sortedSocialLinks = [...formData.socialLinks].sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                        {/* Columna Izquierda */}
                        <div className="space-y-6">
                            <Input
                                label="Nombre de usuario"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Saludo"
                                name="greeting"
                                value={formData.greeting}
                                onChange={handleChange}
                                placeholder="Ej: Hola, soy..."
                                required
                            />

                            <Textarea
                                label="Descripción"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={10}
                                required
                            />

                            <Input
                                label="Email de contacto"
                                name="contactEmail"
                                type="email"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-6">
                            {/* Sección de imagen de perfil */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Imagen de Perfil
                                </label>
                                
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                                    <ImageContainer
                                        className="h-40 w-40 mx-auto sm:mx-0"
                                        isEmpty={!formData.profileImage}
                                        emptyMessage="Sin imagen"
                                    >
                                        {formData.profileImage && (
                                            <img
                                                src={formData.profileImage}
                                                alt="Imagen de perfil"
                                                className="h-full w-full object-contain p-2"
                                            />
                                        )}
                                    </ImageContainer>
                                    <div className="flex flex-row sm:flex-col gap-2 justify-center sm:justify-start">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setShowImageSelector(true)}
                                        >
                                            {formData.profileImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
                                        </Button>
                                        {formData.profileImage && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setFormData({ ...formData, profileImage: '' })}
                                            >
                                                Quitar imagen
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sección de redes sociales */}
                            <div className="pt-2">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-medium text-slate-300">
                                        Redes Sociales <span className="text-xs text-slate-400">({formData.socialLinks.length})</span>
                                    </label>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setShowSocialLinksModal(true)}
                                    >
                                        Gestionar redes sociales
                                    </Button>
                                </div>
                                
                                {formData.socialLinks.length > 0 ? (
                                    <div className="bg-slate-800/20 rounded-lg border border-slate-700/40 p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {sortedSocialLinks.slice(0, 5).map((link, index) => (
                                                <div key={link.id || index} className="flex items-center px-3 py-1.5 bg-slate-700/50 rounded-full text-sm">
                                                    <span className="truncate max-w-[120px]">{link.name}</span>
                                                </div>
                                            ))}
                                            {formData.socialLinks.length > 5 && (
                                                <div className="flex items-center px-3 py-1.5 bg-slate-700/30 rounded-full text-sm text-slate-400">
                                                    +{formData.socialLinks.length - 5} más
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-slate-800/20 rounded-lg border border-slate-700/40">
                                        <p className="text-slate-400">No hay redes sociales configuradas</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-700/50 pt-8 mt-8">
                        <div className="flex justify-end space-x-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={onCancel}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                isLoading={isSubmitting}
                            >
                                {data ? 'Actualizar' : 'Crear'}
                            </Button>
                        </div>
                    </div>
                </form>
            <Modal 
                isOpen={showSocialLinksModal}
                onClose={() => setShowSocialLinksModal(false)}
                title="Gestionar Redes Sociales"
                maxWidth="2xl"
            >
                <div className="space-y-6">
                    <Panel className="p-4">
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <Input
                                    label="Nombre"
                                    name="name"
                                    value={editingSocialLink ? editingSocialLink.link.name : newSocialLink.name}
                                    onChange={handleSocialLinkChange}
                                    placeholder="Ej: Twitter, GitHub..."
                                />
                                
                                <Input
                                    label="URL"
                                    name="url"
                                    value={editingSocialLink ? editingSocialLink.link.url : newSocialLink.url}
                                    onChange={handleSocialLinkChange}
                                    placeholder="https://..."
                                />
                                
                                <Input
                                    label="Icono"
                                    name="icon"
                                    value={editingSocialLink ? editingSocialLink.link.icon : newSocialLink.icon}
                                    onChange={handleSocialLinkChange}
                                    placeholder="fa-twitter, fa-github..."
                                />
                            </div>
                            
                            <div className="flex justify-end">
                                {editingSocialLink ? (
                                    <>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm"
                                            onClick={handleCancelSocialLinkEdit}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button 
                                            type="button" 
                                            size="sm"
                                            onClick={handleSaveSocialLinkEdit}
                                        >
                                            Guardar Cambios
                                        </Button>
                                    </>
                                ) : (
                                    <Button 
                                        type="button" 
                                        size="sm"
                                        onClick={handleAddSocialLink}
                                        disabled={!newSocialLink.name || !newSocialLink.url || !newSocialLink.icon}
                                    >
                                        Añadir
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Panel>

                    {/* Lista de redes sociales */}
                    <div>
                        <h4 className="text-lg font-medium text-slate-300 mb-4">
                            Redes Sociales Actuales
                        </h4>
                        
                        {formData.socialLinks.length > 0 ? (
                            <SortableList
                                items={formData.socialLinks}
                                onReorder={handleSocialLinksReorder}
                                renderItem={(item: SocialLink) => (
                                    <SocialLinkPreview
                                        socialLink={item}
                                        id={item.id || item.name}
                                        onEdit={() => {
                                            const index = formData.socialLinks.findIndex(link => 
                                                link.id === item.id || (link.name === item.name && link.url === item.url)
                                            );
                                            if (index !== -1) {
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
                                itemKey={(item: SocialLink) => item.id || item.name}
                                droppableId="social-links-list"
                                className="space-y-2"
                            />
                        ) : (
                            <div className="text-center py-6 bg-slate-800/20 rounded-lg border border-slate-700/40">
                                <p className="text-slate-400">No hay redes sociales configuradas</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button 
                            variant="primary"
                            onClick={() => setShowSocialLinksModal(false)}
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            </Modal>
            
            <ImageSelector 
                isOpen={showImageSelector}
                onClose={() => setShowImageSelector(false)}
                onSelectImage={handleSelectImage}
                title="Seleccionar imagen de perfil"
                folder="profile"
            />
        </>
    );
};

export default AboutMeForm; 