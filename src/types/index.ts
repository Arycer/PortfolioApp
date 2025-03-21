import {User} from 'firebase/auth';
import {ReactNode} from 'react';

// Skill types
export interface Skill {
    id?: string;
    name: string;
    icon: string;
    order?: number;
}

// Job types
export interface Job {
    id?: string;
    title: string;
    company: string;
    description: string;
    startDate: string;
    endDate?: string;
    logo: string;
    gradientFrom: string;
    gradientTo: string;
}

// Project types
export interface Project {
    id?: string;
    title: string;
    description: string;
    image: string;
    detailedDescription?: string;
    technologies?: string[];
    githubUrl?: string;
    order?: number;
    link?: string;
    buttonText?: string;
}

// Study types
export interface Study {
    id?: string;
    title: string;
    institution: string;
    description: string;
    startDate: string;
    endDate?: string;
    logo: string;
}

// AboutMe types
export interface SocialLink {
    id?: string;
    name: string;
    url: string;
    icon: string;
    order?: number;
}

export interface AboutMeData {
    id?: string;
    username: string; // Nombre que aparecerá en el Header
    greeting: string;
    description: string;
    socialLinks: SocialLink[];
    contactEmail?: string;
    profileImage?: string; // URL de la imagen de perfil
}

// Storage types
export interface ImageInfo {
    id: string;
    name: string;
    url: string;
    path: string;
    type?: string;
    size?: number;
    createdAt: Date;
}

// Star Background types
export interface Star {
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    twinkleSpeed: number;
    twinkleDirection: boolean;
    color: string;
}

export interface ShootingStar {
    x: number;
    y: number;
    length: number;
    speed: number;
    opacity: number;
    angle: number;
    life: number;
    maxLife: number;
}

// Auth Context types
export interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export interface AuthProviderProps {
    children: ReactNode;
}

// Profile Context types
export interface ProfileContextProps {
    profileData: AboutMeData | null;
    isLoading: boolean;
    error: string | null;
    refreshProfileData: () => Promise<void>;
}

export interface ProfileProviderProps {
    children: ReactNode;
}

// Email types (for Firebase Functions)
export interface EmailData {
    name: string;
    email: string;
    message: string;
}

export interface EmailError {
    code?: string;
    message: string;
}
