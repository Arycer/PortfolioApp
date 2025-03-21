import React from 'react';
import {Study} from '../../types';

interface StudyCardProps {
    study: Study;
}

const StudyCard: React.FC<StudyCardProps> = ({study}) => {
    return (
        <div
            className="bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all duration-300">
            <div className="flex gap-6 p-6">
                <div className="flex-shrink-0">
                    <img
                        src={study.logo}
                        alt={study.institution}
                        className="w-24 h-24 object-contain bg-white/10 rounded-lg p-2"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-200 mb-2">
                        {study.title}
                    </h3>
                    <div className="flex items-center text-slate-400 text-sm mb-3">
                        <span className="font-medium text-indigo-400">{study.institution}</span>
                        <span className="mx-2">•</span>
                        <span>
                            {study.startDate} - {study.endDate || 'Presente'}
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {study.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudyCard; 