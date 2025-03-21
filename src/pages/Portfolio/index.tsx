import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ProjectGrid from '../../components/ProjectGrid/ProjectGrid';
import ProjectDetail from '../../components/ProjectDetail/ProjectDetail';
import SkillGrid, { Skill } from '../../components/SkillGrid/SkillGrid';
import { Project } from '../../components/ProjectCard/ProjectCard';

const PortfolioPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch projects
                const projectsCollection = collection(db, 'projects');
                const projectsSnapshot = await getDocs(projectsCollection);
                const projectsList = projectsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Project[];
                setProjects(projectsList);

                // Fetch skills
                const skillsCollection = collection(db, 'skills');
                const skillsSnapshot = await getDocs(skillsCollection);
                const skillsList = skillsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Skill[];
                setSkills(skillsList);

                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error al cargar los datos. Por favor, intenta de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
    };

    const handleCloseDetail = () => {
        setSelectedProject(null);
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
        <div className="space-y-24">
            {/* Sección de Skills */}
            <section>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                            Mis Habilidades
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Tecnologías y herramientas que domino y utilizo en mis proyectos.
                        </p>
                    </div>

                    <SkillGrid skills={skills} />
                </div>
            </section>

            {/* Sección de Proyectos */}
            <section>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                            Mis Proyectos
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Explora mi portafolio de proyectos, donde cada creación refleja mi pasión por el desarrollo y la innovación.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 text-sm text-red-400 bg-red-900/50 rounded-lg border border-red-800/50">
                            {error}
                        </div>
                    )}

                    <ProjectGrid projects={projects} onProjectClick={handleProjectClick} />
                </div>
            </section>

            {/* Aquí irán las futuras secciones */}
            {/* <section className="skills">...</section> */}
            {/* <section className="education">...</section> */}
            {/* <section className="experience">...</section> */}

            {selectedProject && (
                <ProjectDetail
                    project={selectedProject}
                    isOpen={!!selectedProject}
                    onClose={handleCloseDetail}
                />
            )}
        </div>
    );
};

export default PortfolioPage;
