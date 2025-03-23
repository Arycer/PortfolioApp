import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastVariant } from '../components/ui/Toast';

interface ToastContextType {
    showToast: (message: string, variant: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastItem {
    id: string;
    message: string;
    variant: ToastVariant;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, variant: ToastVariant) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => {
            // Limitar a máximo 3 toasts simultáneos
            const newToasts = [...prev];
            if (newToasts.length >= 3) {
                newToasts.shift(); // Eliminar el toast más antiguo
            }
            return [...newToasts, { id, message, variant }];
        });
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-0 right-0 z-50 p-4 flex flex-col items-end space-y-2 pointer-events-none">
                <div className="flex flex-col items-end space-y-2 max-w-md w-full">
                    {toasts.map(toast => (
                        <div key={toast.id} className="pointer-events-auto w-full">
                            <Toast
                                message={toast.message}
                                variant={toast.variant}
                                onClose={() => removeToast(toast.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}; 