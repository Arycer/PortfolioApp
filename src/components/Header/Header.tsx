// src/components/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

// Definición de styled components usando .attrs para inyectar las clases de Tailwind
const HeaderContainer = styled.header.attrs({
    className: 'flex justify-between items-center px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 shadow-lg'
})``;

const TitleLink = styled(Link).attrs({
    className: 'text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 transition-all duration-300'
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
    const { user, signOut } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);

    const handleProfileClick = () => {
        if (user) {
            setShowMenu((prev) => !prev);
        }
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        if (showMenu) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showMenu]);

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

    return (
        <HeaderContainer>
            <TitleLink to="/">Arycer</TitleLink>
            {user && (
                <ProfileContainer>
                    <ProfileImage 
                        src="/arycer.png" 
                        alt="Logo Arycer" 
                        onClick={handleProfileClick} 
                    />
                    {showMenu && (
                        <DropdownMenu ref={menuRef}>
                            <DropdownItem onClick={handleGoToAdmin}>Panel Admin</DropdownItem>
                            <DropdownItem onClick={handleLogout}>Cerrar Sesión</DropdownItem>
                        </DropdownMenu>
                    )}
                </ProfileContainer>
            )}
        </HeaderContainer>
    );
};

export default Header;