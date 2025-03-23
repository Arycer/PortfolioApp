import React, {useEffect, useState} from 'react';
import {Study} from '../../types';
import {Input, Textarea, Button, ImageContainer } from '../ui/StyledComponents';
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

                            <Input
                                label="Institución"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Logo
                                </label>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                                    <ImageContainer
                                        className="h-32 w-32 mx-auto sm:mx-0"
                                        isEmpty={!formData.logo}
                                        emptyMessage="Sin logo"
                                    >
                                        {formData.logo && (
                                            <img
                                                src={formData.logo}
                                                alt={formData.institution}
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

                            <Textarea
                                label="Descripción"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={10}
                                required
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
                                {study ? 'Actualizar' : 'Crear'}
                            </Button>
                        </div>
                    </div>
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