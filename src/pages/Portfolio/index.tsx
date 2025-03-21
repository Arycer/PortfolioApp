import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ProjectGrid from '../../components/ProjectGrid/ProjectGrid';
import ProjectDetail from '../../components/ProjectDetail/ProjectDetail';
import SkillGrid, { Skill } from '../../components/SkillGrid/SkillGrid';
import { Project } from '../../components/ProjectCard/ProjectCard';
import { Study } from '../../components/StudyCard/StudyCard';
import { Job } from '../../components/JobCard/JobCard';
import { AboutMeData } from '../../components/AboutMe/AboutMe';
import StudyCard from '../../components/StudyCard/StudyCard';
import JobCard from '../../components/JobCard/JobCard';
import AboutMe from '../../components/AboutMe/AboutMe';
import ContactSection from '../../components/ContactSection/ContactSection';

const PortfolioPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [studies, setStudies] = useState<Study[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [aboutMe, setAboutMe] = useState<AboutMeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
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
                    ...doc.data()
                })) as Project[];

                const skillsList = skillsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Skill[];

                const studiesList = studiesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Study[];

                const jobsList = jobsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Job[];

                // Sort projects and skills by order property if available
                const sortedProjects = [...projectsList].sort((a, b) => {
                    // If order is defined for both items, sort by order
                    if (a.order !== undefined && b.order !== undefined) {
                        return a.order - b.order;
                    }
                    // If only a has order, it comes first
                    if (a.order !== undefined) return -1;
                    // If only b has order, it comes first
                    if (b.order !== undefined) return 1;
                    // If neither has order, maintain original order
                    return 0;
                });

                const sortedSkills = [...skillsList].sort((a, b) => {
                    if (a.order !== undefined && b.order !== undefined) {
                        return a.order - b.order;
                    }
                    if (a.order !== undefined) return -1;
                    if (b.order !== undefined) return 1;
                    return 0;
                });

                // Tomamos el primer documento de aboutMe (solo debería haber uno)
                const aboutMeData = aboutMeSnapshot.docs[0];
                if (aboutMeData) {
                    setAboutMe({
                        id: aboutMeData.id,
                        ...aboutMeData.data()
                    } as AboutMeData);
                }

                setProjects(sortedProjects);
                setSkills(sortedSkills);
                setStudies(studiesList);
                setJobs(jobsList);
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
            {/* Sección About Me */}
            {aboutMe && <AboutMe data={aboutMe} />}

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

            {/* Sección de Estudios */}
            <section>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                            Mi Formación
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Mi trayectoria académica y formación profesional.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {studies.map(study => (
                            <StudyCard key={study.id} study={study} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Sección de Experiencia Laboral */}
            <section>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                            Mi Experiencia
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Mi trayectoria profesional y experiencia laboral.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {jobs.map(job => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
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

            {/* Sección de Contacto */}
            {aboutMe && <ContactSection socialLinks={aboutMe.socialLinks} contactEmail={aboutMe.contactEmail} />}

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
