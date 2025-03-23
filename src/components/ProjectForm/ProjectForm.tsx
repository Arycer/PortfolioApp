import React, {useEffect, useState} from 'react';
import {Project} from '../../types';
import {
    Input, 
    Textarea, 
    Button, 
    TechBadge, 
    FormGrid, 
    FormSection, 
    FormField, 
    FormImageField,
    FormActions
} from '../ui/StyledComponents';
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
                <FormGrid>
                    {/* Columna Izquierda */}
                    <FormSection>
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

                        <FormField label="Tecnologías utilizadas">
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
                        </FormField>

                        <FormGrid columns={2}>
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
                        </FormGrid>

                        <Input
                            label="URL del repositorio en GitHub (opcional)"
                            name="githubUrl"
                            value={formData.githubUrl || ''}
                            onChange={handleChange}
                            placeholder="https://github.com/usuario/proyecto"
                        />
                    </FormSection>

                    {/* Columna Derecha */}
                    <FormSection>
                        <FormImageField
                            label="Imagen del Proyecto"
                            imageUrl={formData.image}
                            emptyMessage="No has seleccionado ninguna imagen"
                            onSelectClick={() => setShowImageSelector(true)}
                            onRemoveClick={() => setFormData(prev => ({...prev, image: ''}))}
                            imageContainerClassName="h-56 w-full"
                        />

                        <Textarea
                            label="Descripción detallada"
                            name="detailedDescription"
                            value={formData.detailedDescription || ''}
                            onChange={handleChange}
                            rows={10}
                        />
                    </FormSection>
                </FormGrid>

                <FormActions 
                    onCancel={onCancel}
                    isSubmitting={isSubmitting}
                    submitText={project ? 'Actualizar' : 'Crear'}
                />
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