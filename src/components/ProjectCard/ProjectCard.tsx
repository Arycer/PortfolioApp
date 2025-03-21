import React from 'react';
import LinkButton from '../LinkButton/LinkButton';

export interface Project {
    id?: string;
    title: string;
    description: string;
    image: string;
    link?: string;
    buttonText?: string;
}

interface ProjectCardProps {
    project: Project;
    onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    return (
        <div className="relative bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden transition-all duration-300 ease-in-out">
            <div
                onClick={onClick}
                className="group cursor-pointer"
            >
                <div className="aspect-video">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-200 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300 ease-in-out">
                        {project.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2">
                        {project.description}
                    </p>
                </div>
            </div>
            {project.link && (
                <div className="p-4 pt-0" onClick={e => e.stopPropagation()}>
                    <LinkButton 
                        href={project.link} 
                        text={project.buttonText}
                    />
                </div>
            )}
        </div>
    );
};

export default ProjectCard; 