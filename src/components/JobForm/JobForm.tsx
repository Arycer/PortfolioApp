import React, {useEffect, useState} from 'react';
import {Job} from '../../types';
import {Input, Textarea, Button, Panel, ImageContainer} from '../ui/StyledComponents';
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
            <Panel className="w-full max-w-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                        {job ? 'Editar Experiencia Laboral' : 'Nueva Experiencia Laboral'}
                    </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
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

                        <Textarea
                            label="Descripción"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Logo
                            </label>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <ImageContainer
                                    className="h-24 w-24 mx-auto sm:mx-0"
                                    isEmpty={!formData.logo}
                                    emptyMessage="Sin logo"
                                >
                                    {formData.logo && (
                                        <img
                                            src={formData.logo}
                                            alt={formData.company}
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
                                        {formData.logo ? 'Cambiar logo' : 'Seleccionar logo'}
                                    </Button>
                                    {formData.logo && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFormData({ ...formData, logo: '' })}
                                        >
                                            Quitar logo
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="gradientFrom" className="block text-sm font-medium text-slate-300 mb-2">
                                    Color inicial del gradiente
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        id="gradientFrom"
                                        name="gradientFrom"
                                        value={formData.gradientFrom}
                                        onChange={handleChange}
                                        className="h-10 w-20 rounded border border-slate-700 bg-slate-900/50"
                                    />
                                    <Input
                                        name="gradientFrom"
                                        value={formData.gradientFrom}
                                        onChange={handleChange}
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="gradientTo" className="block text-sm font-medium text-slate-300 mb-2">
                                    Color final del gradiente
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        id="gradientTo"
                                        name="gradientTo"
                                        value={formData.gradientTo}
                                        onChange={handleChange}
                                        className="h-10 w-20 rounded border border-slate-700 bg-slate-900/50"
                                    />
                                    <Input
                                        name="gradientTo"
                                        value={formData.gradientTo}
                                        onChange={handleChange}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-700/50 pt-6 mt-6">
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
                                {job ? 'Actualizar' : 'Crear'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Panel>
            
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