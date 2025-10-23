// frontend/src/components/layout/Layout.jsx - CORREGIDO
import React, { useState, useEffect } from 'react';
import EnhancedNavbar from './EnhancedNavbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
            <EnhancedNavbar scrolled={scrolled} />
            <main className="flex-grow-1">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;