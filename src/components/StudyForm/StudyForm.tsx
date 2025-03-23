import React, {useEffect, useState} from 'react';
import {Study} from '../../types';
import {
    Input, 
    Textarea, 
    FormGrid, 
    FormSection, 
    FormImageField,
    FormActions
} from '../ui/StyledComponents';
import ImageSelector from '../ui/ImageSelector';

interface StudyFormProps {
    study?: Study;
    onSubmit: (studyData: Omit<Study, 'id'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const StudyForm: React.FC<StudyFormProps> = ({
    study,
    onSubmit,
    onCancel,
    isSubmitting
}) => {
    const [formData, setFormData] = useState<Omit<Study, 'id'>>({
        title: '',
        institution: '',
        description: '',
        startDate: '',
        endDate: '',
        logo: ''
    });
    const [showImageSelector, setShowImageSelector] = useState(false);

    useEffect(() => {
        if (study) {
            const {id, ...studyData} = study;
            setFormData(studyData);
        }
    }, [study]);

    const handleSelectImage = (url: string) => {
        setFormData(prev => ({...prev, logo: url}));
        setShowImageSelector(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
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

                        <Input
                            label="Institución"
                            name="institution"
                            value={formData.institution}
                            onChange={handleChange}
                            required
                        />

                        <FormGrid columns={2}>
                            <Input
                                label="Fecha de inicio"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                placeholder="ej: 2020"
                                required
                            />

                            <Input
                                label="Fecha de fin"
                                name="endDate"
                                value={formData.endDate || ''}
                                onChange={handleChange}
                                placeholder="ej: 2024 (o vacío si actual)"
                            />
                        </FormGrid>
                    </FormSection>

                    {/* Columna Derecha */}
                    <FormSection>
                        <FormImageField
                            label="Logo"
                            imageUrl={formData.logo}
                            emptyMessage="Sin logo"
                            onSelectClick={() => setShowImageSelector(true)}
                            onRemoveClick={() => setFormData({ ...formData, logo: '' })}
                        />

                        <Textarea
                            label="Descripción"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={8}
                            required
                        />
                    </FormSection>
                </FormGrid>

                <FormActions 
                    onCancel={onCancel}
                    isSubmitting={isSubmitting}
                    submitText={study ? 'Actualizar' : 'Crear'}
                />
            </form>
            
            <ImageSelector 
                isOpen={showImageSelector}
                onClose={() => setShowImageSelector(false)}
                onSelectImage={handleSelectImage}
                title="Seleccionar logo de institución"
                folder="images"
            />
        </>
    );
};

export default StudyForm; 