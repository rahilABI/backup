"use client";
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'light') {
            setIsLight(true);
            document.body.classList.add('light-mode');
        }
    }, []);

    const toggleTheme = () => {
        if (isLight) {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            setIsLight(false);
        } else {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            setIsLight(true);
        }
    };

    return (
        <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title="Toggle Light/Dark Mode"
        >
            {isLight ? '🌙' : '☀️'}
        </button>
    );
}
