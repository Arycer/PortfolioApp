import React from 'react';
import { Job } from '../../types';

interface JobCardProps {
    job: Job;
}

const JobCard: React.FC<JobCardProps> = ({job}) => {
    return (
        <div
            className="bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all duration-300">
            <div className="relative">
                {/* Sección superior con gradiente y logo */}
                <div
                    className="h-56 flex items-center justify-center relative"
                    style={{
                        background: `linear-gradient(to right, ${job.gradientFrom}, ${job.gradientTo})`
                    }}
                >
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div
                        className="w-40 h-40 flex items-center justify-center p-4 relative backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                        <img
                            src={job.logo}
                            alt={job.company}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Sección inferior con información */}
                <div className="p-8">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-slate-200 mb-2">
                            {job.title}
                        </h3>
                        <div className="text-lg font-medium text-indigo-400 mb-2">
                            {job.company}
                        </div>
                        <div className="text-sm text-slate-400">
                            {job.startDate} - {job.endDate || 'Presente'}
                        </div>
                    </div>
                    <p className="text-slate-400 text-base leading-relaxed">
                        {job.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JobCard; 