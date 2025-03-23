import React, {useEffect, useState} from 'react';
import {Job} from '../../types';
import {
    Input, 
    Textarea, 
    FormGrid, 
    FormSection, 
    ColorInput, 
    FormImageField, 
    FormActions
} from '../ui/StyledComponents';
import ImageSelector from '../ui/ImageSelector';

interface JobFormProps {
    job?: Job;
    onSubmit: (jobData: Omit<Job, 'id'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const JobForm: React.FC<JobFormProps> = ({
    job,
    onSubmit,
    onCancel,
    isSubmitting
}) => {
    const [formData, setFormData] = useState<Omit<Job, 'id'>>({
        title: '',
        company: '',
        description: '',
        startDate: '',
        endDate: '',
        logo: '',
        gradientFrom: '#4F46E5', // Color por defecto (indigo-600)
        gradientTo: '#7C3AED'    // Color por defecto (purple-600)
    });
    
    const [showImageSelector, setShowImageSelector] = useState(false);

    useEffect(() => {
        if (job) {
            const {id, ...jobData} = job;
            setFormData(jobData);
        }
    }, [job]);

    const handleSelectImage = (url: string) => {
        setFormData({
            ...formData,
            logo: url
        });
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
                            label="Cargo"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Empresa"
                            name="company"
                            value={formData.company}
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

                        <FormGrid columns={2}>
                            <ColorInput
                                label="Color inicial del gradiente"
                                id="gradientFrom"
                                name="gradientFrom"
                                value={formData.gradientFrom}
                                onChange={handleChange}
                            />

                            <ColorInput
                                label="Color final del gradiente"
                                id="gradientTo"
                                name="gradientTo"
                                value={formData.gradientTo}
                                onChange={handleChange}
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
                        
                        {/* Previsualización del gradiente */}
                        <div className="mt-6 p-4 rounded-lg border border-slate-700/50">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Previsualización del gradiente
                            </label>
                            <div 
                                className="h-16 w-full rounded-lg"
                                style={{
                                    background: `linear-gradient(to right, ${formData.gradientFrom}, ${formData.gradientTo})`
                                }}
                            ></div>
                        </div>

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
                    submitText={job ? 'Actualizar' : 'Crear'}
                />
            </form>
            
            <ImageSelector 
                isOpen={showImageSelector}
                onClose={() => setShowImageSelector(false)}
                onSelectImage={handleSelectImage}
                title="Seleccionar logo de empresa"
                folder="images"
            />
        </>
    );
};

export default JobForm; 