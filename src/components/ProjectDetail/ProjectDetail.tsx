import React from 'react';
import { Project } from '../ProjectCard/ProjectCard';
import Modal from '../Modal/Modal';
import LinkButton from '../LinkButton/LinkButton';

interface ProjectDetailProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={project.title}>
            <div className="space-y-6">
                {/* Imagen */}
                <div className="rounded-lg overflow-hidden">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Descripción */}
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        {project.description}
                    </p>

                    {/* Botón de acción si hay link */}
                    {project.link && (
                        <div className="flex justify-end">
                            <LinkButton 
                                href={project.link} 
                                text={project.buttonText}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ProjectDetail; 