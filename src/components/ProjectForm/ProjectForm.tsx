import React, {useEffect, useState} from 'react';
import {Project} from '../../types';
import {Input, Textarea, Button, ImageContainer, TechBadge} from '../ui/StyledComponents';
import ImageSelector from '../ui/ImageSelector';

interface ProjectFormProps {
    project?: Project;
    onSubmit: (project: Omit<Project, 'id'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
    project,
    onSubmit,
    onCancel,
    isSubmitting
}) => {
    const [formData, setFormData] = useState<Omit<Project, 'id'>>({
        title: '',
        description: '',
        image: '',
        link: '',
        buttonText: '',
        detailedDescription: '',
        technologies: [],
        githubUrl: ''
    });

    const [newTechnology, setNewTechnology] = useState('');
    const [showImageSelector, setShowImageSelector] = useState(false);

    useEffect(() => {
        if (project) {
            const {id, ...projectData} = project;
            setFormData(projectData);
        }
    }, [project]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleAddTechnology = () => {
        if (newTechnology.trim()) {
            setFormData(prev => ({
                ...prev,
                technologies: [...(prev.technologies || []), newTechnology.trim()]
            }));
            setNewTechnology('');
        }
    };

    const handleRemoveTechnology = (index: number) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies?.filter((_, i) => i !== index) || []
        }));
    };

    // Seleccionar una imagen existente
    const handleSelectImage = (url: string) => {
        setFormData(prev => ({
            ...prev,
            image: url
        }));
        setShowImageSelector(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <>            
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                    {/* Columna Izquierda */}
                    <div className="space-y-6">
                        <Input
                            label="Título"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <Textarea
                            label="Descripción breve"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={2}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Tecnologías utilizadas
                            </label>
                            <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                                {formData.technologies && formData.technologies.map((tech, index) => (
                                    <TechBadge
                                        key={index}
                                        text={tech}
                                        onRemove={() => handleRemoveTechnology(index)}
                                        variant="primary"
                                    />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    className="flex-1"
                                    placeholder="Añadir tecnología"
                                    value={newTechnology}
                                    onChange={(e) => setNewTechnology(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddTechnology}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Añadir
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input
                                label="URL del proyecto (opcional)"
                                name="link"
                                value={formData.link || ''}
                                onChange={handleChange}
                            />

                            <Input
                                label="Texto del botón (opcional)"
                                name="buttonText"
                                value={formData.buttonText || ''}
                                onChange={handleChange}
                                placeholder="Ver proyecto"
                            />
                        </div>

                        <Input
                            label="URL del repositorio en GitHub (opcional)"
                            name="githubUrl"
                            value={formData.githubUrl || ''}
                            onChange={handleChange}
                            placeholder="https://github.com/usuario/proyecto"
                        />
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Imagen del Proyecto
                            </label>
                            <div className="flex flex-col space-y-4">
                                <ImageContainer
                                    className="h-56 w-full"
                                    isEmpty={!formData.image}
                                    emptyMessage="No has seleccionado ninguna imagen"
                                >
                                    {formData.image && (
                                        <>
                                            <img
                                                src={formData.image}
                                                alt="Imagen del proyecto"
                                                className="h-full w-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({...prev, image: ''}))}
                                                className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 p-1.5 rounded-full transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"/>
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </ImageContainer>

                                <div className="flex justify-center">
                                    <Button
                                        type="button"
                                        onClick={() => setShowImageSelector(true)}
                                        variant="secondary"
                                    >
                                        Seleccionar Imagen
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Textarea
                            label="Descripción detallada"
                            name="detailedDescription"
                            value={formData.detailedDescription || ''}
                            onChange={handleChange}
                            rows={10}
                        />
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
                            {project ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </div>
            </form>
            
            <ImageSelector 
                isOpen={showImageSelector}
                onClose={() => setShowImageSelector(false)}
                onSelectImage={handleSelectImage}
                title="Seleccionar imagen del proyecto"
                folder="projects"
            />
        </>
    );
};

export default ProjectForm; 