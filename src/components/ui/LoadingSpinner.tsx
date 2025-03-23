import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-[200px]">
            <div className="relative">
                {/* Círculo exterior */}
                <div className="w-12 h-12 border-4 border-indigo-200 rounded-full animate-spin"></div>
                {/* Círculo interior */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-indigo-500 rounded-full animate-spin-reverse"></div>
                {/* Punto central */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner; 