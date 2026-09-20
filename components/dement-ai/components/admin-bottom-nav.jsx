'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useApp } from '../context';
const items = [
    {
        label: 'Dashboard',
        screen: 'admin-dashboard',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm0 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" }) })),
    },
    {
        label: 'Users',
        screen: 'admin-users',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) })),
    },
    {
        label: 'Doctors',
        screen: 'admin-doctors',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) })),
    },
    {
        label: 'Hospitals',
        screen: 'admin-hospitals',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) })),
    },
];
export default function AdminBottomNav() {
    const { currentScreen, navigate } = useApp();
    return (_jsx("nav", { className: "flex-shrink-0 border-t border-border bg-card", children: _jsx("div", { className: "flex", children: items.map(item => {
                const active = currentScreen === item.screen;
                return (_jsxs("button", { onClick: () => navigate(item.screen), className: "flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors", style: { color: active ? '#2c7a7b' : '#a0aec0' }, "aria-label": item.label, "aria-current": active ? 'page' : undefined, children: [item.icon(active), _jsx("span", { className: "text-xs font-medium", children: item.label })] }, item.screen));
            }) }) }));
}
