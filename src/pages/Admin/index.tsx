import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Project, Skill, Study, Job, AboutMeData } from '../../types';
import ProjectForm from '../../components/ProjectForm/ProjectForm';
import SkillForm from '../../components/SkillForm/SkillForm';
import StudyForm from '../../components/StudyForm/StudyForm';
import JobForm from '../../components/JobForm/JobForm';
import AboutMeForm from '../../components/AboutMeForm/AboutMeForm';
import StudyCard from '../../components/StudyCard/StudyCard';
import JobCard from '../../components/JobCard/JobCard';
import AboutMe from '../../components/AboutMe/AboutMe';
import Modal from '../../components/Modal/Modal';
import SortableList from '../../components/SortableList/SortableList';
import ProjectPreview from '../../components/SortableList/ProjectPreview';
import SkillPreview from '../../components/SortableList/SkillPreview';

const AdminPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [studies, setStudies] = useState<Study[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [editingStudy, setEditingStudy] = useState<Study | null>(null);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [showStudyForm, setShowStudyForm] = useState(false);
    const [showJobForm, setShowJobForm] = useState(false);
    const [showAboutMeForm, setShowAboutMeForm] = useState(false);
    const [aboutMe, setAboutMe] = useState<AboutMeData | null>(null);
    
    // Nuevos estados para controlar la vista de listas ordenables
    const [projectsViewMode, setProjectsViewMode] = useState<'grid' | 'list'>('grid');
    const [skillsViewMode, setSkillsViewMode] = useState<'grid' | 'list'>('grid');
    const [isOrderUpdating, setIsOrderUpdating] = useState(false);

    const fetchData = async () => {
        try {
            const [
                projectsSnapshot, 
                skillsSnapshot, 
                studiesSnapshot, 
                jobsSnapshot,
                aboutMeSnapshot
            ] = await Promise.all([
                getDocs(collection(db, 'projects')),
                getDocs(collection(db, 'skills')),
                getDocs(collection(db, 'studies')),
                getDocs(collection(db, 'jobs')),
                getDocs(collection(db, 'aboutMe'))
            ]);

            const projectsList = projectsSnapshot.docs.map(doc => ({
                id: doc.id,
                order: doc.data().order || 0, // Asegurarnos de tener una propiedad order
                ...doc.data()
            })) as Project[];
            
            // Ordenar proyectos por la propiedad order
            projectsList.sort((a, b) => (a.order || 0) - (b.order || 0));
            
            const skillsList = skillsSnapshot.docs.map(doc => ({
                id: doc.id,
                order: doc.data().order || 0, // Asegurarnos de tener una propiedad order
                ...doc.data()
            })) as Skill[];
            
            // Ordenar habilidades por la propiedad order
            skillsList.sort((a, b) => (a.order || 0) - (b.order || 0));

            const studiesList = studiesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Study[];

            const jobsList = jobsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Job[];

            setProjects(projectsList);
            setSkills(skillsList);
            setStudies(studiesList);
            setJobs(jobsList);

            // Tomamos el primer documento de aboutMe (solo debería haber uno)
            const aboutMeData = aboutMeSnapshot.docs[0];
            if (aboutMeData) {
                setAboutMe({
                    id: aboutMeData.id,
                    ...aboutMeData.data()
                } as AboutMeData);
            }

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

    const initializeAboutMe = async () => {
        try {
            const initialData = {
                greeting: "¡Hola! Soy Arycer",
                description: "Desarrollador Full Stack apasionado por crear soluciones innovadoras y experiencias digitales excepcionales. Con experiencia en desarrollo web moderno y un enfoque en la calidad del código y la experiencia del usuario.",
                socialLinks: [
                    {
                        name: "GitHub",
                        url: "https://github.com/arycer",
                        icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg"
                    },
                    {
                        name: "LinkedIn",
                        url: "https://linkedin.com/in/arycer",
                        icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg"
                    }
                ]
            };

            // Primero creamos la colección si no existe
            const aboutMeCollection = collection(db, 'aboutMe');
            
            // Luego creamos el documento con ID específico
            const aboutMeRef = doc(aboutMeCollection, 'main');
            await setDoc(aboutMeRef, initialData);
            
            await fetchData();
            setError(null);
        } catch (err) {
            console.error('Error initializing about me:', err);
            setError('Error al inicializar la información.');
        }
    };

    // Job handlers
    const handleCreateJob = async (jobData: Omit<Job, 'id'>) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'jobs'), jobData);
            await fetchData();
            setShowJobForm(false);
            setError(null);
        } catch (err) {
            console.error('Error creating job:', err);
            setError('Error al crear el trabajo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateJob = async (jobData: Omit<Job, 'id'>) => {
        if (!editingJob?.id) return;
        
        setIsSubmitting(true);
        try {
            const jobRef = doc(db, 'jobs', editingJob.id);
            await updateDoc(jobRef, jobData);
            await fetchData();
            setEditingJob(null);
            setShowJobForm(false);
            setError(null);
        } catch (err) {
            console.error('Error updating job:', err);
            setError('Error al actualizar el trabajo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteJob = async (jobId: string) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este trabajo?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'jobs', jobId));
            await fetchData();
            setError(null);
        } catch (err) {
            console.error('Error deleting job:', err);
            setError('Error al eliminar el trabajo.');
        }
    };

    // Study handlers
    const handleCreateStudy = async (studyData: Omit<Study, 'id'>) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'studies'), studyData);
            await fetchData();
            setShowStudyForm(false);
            setError(null);
        } catch (err) {
            console.error('Error creating study:', err);
            setError('Error al crear el estudio.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStudy = async (studyData: Omit<Study, 'id'>) => {
        if (!editingStudy?.id) return;
        
        setIsSubmitting(true);
        try {
            const studyRef = doc(db, 'studies', editingStudy.id);
            await updateDoc(studyRef, studyData);
            await fetchData();
            setEditingStudy(null);
            setShowStudyForm(false);
            setError(null);
        } catch (err) {
            console.error('Error updating study:', err);
            setError('Error al actualizar el estudio.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStudy = async (studyId: string) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este estudio?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'studies', studyId));
            await fetchData();
            setError(null);
        } catch (err) {
            console.error('Error deleting study:', err);
            setError('Error al eliminar el estudio.');
        }
    };

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

    // About Me handlers
    const handleUpdateAboutMe = async (aboutMeData: Omit<AboutMeData, 'id'>) => {
        setIsSubmitting(true);
        try {
            if (aboutMe?.id) {
                // Actualizar documento existente
                const aboutMeRef = doc(db, 'aboutMe', aboutMe.id);
                await updateDoc(aboutMeRef, aboutMeData);
            } else {
                // Crear nuevo documento con ID específico
                const aboutMeRef = doc(db, 'aboutMe', 'main');
                await setDoc(aboutMeRef, aboutMeData);
            }
            await fetchData();
            setShowAboutMeForm(false);
            setError(null);
        } catch (err) {
            console.error('Error updating about me:', err);
            setError('Error al actualizar la información.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Función para actualizar el orden de los proyectos
    const handleProjectsReorder = async (reorderedProjects: Project[]) => {
        setProjects(reorderedProjects);
        
        try {
            setIsOrderUpdating(true);
            const batch = writeBatch(db);
            
            // Actualizar el orden de cada proyecto
            reorderedProjects.forEach((project, index) => {
                if (project.id) {
                    const projectRef = doc(db, 'projects', project.id);
                    batch.update(projectRef, { order: index });
                }
            });
            
            await batch.commit();
            setError(null);
        } catch (err) {
            console.error('Error updating projects order:', err);
            setError('Error al actualizar el orden de los proyectos.');
            await fetchData(); // Recargar datos originales si hay error
        } finally {
            setIsOrderUpdating(false);
        }
    };
    
    // Función para actualizar el orden de las habilidades
    const handleSkillsReorder = async (reorderedSkills: Skill[]) => {
        setSkills(reorderedSkills);
        
        try {
            setIsOrderUpdating(true);
            const batch = writeBatch(db);
            
            // Actualizar el orden de cada habilidad
            reorderedSkills.forEach((skill, index) => {
                if (skill.id) {
                    const skillRef = doc(db, 'skills', skill.id);
                    batch.update(skillRef, { order: index });
                }
            });
            
            await batch.commit();
            setError(null);
        } catch (err) {
            console.error('Error updating skills order:', err);
            setError('Error al actualizar el orden de las habilidades.');
            await fetchData(); // Recargar datos originales si hay error
        } finally {
            setIsOrderUpdating(false);
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
                {/* Header con acciones principales */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                        Panel Admin
                    </h1>
                </div>

                {/* Sección About Me */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                            Sobre Mí
                        </h2>
                        {aboutMe ? (
                            <button
                                onClick={() => setShowAboutMeForm(true)}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors duration-150"
                            >
                                Editar Información
                            </button>
                        ) : (
                            <button
                                onClick={initializeAboutMe}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors duration-150"
                            >
                                Inicializar Información
                            </button>
                        )}
                    </div>

                    {aboutMe && (
                        <div className="relative">
                            <AboutMe data={aboutMe} />
                        </div>
                    )}
                </section>

                {/* Sección de Experiencia Laboral */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                            Administrar Experiencia
                        </h2>
                        <button
                            onClick={() => setShowJobForm(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors duration-150"
                        >
                            Nuevo Trabajo
                        </button>
                    </div>

                    <div className="space-y-8">
                        {jobs.map(job => (
                            <div
                                key={job.id}
                                className="relative"
                            >
                                <JobCard job={job} />
                                <div className="absolute top-4 right-4 flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setEditingJob(job);
                                            setShowJobForm(true);
                                        }}
                                        className="px-3 py-1 text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-150"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => job.id && handleDeleteJob(job.id)}
                                        className="px-3 py-1 text-sm text-red-400 hover:text-white bg-red-900/30 hover:bg-red-900/50 rounded-lg transition-colors duration-150"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sección de Estudios */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                            Administrar Formación
                        </h2>
                        <button
                            onClick={() => setShowStudyForm(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors duration-150"
                        >
                            Nuevo Estudio
                        </button>
                    </div>

                    <div className="space-y-6">
                        {studies.map(study => (
                            <div
                                key={study.id}
                                className="relative bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden"
                            >
                                <StudyCard study={study} />
                                <div className="absolute top-4 right-4 flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setEditingStudy(study);
                                            setShowStudyForm(true);
                                        }}
                                        className="px-3 py-1 text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-150"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => study.id && handleDeleteStudy(study.id)}
                                        className="px-3 py-1 text-sm text-red-400 hover:text-white bg-red-900/30 hover:bg-red-900/50 rounded-lg transition-colors duration-150"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sección de Habilidades */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                            Administrar Habilidades
                        </h2>
                        <div className="flex space-x-3">
                            <div className="flex bg-slate-800/50 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setSkillsViewMode('grid')}
                                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                                        skillsViewMode === 'grid' 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setSkillsViewMode('list')}
                                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                                        skillsViewMode === 'list' 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                onClick={() => setShowSkillForm(true)}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors duration-150"
                            >
                                Nueva Habilidad
                            </button>
                        </div>
                    </div>

                    {isOrderUpdating && (
                        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg flex items-center text-sm text-blue-300">
                            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Actualizando orden...
                        </div>
                    )}

                    {skillsViewMode === 'grid' ? (
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {skills.map(skill => (
                                <div
                                    key={skill.id}
                                    className="flex flex-col p-4 bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50"
                                >
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="relative w-8 h-8">
                                            <img
                                                src={skill.icon}
                                                alt={skill.name}
                                                className="absolute top-0 left-0 w-full h-full"
                                                style={{
                                                    objectFit: 'scale-down',
                                                    padding: '1px'
                                                }}
                                            />
                                        </div>
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
                    ) : (
                        <div className="bg-slate-800/20 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
                            <p className="text-sm text-slate-400 mb-4">Arrastra y suelta para reordenar las habilidades. El nuevo orden se guardará automáticamente.</p>
                            <SortableList
                                items={skills}
                                itemKey={(skill) => skill.id || skill.name}
                                renderItem={(skill) => (
                                    <SkillPreview
                                        skill={skill}
                                        id={skill.id || skill.name}
                                        onEdit={(skill) => {
                                            setEditingSkill(skill);
                                            setShowSkillForm(true);
                                        }}
                                        onDelete={(skillId) => handleDeleteSkill(skillId)}
                                    />
                                )}
                                onReorder={handleSkillsReorder}
                                droppableId="skills-list"
                                className="space-y-2"
                            />
                        </div>
                    )}
                </section>

                {/* Sección de Proyectos */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                            Administrar Proyectos
                        </h2>
                        <div className="flex space-x-3">
                            <div className="flex bg-slate-800/50 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setProjectsViewMode('grid')}
                                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                                        projectsViewMode === 'grid' 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setProjectsViewMode('list')}
                                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                                        projectsViewMode === 'list' 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                onClick={() => setShowProjectForm(true)}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors duration-150"
                            >
                                Nuevo Proyecto
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 text-sm text-red-400 bg-red-900/50 rounded-lg border border-red-800/50">
                            {error}
                        </div>
                    )}

                    {isOrderUpdating && (
                        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg flex items-center text-sm text-blue-300">
                            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Actualizando orden...
                        </div>
                    )}

                    {projectsViewMode === 'grid' ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map(project => (
                                <div
                                    key={project.id}
                                    className="relative group bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden h-[350px] flex flex-col"
                                >
                                    <div className="h-48 bg-slate-900/50">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-contain bg-slate-900/50"
                                        />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-lg font-semibold text-slate-200 mb-2">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-grow">
                                            {project.description}
                                        </p>
                                        <div className="flex justify-end space-x-3 mt-auto">
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
                    ) : (
                        <div className="bg-slate-800/20 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
                            <p className="text-sm text-slate-400 mb-4">Arrastra y suelta para reordenar los proyectos. El nuevo orden se guardará automáticamente.</p>
                            <SortableList
                                items={projects}
                                itemKey={(project) => project.id || project.title}
                                renderItem={(project) => (
                                    <ProjectPreview
                                        project={project}
                                        id={project.id || project.title}
                                        onEdit={(project) => {
                                            setEditingProject(project);
                                            setShowProjectForm(true);
                                        }}
                                        onDelete={(projectId) => handleDeleteProject(projectId)}
                                    />
                                )}
                                onReorder={handleProjectsReorder}
                                droppableId="projects-list"
                                className="space-y-2"
                            />
                        </div>
                    )}
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

            {/* Modal de Estudio */}
            <Modal
                isOpen={showStudyForm}
                onClose={() => {
                    setShowStudyForm(false);
                    setEditingStudy(null);
                }}
                title={editingStudy ? 'Editar Estudio' : 'Nuevo Estudio'}
            >
                <StudyForm
                    study={editingStudy || undefined}
                    onSubmit={editingStudy ? handleUpdateStudy : handleCreateStudy}
                    onCancel={() => {
                        setShowStudyForm(false);
                        setEditingStudy(null);
                    }}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {/* Modal de Trabajo */}
            <Modal
                isOpen={showJobForm}
                onClose={() => {
                    setShowJobForm(false);
                    setEditingJob(null);
                }}
                title={editingJob ? 'Editar Trabajo' : 'Nuevo Trabajo'}
            >
                <JobForm
                    job={editingJob || undefined}
                    onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
                    onCancel={() => {
                        setShowJobForm(false);
                        setEditingJob(null);
                    }}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {/* Modal de About Me */}
            <Modal
                isOpen={showAboutMeForm}
                onClose={() => setShowAboutMeForm(false)}
                title="Editar Información Personal"
            >
                <AboutMeForm
                    data={aboutMe || undefined}
                    onSubmit={handleUpdateAboutMe}
                    onCancel={() => setShowAboutMeForm(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>
        </>
    );
};

export default AdminPage;
