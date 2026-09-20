'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useApp } from '../context';

export default function DoctorBottomNav() {
    const { currentScreen, navigate } = useApp();

    const items = [
        {
            screen: 'doctor-dashboard',
            label: 'Overview',
            icon: (active) => (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            screen: 'doctor-patients',
            label: 'Roster',
            icon: (active) => (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        }
    ];

    return (
        <nav className="flex items-center justify-around py-2 px-4 border-t border-border bg-card">
            {items.map(item => {
                const active = currentScreen === item.screen;
                return (
                    <button
                        key={item.screen}
                        onClick={() => navigate(item.screen)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                            active ? 'text-[#2c7a7b] font-bold' : 'text-muted-foreground'
                        }`}
                    >
                        {item.icon(active)}
                        <span className="text-xs">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
