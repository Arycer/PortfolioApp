import React from 'react';

export interface SocialLink {
    id?: string;
    name: string;
    url: string;
    icon: string;
    order?: number;
}

export interface AboutMeData {
    id?: string;
    greeting: string;
    description: string;
    socialLinks: SocialLink[];
    contactEmail?: string;
}

interface AboutMeProps {
    data: AboutMeData;
}

const AboutMe: React.FC<AboutMeProps> = ({data}) => {
    // Ordenar las redes sociales por order si existe
    const sortedSocialLinks = [...data.socialLinks].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        }
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return 0;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Contenedor flexbox principal para imagen y texto */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                {/* Lado izquierdo - Imagen */}
                <div className="w-full md:w-1/3 flex justify-center">
                    <div className="relative w-48 h-48">
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl"></div>
                        <img
                            src="/arycer.png"
                            alt="Arycer Logo"
                            className="relative w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Lado derecho - Texto */}
                <div className="w-full md:w-2/3 flex flex-col items-center md:items-start text-center md:text-left">
                    {/* Saludo */}
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
                        {data.greeting}
                    </h1>

                    {/* Descripción */}
                    <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                        {data.description}
                    </p>
                </div>
            </div>

            {/* Redes Sociales - Ahora en la parte inferior */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
                {sortedSocialLinks.map((link, index) => (
                    <a
                        key={link.id || `social-link-${index}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-700 transition-all duration-300"
                        data-aos="fade-up"
                        data-aos-delay={100 + index * 50}
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
    );
};

export default AboutMe; 