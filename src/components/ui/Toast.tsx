import React, { useEffect, useState } from 'react';
import './Toast.css';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    variant: ToastVariant;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, variant, onClose, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Pequeño delay para permitir que la animación de entrada se inicie
        const enterTimeout = setTimeout(() => {
            setIsVisible(true);
        }, 10);

        const leaveTimeout = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(enterTimeout);
            clearTimeout(leaveTimeout);
        };
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        // Esperar a que termine la animación de salida antes de llamar a onClose
        setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 100);
        }, 400);
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return 'bg-green-600/20 border-green-600/40 text-green-400';
            case 'error':
                return 'bg-red-600/20 border-red-600/40 text-red-400';
            case 'warning':
                return 'bg-yellow-600/20 border-yellow-600/40 text-yellow-400';
            case 'info':
                return 'bg-blue-600/20 border-blue-600/40 text-blue-400';
            default:
                return 'bg-slate-600/20 border-slate-600/40 text-slate-400';
        }
    };

    const getIcon = () => {
        switch (variant) {
            case 'success':
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                );
            case 'error':
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                );
            case 'warning':
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                );
            case 'info':
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                );
            default:
                return null;
        }
    };

    const baseClasses = `
        transform
        transition-all
        duration-500
        ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${isLeaving ? 'toast-leave-active' : ''}
    `;

    return (
        <div className={baseClasses}>
            <div 
                className={`
                    px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm
                    flex items-center gap-2
                    ${!isLeaving ? 'animate-slide-in' : ''}
                    ${getVariantStyles()}
                `}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 flex-shrink-0 ${!isLeaving ? 'animate-bounce-gentle' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    {getIcon()}
                </svg>
                <span className="flex-1 text-sm">{message}</span>
                <button
                    onClick={handleClose}
                    className="ml-2 text-current opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded p-1"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 transform transition-transform hover:rotate-90 hover:scale-110" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Toast; 