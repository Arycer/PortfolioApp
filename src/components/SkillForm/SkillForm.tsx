import React, {useState, useEffect} from 'react';
import {Skill} from '../../types';
import {Input, Button, ImageContainer } from '../ui/StyledComponents';
import ImageSelector from '../ui/ImageSelector';

interface SkillFormProps {
    skill?: Skill;
    onSubmit: (data: Omit<Skill, 'id'>) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

const SkillForm: React.FC<SkillFormProps> = ({
                                                 skill,
                                                 onSubmit,
                                                 onCancel,
                                                 isSubmitting
                                             }) => {
    const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
        name: '',
        icon: ''
    });
    const [showImageSelector, setShowImageSelector] = useState(false);

    useEffect(() => {
        if (skill) {
            const {id, ...skillData} = skill;
            setFormData(skillData);
        }
    }, [skill]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleSelectImage = (url: string) => {
        setFormData({
            ...formData,
            icon: url
        });
        setShowImageSelector(false);
    };

    return (
        <>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Nombre"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: React, JavaScript, Docker..."
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Icono
                            </label>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <ImageContainer
                                    className="h-24 w-24 mx-auto sm:mx-0"
                                    isEmpty={!formData.icon}
                                    emptyMessage="Sin icono"
                                >
                                    {formData.icon && (
                                        <img
                                            src={formData.icon}
                                            alt={formData.name}
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
                                        {formData.icon ? 'Cambiar icono' : 'Seleccionar icono'}
                                    </Button>
                                    {formData.icon && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFormData({...formData, icon: ''})}
                                        >
                                            Quitar icono
                                        </Button>
                                    )}
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
                                {skill ? 'Actualizar' : 'Crear'}
                            </Button>
                        </div>
                    </div>
                </form>

            <ImageSelector
                isOpen={showImageSelector}
                onClose={() => setShowImageSelector(false)}
                onSelectImage={handleSelectImage}
                title="Seleccionar icono"
                folder="skills"
            />
        </>
    );
};

export default SkillForm; 