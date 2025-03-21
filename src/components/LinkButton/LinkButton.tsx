import React from 'react';

interface LinkButtonProps {
    href: string;
    text?: string;
    className?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({href, text = 'Ver proyecto', className = ''}) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center px-4 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg transition-colors duration-150 ease-in-out rounded-lg ${className}`}
        >
            {text}
            <svg
                className="ml-2 -mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
            </svg>
        </a>
    );
};

export default LinkButton; 