import React from 'react';
import LinkButton from '../LinkButton/LinkButton';
import {Project} from '../../types';

interface ProjectCardProps {
    project: Project;
    onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({project, onClick}) => {
    return (
        <div
            className="relative bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden transition-all duration-300 ease-in-out h-[400px] flex flex-col">
            <div
                onClick={onClick}
                className="group cursor-pointer flex-1 flex flex-col"
            >
                <div className="h-48 bg-slate-900/50">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-200 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300 ease-in-out">
                        {project.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-3 flex-grow">
                        {project.description}
                    </p>
                </div>
            </div>
            {project.link && (
                <div className="p-4 pt-0 mt-auto" onClick={e => e.stopPropagation()}>
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