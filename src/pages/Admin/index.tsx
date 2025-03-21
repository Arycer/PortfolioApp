import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Project } from '../../components/ProjectCard/ProjectCard';
import { Skill } from '../../components/SkillGrid/SkillGrid';
import ProjectForm from '../../components/ProjectForm/ProjectForm';
import SkillForm from '../../components/SkillForm/SkillForm';
import Modal from '../../components/Modal/Modal';

const AdminPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showSkillForm, setShowSkillForm] = useState(false);

    const fetchData = async () => {
        try {
            const [projectsSnapshot, skillsSnapshot] = await Promise.all([
                getDocs(collection(db, 'projects')),
                getDocs(collection(db, 'skills'))
            ]);

            const projectsList = projectsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Project[];
            
            const skillsList = skillsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Skill[];

            setProjects(projectsList);
            setSkills(skillsList);
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Project handlers
    const handleCreateProject = async (projectData: Omit<Project, 'id'>) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'projects'), projectData);
            await fetchData();
            setShowProjectForm(false);
            setError(null);
        } catch (err) {
            console.error('Error creating project:', err);
            setError('Error al crear el proyecto.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateProject = async (projectData: Omit<Project, 'id'>) => {
        if (!editingProject?.id) return;
        
        setIsSubmitting(true);
        try {
            const projectRef = doc(db, 'projects', editingProject.id);
            await updateDoc(projectRef, projectData);
            await fetchData();
            setEditingProject(null);
            setShowProjectForm(false);
            setError(null);
        } catch (err) {
            console.error('Error updating project:', err);
            setError('Error al actualizar el proyecto.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'projects', projectId));
            await fetchData();
            setError(null);
        } catch (err) {
            console.error('Error deleting project:', err);
            setError('Error al eliminar el proyecto.');
        }
    };

    // Skill handlers
    const handleCreateSkill = async (skillData: Omit<Skill, 'id'>) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'skills'), skillData);
            await fetchData();
            setShowSkillForm(false);
            setError(null);
        } catch (err) {
            console.error('Error creating skill:', err);
            setError('Error al crear la habilidad.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateSkill = async (skillData: Omit<Skill, 'id'>) => {
        if (!editingSkill?.id) return;
        
        setIsSubmitting(true);
        try {
            const skillRef = doc(db, 'skills', editingSkill.id);
            await updateDoc(skillRef, skillData);
            await fetchData();
            setEditingSkill(null);
            setShowSkillForm(false);
            setError(null);
        } catch (err) {
            console.error('Error updating skill:', err);
            setError('Error al actualizar la habilidad.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSkill = async (skillId: string) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta habilidad?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'skills', skillId));
            await fetchData();
            setError(null);
        } catch (err) {
            console.error('Error deleting skill:', err);
            setError('Error al eliminar la habilidad.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent align-[-0.125em]" />
                    <p className="mt-4 text-slate-400">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Sección de Habilidades */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                            Administrar Habilidades
                        </h2>
                        <button
                            onClick={() => setShowSkillForm(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors duration-150"
                        >
                            Nueva Habilidad
                        </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {skills.map(skill => (
                            <div
                                key={skill.id}
                                className="flex flex-col p-4 bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50"
                            >
                                <div className="flex items-center space-x-4 mb-4">
                                    <img
                                        src={skill.icon}
                                        alt={skill.name}
                                        className="w-8 h-8"
                                    />
                                    <h3 className="text-lg font-medium text-slate-200">
                                        {skill.name}
                                    </h3>
                                </div>
                                <div className="flex justify-end space-x-3 mt-auto">
                                    <button
                                        onClick={() => {
                                            setEditingSkill(skill);
                                            setShowSkillForm(true);
                                        }}
                                        className="px-3 py-1 text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-150"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => skill.id && handleDeleteSkill(skill.id)}
                                        className="px-3 py-1 text-sm text-red-400 hover:text-white bg-red-900/30 hover:bg-red-900/50 rounded-lg transition-colors duration-150"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sección de Proyectos */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                            Administrar Proyectos
                        </h2>
                        <button
                            onClick={() => setShowProjectForm(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors duration-150"
                        >
                            Nuevo Proyecto
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 text-sm text-red-400 bg-red-900/50 rounded-lg border border-red-800/50">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map(project => (
                            <div
                                key={project.id}
                                className="relative group bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden"
                            >
                                <div className="aspect-video">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-slate-200 mb-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                                        {project.description}
                                    </p>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => {
                                                setEditingProject(project);
                                                setShowProjectForm(true);
                                            }}
                                            className="px-3 py-1 text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-150"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => project.id && handleDeleteProject(project.id)}
                                            className="px-3 py-1 text-sm text-red-400 hover:text-white bg-red-900/30 hover:bg-red-900/50 rounded-lg transition-colors duration-150"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Modal de Proyecto */}
            <Modal
                isOpen={showProjectForm}
                onClose={() => {
                    setShowProjectForm(false);
                    setEditingProject(null);
                }}
                title={editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            >
                <ProjectForm
                    project={editingProject || undefined}
                    onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
                    onCancel={() => {
                        setShowProjectForm(false);
                        setEditingProject(null);
                    }}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {/* Modal de Habilidad */}
            <Modal
                isOpen={showSkillForm}
                onClose={() => {
                    setShowSkillForm(false);
                    setEditingSkill(null);
                }}
                title={editingSkill ? 'Editar Habilidad' : 'Nueva Habilidad'}
            >
                <SkillForm
                    skill={editingSkill || undefined}
                    onSubmit={editingSkill ? handleUpdateSkill : handleCreateSkill}
                    onCancel={() => {
                        setShowSkillForm(false);
                        setEditingSkill(null);
                    }}
                    isSubmitting={isSubmitting}
                />
            </Modal>
        </>
    );
};

export default AdminPage;
