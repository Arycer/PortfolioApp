import React, {ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, HTMLAttributes} from 'react';
import {twMerge} from 'tailwind-merge';

// Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, label, id, error, ...props}, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={twMerge(
                        "mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

// Textarea
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({className, label, id, error, ...props}, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={id}
                    className={twMerge(
                        "mt-1 block w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost' | 'icon';

// Button sizes
export type ButtonSize = 'sm' | 'md' | 'lg';

// Button interface
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, variant = 'primary', size = 'md', isLoading, children, ...props}, ref) => {
        // Variants
        const variantStyles = {
            primary: "text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500",
            secondary: "text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700",
            danger: "text-white bg-red-600 hover:bg-red-500",
            success: "text-white bg-green-600 hover:bg-green-500",
            outline: "text-slate-300 hover:text-white bg-transparent border border-slate-600 hover:border-slate-500",
            ghost: "text-slate-300 hover:text-white bg-transparent hover:bg-slate-800/50",
            icon: "text-slate-400 hover:text-white bg-transparent hover:bg-slate-800/50 p-2 rounded-full"
        };

        // Sizes
        const sizeStyles = {
            sm: "px-3 py-1.5 text-xs",
            md: "px-4 py-2 text-sm",
            lg: "px-6 py-3 text-base"
        };

        const baseStyles = variant !== 'icon'
            ? `rounded-lg font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]}`
            : "transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

        return (
            <button
                ref={ref}
                className={twMerge(
                    baseStyles,
                    variantStyles[variant],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ?
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cargando...
                    </div>
                    : children
                }
            </button>
        );
    }
);

Button.displayName = 'Button';

// Search Input with Icon
interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
    onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({className, onClear, ...props}, ref) => {
        return (
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input
                    ref={ref}
                    type="search"
                    className={twMerge(
                        "w-full pl-10 pr-10 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                        className
                    )}
                    {...props}
                />
                {props.value && onClear && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                        onClick={onClear}
                    >
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m1 1 12 12M1 13 13 1"/>
                        </svg>
                    </button>
                )}
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';

// Alert component for success/error messages
interface AlertProps {
    variant: 'success' | 'error' | 'warning' | 'info';
    children: React.ReactNode;
    className?: string;
}

export const Alert = ({variant, children, className}: AlertProps) => {
    const variantStyles = {
        success: "bg-green-600/20 border border-green-600/40 text-green-400",
        error: "bg-red-600/20 border border-red-600/40 text-red-400",
        warning: "bg-yellow-600/20 border border-yellow-600/40 text-yellow-400",
        info: "bg-blue-600/20 border border-blue-600/40 text-blue-400"
    };

    return (
        <div className={twMerge("px-4 py-3 rounded-lg flex items-center", variantStyles[variant], className)}>
            {children}
        </div>
    );
};

// Card component for consistent card styling
interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({children, className}: CardProps) => {
    return (
        <div
            className={twMerge("bg-slate-800/50 border border-slate-700/50 rounded-lg shadow-lg overflow-hidden", className)}>
            {children}
        </div>
    );
};

// Card sections
export const CardHeader = ({children, className}: CardProps) => {
    return (
        <div className={twMerge("px-6 py-4 border-b border-slate-700/50", className)}>
            {children}
        </div>
    );
};

export const CardContent = ({children, className}: CardProps) => {
    return (
        <div className={twMerge("px-6 py-4", className)}>
            {children}
        </div>
    );
};

export const CardFooter = ({children, className}: CardProps) => {
    return (
        <div className={twMerge("px-6 py-4 border-t border-slate-700/50 bg-slate-800/30", className)}>
            {children}
        </div>
    );
};

// Badge component
interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    className?: string;
}

export const Badge = ({children, variant = 'default', className}: BadgeProps) => {
    const variantStyles = {
        default: "bg-slate-700 text-slate-200",
        primary: "bg-indigo-600/80 text-indigo-100",
        secondary: "bg-purple-600/80 text-purple-100",
        success: "bg-green-600/80 text-green-100",
        warning: "bg-yellow-600/80 text-yellow-100",
        danger: "bg-red-600/80 text-red-100"
    };

    return (
        <span
            className={twMerge("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variantStyles[variant], className)}>
      {children}
    </span>
    );
};

// Section component
interface SectionProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    contentClassName?: string;
}

export const Section = ({
                            children,
                            title,
                            subtitle,
                            className,
                            contentClassName,
                            ...props
                        }: SectionProps) => {
    return (
        <section className={twMerge("relative", className)} {...props}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {(title || subtitle) && (
                    <div className="text-center mb-12">
                        {title && (
                            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                <div className={twMerge("", contentClassName)}>
                    {children}
                </div>
            </div>
        </section>
    );
};

// Panel component for forms and content blocks
interface PanelProps {
    children: React.ReactNode;
    className?: string;
}

export const Panel = ({children, className}: PanelProps) => {
    return (
        <div
            className={twMerge("bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6 shadow-lg", className)}>
            {children}
        </div>
    );
};

// Image Container for consistent image styling
interface ImageContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    isLoading?: boolean;
    isEmpty?: boolean;
    emptyMessage?: string;
    className?: string;
    aspectRatio?: 'square' | 'video' | 'auto';
}

export const ImageContainer = ({
                                   children,
                                   isLoading,
                                   isEmpty,
                                   emptyMessage = "No hay imagen seleccionada",
                                   className,
                                   aspectRatio = 'square',
                                   ...props
                               }: ImageContainerProps) => {
    const aspectRatioClasses = {
        square: "aspect-square",
        video: "aspect-video",
        auto: ""
    };

    if (isLoading) {
        return (
            <div
                className={twMerge(
                    "bg-slate-800/30 border border-slate-700/40 rounded-lg overflow-hidden shadow-md animate-pulse",
                    aspectRatioClasses[aspectRatio],
                    className
                )}
                {...props}
            >
                <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div
                className={twMerge(
                    "bg-slate-800/20 border border-slate-700/40 rounded-lg overflow-hidden shadow-md",
                    aspectRatioClasses[aspectRatio],
                    className
                )}
                {...props}
            >
                <div className="w-full h-full flex items-center justify-center text-center p-4 text-slate-400">
                    {emptyMessage}
                </div>
            </div>
        );
    }

    return (
        <div
            className={twMerge(
                "bg-slate-800/30 border border-slate-700/40 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg",
                aspectRatioClasses[aspectRatio],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

// Empty State component for no data states
interface EmptyStateProps {
    message: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState = ({message, icon, action, className}: EmptyStateProps) => {
    return (
        <div
            className={twMerge("text-center py-10 px-6 bg-slate-800/20 border border-slate-700/40 rounded-lg", className)}>
            {icon && (
                <div className="flex justify-center mb-4">
                    {icon}
                </div>
            )}
            <p className="text-slate-400 mb-4">{message}</p>
            {action}
        </div>
    );
};

// Sortable Item for drag-and-drop lists
interface SortableItemProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const SortableItem = ({children, className, ...props}: SortableItemProps) => {
    return (
        <div
            className={twMerge(
                "flex items-center bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden group cursor-grab active:cursor-grabbing",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

// Social Link button component
interface SocialLinkProps extends HTMLAttributes<HTMLAnchorElement> {
    href: string;
    icon?: React.ReactNode;
    name: string;
    className?: string;
}

export const SocialLink = ({href, icon, name, className, ...props}: SocialLinkProps) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={twMerge("flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-700 transition-all duration-300", className)}
            {...props}
        >
            {icon}
            <span className="text-slate-300 hover:text-white">
        {name}
      </span>
        </a>
    );
};

// TechBadge component for technologies with remove button
interface TechBadgeProps {
    text: string;
    onRemove?: () => void;
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    className?: string;
}

export const TechBadge = ({text, onRemove, variant = 'primary', className}: TechBadgeProps) => {
    const variantStyles = {
        default: "bg-slate-700/50 text-slate-200 border-slate-600/50",
        primary: "bg-indigo-600/80 text-indigo-100 border-indigo-700/50",
        secondary: "bg-purple-600/80 text-purple-100 border-purple-700/50",
        success: "bg-green-600/80 text-green-100 border-green-700/50",
        warning: "bg-yellow-600/80 text-yellow-100 border-yellow-700/50",
        danger: "bg-red-600/80 text-red-100 border-red-700/50"
    };

    const hoverStyles = {
        default: "hover:text-white",
        primary: "hover:text-indigo-50",
        secondary: "hover:text-purple-50",
        success: "hover:text-green-50",
        warning: "hover:text-yellow-50",
        danger: "hover:text-red-50"
    };

    return (
        <div className={twMerge(
            "flex items-center gap-2 px-3 py-1 rounded-full border", 
            variantStyles[variant],
            className
        )}>
            <span className="text-sm">{text}</span>
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className={twMerge(
                        "text-opacity-70 transition-colors",
                        hoverStyles[variant]
                    )}
                    aria-label="Eliminar"
                >
                    &times;
                </button>
            )}
        </div>
    );
};

// FormField - Componente para agrupar etiquetas y campos con estilos consistentes
interface FormFieldProps {
    label: string;
    htmlFor?: string;
    children: React.ReactNode;
    required?: boolean;
    error?: string;
    className?: string;
}

export const FormField = ({ 
    label, 
    htmlFor, 
    children, 
    required, 
    error, 
    className 
}: FormFieldProps) => {
    return (
        <div className={twMerge("w-full", className)}>
            <label 
                htmlFor={htmlFor} 
                className="block text-sm font-medium text-slate-300 mb-2"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

// ColorInput - Componente para campos de color con vista previa
interface ColorInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const ColorInput = ({ 
    label, 
    id, 
    value, 
    name, 
    onChange, 
    className, 
    error, 
    ...props 
}: ColorInputProps) => {
    return (
        <FormField label={label || ""} htmlFor={id} error={error}>
            <div className="flex gap-2">
                <input
                    type="color"
                    id={id}
                    name={name}
                    value={value as string}
                    onChange={onChange}
                    className="h-10 w-20 rounded border border-slate-700 bg-slate-900/50 cursor-pointer"
                    {...props}
                />
                <Input
                    name={name}
                    value={value as string}
                    onChange={onChange}
                    className="flex-1"
                    {...props}
                />
            </div>
        </FormField>
    );
};

// FormImageField - Componente para campos de selección de imagen con previsualización
interface FormImageFieldProps {
    label: string;
    imageUrl: string;
    emptyMessage?: string;
    onSelectClick: () => void;
    onRemoveClick?: () => void;
    imageContainerClassName?: string;
    className?: string;
}

export const FormImageField = ({ 
    label, 
    imageUrl, 
    emptyMessage = "No hay imagen seleccionada", 
    onSelectClick, 
    onRemoveClick, 
    imageContainerClassName, 
    className 
}: FormImageFieldProps) => {
    return (
        <div className={twMerge("w-full", className)}>
            <label className="block text-sm font-medium text-slate-300 mb-2">
                {label}
            </label>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <ImageContainer
                    className={twMerge("h-32 w-32 mx-auto sm:mx-0", imageContainerClassName)}
                    isEmpty={!imageUrl}
                    emptyMessage={emptyMessage}
                >
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={label}
                            className="h-full w-full object-contain p-2"
                        />
                    )}
                </ImageContainer>
                <div className="flex flex-row sm:flex-col gap-2 justify-center sm:justify-start">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={onSelectClick}
                    >
                        {imageUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}
                    </Button>
                    {imageUrl && onRemoveClick && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onRemoveClick}
                        >
                            Quitar imagen
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

// FormActions - Componente para estandarizar los botones de acción de los formularios
interface FormActionsProps {
    onCancel?: () => void;
    isSubmitting?: boolean;
    submitText?: string;
    cancelText?: string;
    className?: string;
}

export const FormActions = ({ 
    onCancel, 
    isSubmitting, 
    submitText = "Guardar", 
    cancelText = "Cancelar", 
    className 
}: FormActionsProps) => {
    return (
        <div className={twMerge("border-t border-slate-700/50 pt-8 mt-8", className)}>
            <div className="flex justify-end space-x-3">
                {onCancel && (
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onCancel}
                    >
                        {cancelText}
                    </Button>
                )}
                <Button 
                    type="submit" 
                    isLoading={isSubmitting}
                >
                    {submitText}
                </Button>
            </div>
        </div>
    );
};

// FormSection - Componente para agrupar campos relacionados
interface FormSectionProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export const FormSection = ({ 
    title, 
    description, 
    children, 
    className 
}: FormSectionProps) => {
    return (
        <div className={twMerge("space-y-6", className)}>
            {title && (
                <div className="border-b border-slate-700/30 pb-4 mb-6">
                    <h3 className="text-lg font-medium text-slate-200">{title}</h3>
                    {description && (
                        <p className="mt-1 text-sm text-slate-400">{description}</p>
                    )}
                </div>
            )}
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
};

// FormGrid - Componente para crear layouts en grid para formularios
interface FormGridProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3 | 4;
    className?: string;
}

export const FormGrid = ({ 
    children, 
    columns = 2, 
    className 
}: FormGridProps) => {
    const columnsClass = {
        1: "grid-cols-1",
        2: "grid-cols-1 lg:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    };

    return (
        <div className={twMerge(`grid gap-x-6 gap-y-6 ${columnsClass[columns]}`, className)}>
            {children}
        </div>
    );
}; 