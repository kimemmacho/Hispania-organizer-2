import React from 'react';
import { Page } from '../types';

interface BottomNavProps {
    navigate: (page: Page) => void;
    currentPage: Page;
}

const NavLink: React.FC<{
    page: Page;
    label: string;
    icon: string;
    isActive: boolean;
    onClick: (page: Page) => void;
}> = ({ page, label, icon, isActive, onClick }) => {
    const activeClasses = "text-red-500 bottom-nav-active-glow";
    const inactiveClasses = "text-gray-400";
    return (
        <button
            onClick={() => onClick(page)}
            className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 transform hover:scale-110 ${isActive ? activeClasses : inactiveClasses}`}
            aria-current={isActive ? 'page' : undefined}
        >
            <i className={`fas ${icon} fa-lg`}></i>
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
};

const NAV_ITEMS: { page: Page; label: string; icon: string }[] = [
    { page: 'landing', label: 'Inicio', icon: 'fa-home' },
    { page: 'ranking', label: 'Ranking', icon: 'fa-trophy' },
    { page: 'priority', label: 'Prioridad', icon: 'fa-list-ol' },
    { page: 'roster', label: 'Roster', icon: 'fa-users-cog' },
    { page: 'options', label: 'Opciones', icon: 'fa-cog' },
];

const BottomNav: React.FC<BottomNavProps> = ({ navigate, currentPage }) => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-gray-900/80 backdrop-blur-sm border-t border-red-800/50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-50">
            <div className="container mx-auto h-full flex justify-around items-center px-2">
                {NAV_ITEMS.map(item => (
                    <NavLink
                        key={item.page}
                        {...item}
                        isActive={currentPage === item.page}
                        onClick={navigate}
                    />
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;