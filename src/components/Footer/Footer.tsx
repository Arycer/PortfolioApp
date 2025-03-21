// src/components/Footer.tsx
import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer.attrs({
    className: 'w-full bg-slate-900/80 backdrop-blur-md border-t border-slate-800/50 py-6 px-6'
})``;

const FooterContent = styled.div.attrs({
    className: 'max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4'
})``;

const Copyright = styled.p.attrs({
    className: 'text-sm text-slate-400 text-center'
})``;

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <FooterContainer>
            <FooterContent>
                <Copyright>
                    © {currentYear} Arycer. Todos los derechos reservados.
                </Copyright>
            </FooterContent>
        </FooterContainer>
    );
};

export default Footer;