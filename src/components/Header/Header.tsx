// src/components/Header.tsx
import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import styled from 'styled-components';
import {useAuth} from '../../context/AuthContext';
import {useProfile} from '../../context/ProfileContext';

// Definición de styled components usando .attrs para inyectar las clases de Tailwind
const HeaderContainer = styled.header.attrs({
    className: 'flex justify-between items-center px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 shadow-lg sticky top-0 z-50'
})``;

const TitleLink = styled(Link).attrs({
    className: 'text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 transition-all duration-300'
})``;

const NavContainer = styled.nav.attrs({
    className: 'hidden md:flex space-x-6 items-center'
})``;

const NavLink = styled.a.attrs({
    className: 'text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-400 hover:to-purple-400'
})``;

const MobileMenuButton = styled.button.attrs({
    className: 'md:hidden text-slate-300 hover:text-white focus:outline-none'
})``;

const MobileMenu = styled.div.attrs({
    className: 'absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800/50 shadow-lg transform transition-all duration-200 md:hidden'
})``;

const MobileNavLink = styled.a.attrs({
    className: 'block px-6 py-3 text-base text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors duration-200'
})``;

const ProfileContainer = styled.div.attrs({
    className: 'relative'
})``;

const ProfileImage = styled.img.attrs({
    className: 'w-10 h-10 rounded-full cursor-pointer ring-2 ring-indigo-500/50 hover:ring-indigo-400 transition-all duration-300'
})``;

const DropdownMenu = styled.div.attrs({
    className: 'absolute right-0 mt-3 w-48 bg-slate-800/95 backdrop-blur-lg rounded-lg border border-slate-700/50 shadow-xl transform transition-all duration-200 scale-95 hover:scale-100'
})``;

const DropdownItem = styled.button.attrs({
    className: 'w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200'
})``;

const Header: React.FC = () => {
    const {user, signOut} = useAuth();
    const {profileData} = useProfile();
    const [showMenu, setShowMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const handleProfileClick = () => {
        if (user) {
            setShowMenu((prev) => !prev);
        }
    };

    const toggleMobileMenu = () => {
        setShowMobileMenu(prev => !prev);
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowMenu(false);
        }
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
            setShowMobileMenu(false);
        }
    };

    // Cerrar menús al cambiar de ruta
    useEffect(() => {
        setShowMenu(false);
        setShowMobileMenu(false);
    }, [location.pathname]);

    useEffect(() => {
        if (showMenu || showMobileMenu) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showMenu, showMobileMenu]);

    const handleLogout = async () => {
        try {
            await signOut();
            setShowMenu(false);
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const handleGoToAdmin = () => {
        navigate('/admin');
        setShowMenu(false);
    };

    const handleGoToImageManager = () => {
        navigate('/admin/images');
        setShowMenu(false);
    };

    const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, sectionId: string) => {
        e.preventDefault();
        
        // Solo navegar con smooth scroll si estamos en la página principal
        if (location.pathname === '/') {
            const section = document.getElementById(sectionId);
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 80, // Ajuste para el header fijo
                    behavior: 'smooth'
                });
            }
        } else {
            // Si estamos en otra página, navegar a la página principal + anchor
            navigate(`/#${sectionId}`);
        }
        
        setShowMobileMenu(false);
    };

    const navLinks = [
        { title: 'Sobre Mí', id: 'about' },
        { title: 'Habilidades', id: 'skills' },
        { title: 'Formación', id: 'education' },
        { title: 'Experiencia', id: 'experience' },
        { title: 'Proyectos', id: 'projects' },
        { title: 'Contacto', id: 'contact' }
    ];

    return (
        <HeaderContainer>
            <div className="flex items-center">
                <TitleLink to="/">
                    {profileData?.username || 'Arycer'}
                </TitleLink>
                
                {/* Botón móvil */}
                <MobileMenuButton onClick={toggleMobileMenu} className="ml-4">
                    {showMobileMenu ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </MobileMenuButton>
            </div>
            
            {/* Navegación Desktop */}
            <NavContainer>
                {navLinks.map(link => (
                    <NavLink 
                        key={link.id} 
                        href={`#${link.id}`}
                        onClick={(e) => handleNavLinkClick(e, link.id)}
                    >
                        {link.title}
                    </NavLink>
                ))}
            </NavContainer>

            <div className="flex items-center">
                {user && (
                    <ProfileContainer>
                        <ProfileImage 
                            src={profileData?.profileImage || "/arycer.png"} 
                            alt={`${profileData?.username || 'Usuario'} Logo`} 
                            onClick={handleProfileClick}
                        />
                        {showMenu && (
                            <DropdownMenu ref={menuRef}>
                                <DropdownItem onClick={handleGoToAdmin}>Panel Admin</DropdownItem>
                                <DropdownItem onClick={handleGoToImageManager}>Gestor de Imágenes</DropdownItem>
                                <DropdownItem onClick={handleLogout}>Cerrar Sesión</DropdownItem>
                            </DropdownMenu>
                        )}
                    </ProfileContainer>
                )}
            </div>
            
            {/* Menú móvil */}
            {showMobileMenu && (
                <MobileMenu ref={mobileMenuRef}>
                    {navLinks.map(link => (
                        <MobileNavLink 
                            key={link.id} 
                            href={`#${link.id}`}
                            onClick={(e) => handleNavLinkClick(e, link.id)}
                        >
                            {link.title}
                        </MobileNavLink>
                    ))}
                </MobileMenu>
            )}
        </HeaderContainer>
    );
};

export default Header;