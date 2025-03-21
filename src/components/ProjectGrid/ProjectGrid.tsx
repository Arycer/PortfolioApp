import React from 'react';
import ProjectCard, {Project} from '../ProjectCard/ProjectCard';

interface ProjectGridProps {
    projects: Project[];
    onProjectClick?: (project: Project) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({projects, onProjectClick}) => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id || project.title}
                        project={project}
                        onClick={() => onProjectClick?.(project)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectGrid; 