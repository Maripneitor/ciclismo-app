import React, { useState, useEffect } from 'react';
import Header from './Header';
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
            <Header className={scrolled ? 'navbar-blur' : ''} />
            <main className="flex-grow-1">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;