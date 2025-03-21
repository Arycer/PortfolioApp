import React from 'react';

export interface SocialLink {
    id?: string;
    name: string;
    url: string;
    icon: string;
}

export interface AboutMeData {
    id?: string;
    greeting: string;
    description: string;
    socialLinks: SocialLink[];
}

interface AboutMeProps {
    data: AboutMeData;
}

const AboutMe: React.FC<AboutMeProps> = ({ data }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col items-center text-center">
                {/* Logo con efecto de fundido */}
                <div className="relative w-48 h-48 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl"></div>
                    <img
                        src="/src/assets/arycer.png"
                        alt="Arycer Logo"
                        className="relative w-full h-full object-contain"
                    />
                </div>

                {/* Saludo */}
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
                    {data.greeting}
                </h1>

                {/* Descripción */}
                <p className="max-w-2xl text-lg text-slate-400 mb-12 leading-relaxed">
                    {data.description}
                </p>

                {/* Redes Sociales */}
                <div className="flex flex-wrap justify-center gap-4">
                    {data.socialLinks.map((link, index) => (
                        <a
                            key={link.id || `social-link-${index}`}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-700 transition-all duration-300"
                        >
                            <img
                                src={link.icon}
                                alt={link.name}
                                className="w-5 h-5"
                            />
                            <span className="text-slate-300 hover:text-white">
                                {link.name}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutMe; 