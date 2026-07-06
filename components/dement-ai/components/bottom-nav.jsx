'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useApp } from '../context';
const items = [
    {
        label: 'Dashboard',
        screen: 'user-dashboard',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }) })),
    },
    {
        label: 'History',
        screen: 'user-history',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) })),
    },
    {
        label: 'Profile',
        screen: 'user-profile',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) })),
    },
];
export default function BottomNav() {
    const { currentScreen, navigate } = useApp();
    return (_jsx("nav", { className: "flex-shrink-0 border-t border-border bg-card", children: _jsx("div", { className: "flex", children: items.map(item => {
                const active = currentScreen === item.screen;
                return (_jsxs("button", { onClick: () => navigate(item.screen), className: "flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors", style: { color: active ? '#2c7a7b' : '#a0aec0' }, "aria-label": item.label, "aria-current": active ? 'page' : undefined, children: [item.icon(active), _jsx("span", { className: "text-xs font-medium", children: item.label })] }, item.screen));
            }) }) }));
}
