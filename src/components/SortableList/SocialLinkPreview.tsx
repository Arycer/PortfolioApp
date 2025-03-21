import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {SocialLink} from '../../types';

interface SocialLinkPreviewProps {
    socialLink: SocialLink;
    id: string;
    onDelete?: () => void;
    onEdit?: () => void;
}

const SocialLinkPreview: React.FC<SocialLinkPreviewProps> = ({
                                                                 socialLink,
                                                                 id,
                                                                 onDelete,
                                                                 onEdit
                                                             }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg mb-2 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
        >
            <div className="flex items-center flex-1 gap-3">
                {/* Icono de la red social */}
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-700/50 rounded">
                    <img
                        src={socialLink.icon}
                        alt={`${socialLink.name} icon`}
                        className="w-5 h-5"
                    />
                </div>

                {/* Información de la red social */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{socialLink.name}</p>
                    <p className="text-xs text-slate-400 truncate">{socialLink.url}</p>
                </div>

                {/* Acciones */}
                <div className="flex-shrink-0 flex space-x-2">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="p-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/30 rounded"
                        >
                            Editar
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="p-1 text-xs text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded"
                        >
                            Eliminar
                        </button>
                    )}

                    {/* Indicador de arrastrar */}
                    <div className="p-1 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialLinkPreview; 