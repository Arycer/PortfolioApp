import React from 'react';

export interface Skill {
    id?: string;
    name: string;
    icon: string;
    order?: number;
}

interface SkillGridProps {
    skills: Skill[];
}

const SkillGrid: React.FC<SkillGridProps> = ({skills}) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {skills.map((skill, index) => (
                <div
                    key={skill.id || skill.name}
                    className="flex flex-col items-center p-4 bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 transition-all duration-300 hover:border-slate-600/50 hover:shadow-lg hover:shadow-slate-900/20"
                    data-aos="flip-left"
                    data-aos-delay={50 * (index % 6)}
                    data-aos-duration="500"
                >
                    <div className="relative w-12 h-12 mb-3">
                        <img
                            src={skill.icon}
                            alt={skill.name}
                            className="absolute top-0 left-0 w-full h-full"
                            style={{
                                objectFit: 'scale-down',
                                padding: '2px'
                            }}
                        />
                    </div>
                    <span className="text-sm font-medium text-slate-300 text-center">
                        {skill.name}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default SkillGrid;