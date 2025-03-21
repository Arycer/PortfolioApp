import React, {useEffect, useRef} from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose, title, children}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';

            // Asegurar que el contenido esté visible centralmente
            setTimeout(() => {
                if (modalRef.current) {
                    modalRef.current.scrollTop = 0;
                }
            }, 10);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className="relative w-full max-w-2xl z-10 max-h-[calc(100vh-2rem)]"
                style={{
                    transform: 'translate3d(0, 0, 0)',
                    margin: 'auto'
                }}
            >
                {/* Modal Content */}
                <div
                    ref={modalRef}
                    className="flex flex-col bg-slate-800/95 border border-slate-700/50 rounded-xl shadow-xl overflow-hidden max-h-[calc(100vh-2rem)]"
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between border-b border-slate-700/50 px-6 py-4 bg-slate-800/95 sticky top-0 z-10">
                        <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700/50"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Contenido scrolleable */}
                    <div className="overflow-y-auto px-6 py-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;