import React from 'react';
import {Skill} from '../../types';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

interface SkillPreviewProps {
    skill: Skill;
    onEdit: (skill: Skill) => void;
    onDelete: (skillId: string) => void;
    id: string;
}

const SkillPreview: React.FC<SkillPreviewProps> = ({skill, onEdit, onDelete, id}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden group"
        >
            {/* Indicador de arrastrar */}
            <div
                className="p-2 mr-2 flex-shrink-0 text-slate-500 cursor-grab"
                {...attributes}
                {...listeners}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16"/>
                </svg>
            </div>

            {/* Icono de la habilidad */}
            <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center">
                <div className="relative w-8 h-8">
                    <img
                        src={skill.icon}
                        alt={skill.name}
                        className="absolute top-0 left-0 w-full h-full"
                        style={{
                            objectFit: 'scale-down',
                            padding: '1px'
                        }}
                    />
                </div>
            </div>

            {/* Nombre de la habilidad */}
            <div className="p-4 flex-grow">
                <h3 className="text-md font-medium text-slate-200">{skill.name}</h3>
            </div>

            {/* Acciones */}
            <div className="flex p-2 space-x-2">
                <button
                    onClick={() => onEdit(skill)}
                    className="p-1.5 text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </button>
                <button
                    onClick={() => skill.id && onDelete(skill.id)}
                    className="p-1.5 text-sm text-red-400 hover:text-white bg-red-900/30 hover:bg-red-900/50 rounded-lg transition-colors duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SkillPreview; 