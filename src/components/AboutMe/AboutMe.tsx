import React from 'react';
import { AboutMeData } from '../../types';

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
                    <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
                        {/* Efectos de fondo con gradientes y blur */}
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/15 to-purple-500/15 rounded-full blur-3xl scale-110"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl scale-125"></div>
                        
                        {/* Círculo con borde difuminado */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-indigo-500/20 blur-xl transform scale-105"></div>
                        
                        {/* Contenedor de la imagen con máscara circular */}
                        <div className="absolute inset-0 overflow-hidden rounded-full border-4 border-slate-800/30 shadow-lg shadow-indigo-500/10">
                            <div className="absolute inset-0">
                                <img
                                    src={data.profileImage || "/arycer.png"}
                                    alt={`${data.username} Profile`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Overlay luminoso */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/10"></div>
                        </div>
                        
                        {/* Brillo en los bordes */}
                        <div className="absolute inset-0 rounded-full border border-indigo-500/30 blur-sm"></div>
                    </div>
                </div>

                {/* Lado derecho - Texto y redes sociales */}
                <div className="w-full md:w-2/3 flex flex-col items-center md:items-start text-center md:text-left">
                    {/* Saludo */}
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
                        {data.greeting}
                    </h1>

                    {/* Descripción */}
                    <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                        {data.description}
                    </p>
                    
                    {/* Redes Sociales - Ahora justo debajo del texto */}
                    {sortedSocialLinks.length > 0 && (
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutMe; 