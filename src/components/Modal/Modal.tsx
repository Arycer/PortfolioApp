import React, {useEffect, useRef} from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | 'full' | 'fullWidth';
}

const Modal: React.FC<ModalProps> = ({
    isOpen, 
    onClose, 
    title, 
    children, 
    maxWidth = 'lg'
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const modalContentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Bloquear el scroll cuando se abre el modal
    useEffect(() => {
        if (!isOpen) return;
        
        // Guardar la posición actual de scroll
        const scrollY = window.scrollY;
        
        // Crear una capa de bloqueo para el scroll sin mover la página
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        
        // Centramos el contenido del modal
        if (modalContentRef.current) {
            modalContentRef.current.scrollTop = 0;
        }
        
        // Capturar eventos que podrían causar scroll
        const handleWheel = (e: WheelEvent) => {
            if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
                e.preventDefault();
            }
        };
        
        const handleTouch = (e: TouchEvent) => {
            if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
                e.preventDefault();
            }
        };
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowDown', 'ArrowUp', 'Space', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.code) && 
                !modalContentRef.current?.contains(document.activeElement)) {
                e.preventDefault();
            }
            if (e.key === 'Escape') {
                onClose();
            }
        };
        
        document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
        document.addEventListener('touchmove', handleTouch, { passive: false, capture: true });
        document.addEventListener('keydown', handleKeyDown, { passive: false, capture: true });
        
        // Función de limpieza
        return () => {
            // Restaurar el scroll original
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            
            // Restaurar la posición de scroll exacta después de una pequeña espera para evitar el "flash"
            if (scrollY > 0) {
                // Ejecutamos inmediatamente, pero con setTimeout para garantizar que se ejecute después 
                // de que React haya completado sus actualizaciones del DOM
                setTimeout(() => {
                    window.scrollTo(0, scrollY);
                }, 0);
            }
            
            // Eliminar todos los event listeners
            document.removeEventListener('wheel', handleWheel, { capture: true });
            document.removeEventListener('touchmove', handleTouch, { capture: true });
            document.removeEventListener('keydown', handleKeyDown, { capture: true });
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Mapeo de tamaños máximos
    const maxWidthClasses = {
        'sm': 'max-w-sm',
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        '8xl': 'max-w-[90rem]', // tamaño personalizado más grande que 7xl
        'full': 'max-w-full',
        'fullWidth': 'max-w-[85%] w-[85%]' // reducido de 95% a 85% para un equilibrio mejor
    };

    // Determinar si necesitamos añadir clases para centrar horizontalmente
    const centeringClass = maxWidth === 'fullWidth' ? 'justify-center items-center' : 'items-center justify-center';

    return (
        <div 
            ref={modalRef}
            className={`fixed inset-0 z-50 flex ${centeringClass} p-4 overflow-hidden`}
            onClick={(e) => {
                // Solo cerrar si se hace clic fuera del contenido del modal
                if (modalRef.current === e.target) {
                    onClose();
                }
            }}
        >
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container - capturando eventos pero no propagándolos */}
            <div
                ref={containerRef}
                className={`relative w-full ${maxWidthClasses[maxWidth]} z-10 max-h-[calc(100vh-2rem)]`}
                style={{
                    transform: 'translate3d(0, 0, 0)',
                    margin: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Content */}
                <div
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
                    <div 
                        ref={modalContentRef}
                        className="overflow-y-auto px-6 py-4"
                        onScroll={(e) => e.stopPropagation()}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;