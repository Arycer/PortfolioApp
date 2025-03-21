import React from 'react';
import {Project} from '../../types';
import Modal from '../Modal/Modal';
import LinkButton from '../LinkButton/LinkButton';

interface ProjectDetailProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({project, isOpen, onClose}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={project.title}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Columna izquierda: Imagen y enlaces */}
                <div className="space-y-4">
                    {/* Imagen */}
                    <div className="rounded-lg overflow-hidden h-64 md:h-72 bg-slate-900/50">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Tecnologías */}
                    {project.technologies && project.technologies.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">Tecnologías utilizadas</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700/50 text-indigo-200 text-xs font-medium"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Enlaces al proyecto */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-150"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-github" viewBox="0 0 16 16">
                                    <path
                                        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                </svg>
                                Código en GitHub
                            </a>
                        )}

                        {project.link && (
                            <LinkButton
                                href={project.link}
                                text={project.buttonText || "Ver proyecto"}
                            />
                        )}
                    </div>
                </div>

                {/* Columna derecha: Descripciones */}
                <div
                    className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-slate-900/30 scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-x-hidden">
                    {/* Descripción breve */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-2">Descripción</h3>
                        <p className="text-slate-300 leading-relaxed break-words">
                            {project.description}
                        </p>
                    </div>

                    {/* Descripción detallada */}
                    {project.detailedDescription && (
                        <div className="pt-2">
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">Detalles del proyecto</h3>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line break-words">
                                {project.detailedDescription}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ProjectDetail; 