import React, {useEffect, useState} from 'react';
import {Job} from '../JobCard/JobCard';

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

    useEffect(() => {
        if (job) {
            const {id, ...jobData} = job;
            setFormData(jobData);
        }
    }, [job]);

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
                    Cargo
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
                <label htmlFor="company" className="block text-sm font-medium text-slate-300">
                    Empresa
                </label>
                <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
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

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="gradientFrom" className="block text-sm font-medium text-slate-300">
                        Color inicial del gradiente
                    </label>
                    <div className="mt-1 flex gap-2">
                        <input
                            type="color"
                            id="gradientFrom"
                            name="gradientFrom"
                            value={formData.gradientFrom}
                            onChange={handleChange}
                            className="h-10 w-20 rounded border border-slate-700 bg-slate-900/50"
                        />
                        <input
                            type="text"
                            value={formData.gradientFrom}
                            onChange={handleChange}
                            name="gradientFrom"
                            className="flex-1 px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="gradientTo" className="block text-sm font-medium text-slate-300">
                        Color final del gradiente
                    </label>
                    <div className="mt-1 flex gap-2">
                        <input
                            type="color"
                            id="gradientTo"
                            name="gradientTo"
                            value={formData.gradientTo}
                            onChange={handleChange}
                            className="h-10 w-20 rounded border border-slate-700 bg-slate-900/50"
                        />
                        <input
                            type="text"
                            value={formData.gradientTo}
                            onChange={handleChange}
                            name="gradientTo"
                            className="flex-1 px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>
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
                    {isSubmitting ? 'Guardando...' : job ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default JobForm; 