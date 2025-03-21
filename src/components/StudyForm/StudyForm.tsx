import React, {useEffect, useState} from 'react';
import {Study} from '../StudyCard/StudyCard';

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

    useEffect(() => {
        if (study) {
            const {id, ...studyData} = study;
            setFormData(studyData);
        }
    }, [study]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-300">
                    Título
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label htmlFor="institution" className="block text-sm font-medium text-slate-300">
                    Institución
                </label>
                <input
                    type="text"
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                    Descripción
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-300">
                        Fecha de inicio
                    </label>
                    <input
                        type="text"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        placeholder="ej: 2020"
                        className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-300">
                        Fecha de fin
                    </label>
                    <input
                        type="text"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        placeholder="ej: 2024 (o vacío si actual)"
                        className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="logo" className="block text-sm font-medium text-slate-300">
                    URL del logo
                </label>
                <input
                    type="url"
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                />
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-150"
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Guardando...' : study ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default StudyForm; 