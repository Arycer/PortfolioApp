import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ProjectGrid from '../../components/ProjectGrid/ProjectGrid';
import ProjectDetail from '../../components/ProjectDetail/ProjectDetail';
import SkillGrid from '../../components/SkillGrid/SkillGrid';
import { Project, Skill, Study, Job, AboutMeData } from '../../types';
import StudyCard from '../../components/StudyCard/StudyCard';
import JobCard from '../../components/JobCard/JobCard';
import AboutMe from '../../components/AboutMe/AboutMe';
import ContactSection from '../../components/ContactSection/ContactSection';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLocation } from 'react-router-dom';

const PortfolioPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [studies, setStudies] = useState<Study[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [aboutMe, setAboutMe] = useState<AboutMeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Inicializar AOS
        AOS.init({
            duration: 800,
            once: false,
            mirror: true,
            offset: 100,
            easing: 'ease-in-out'
        });

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

        // Configurar el listener para el scroll
        const handleScroll = () => {
            if (window.scrollY > 500) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Actualizar AOS cuando cambia el estado de carga
    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        }
    }, [loading]);

    // Efecto para manejar el scroll a secciones específicas cuando se carga la página con un hash
    useEffect(() => {
        // Si la URL tiene un hash
        if (location.hash) {
            // Quitar el # para obtener el ID de la sección
            const sectionId = location.hash.slice(1);
            const section = document.getElementById(sectionId);
            
            if (section) {
                // Agregamos un pequeño retraso para asegurar que todas las secciones estén renderizadas
                setTimeout(() => {
                    window.scrollTo({
                        top: section.offsetTop - 80, // Ajuste para el header fijo
                        behavior: 'smooth'
                    });
                }, 500);
            }
        }
    }, [location.hash, loading]); // Dependemos de loading para asegurar que se haya cargado todo el contenido

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
    };

    const handleCloseDetail = () => {
        setSelectedProject(null);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
        <div className="space-y-24 relative">
            {/* Sección About Me */}
            {aboutMe && (
                <div id="about" data-aos="fade-down">
                    <AboutMe data={aboutMe} />
                </div>
            )}

            {/* Sección de Skills */}
            <section id="skills" data-aos="fade-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12" data-aos="zoom-in" data-aos-delay="100">
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                            Mis Habilidades
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Tecnologías y herramientas que domino y utilizo en mis proyectos.
                        </p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="200">
                        <SkillGrid skills={skills} />
                    </div>
                </div>
            </section>

            {/* Sección de Estudios */}
            <section id="education" data-aos="fade-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12" data-aos="zoom-in" data-aos-delay="100">
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                            Mi Formación
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Mi trayectoria académica y formación profesional.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {studies.map((study, index) => (
                            <div 
                                key={study.id} 
                                data-aos="fade-right" 
                                data-aos-delay={100 + (index * 50)}
                            >
                                <StudyCard study={study} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sección de Experiencia Laboral */}
            <section id="experience" data-aos="fade-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12" data-aos="zoom-in" data-aos-delay="100">
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                            Mi Experiencia
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Mi trayectoria profesional y experiencia laboral.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {jobs.map((job, index) => (
                            <div 
                                key={job.id} 
                                data-aos="fade-left" 
                                data-aos-delay={100 + (index * 50)}
                            >
                                <JobCard job={job} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sección de Proyectos */}
            <section id="projects" data-aos="fade-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12" data-aos="zoom-in" data-aos-delay="100">
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                            Mis Proyectos
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Explora los proyectos en los que he trabajado.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 text-sm text-red-400 bg-red-900/50 rounded-lg border border-red-800/50">
                            {error}
                        </div>
                    )}

                    <div data-aos="fade-up" data-aos-delay="200">
                        <ProjectGrid projects={projects} onProjectClick={handleProjectClick} />
                    </div>
                </div>
            </section>

            {/* Sección de Contacto */}
            {aboutMe && (
                <div id="contact" data-aos="fade-up" data-aos-offset="200">
                    <ContactSection socialLinks={aboutMe.socialLinks} contactEmail={aboutMe.contactEmail} />
                </div>
            )}

            {selectedProject && (
                <ProjectDetail
                    project={selectedProject}
                    isOpen={!!selectedProject}
                    onClose={handleCloseDetail}
                />
            )}

            {/* Botón de scroll to top */}
            <button 
                onClick={scrollToTop}
                className={`fixed right-6 bottom-6 p-3 rounded-full bg-indigo-600 text-white shadow-lg transform transition-all duration-300 z-50 ${
                    showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                aria-label="Volver arriba"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
    );
};

export default PortfolioPage;
