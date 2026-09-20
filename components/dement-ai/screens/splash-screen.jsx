'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useApp } from '../context';
export default function SplashScreen() {
    const { navigate } = useApp();
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        // Trigger fade-in
        const fadeIn = setTimeout(() => setVisible(true), 50);
        // Navigate to landing after 2.5s
        const timer = setTimeout(() => navigate('landing'), 2500);
        return () => {
            clearTimeout(fadeIn);
            clearTimeout(timer);
        };
    }, [navigate]);
    return (_jsxs("div", { className: "w-full min-h-screen flex flex-col items-center justify-center transition-opacity duration-700", style: {
            background: 'linear-gradient(160deg, #1a365d 0%, #2c7a7b 100%)',
            opacity: visible ? 1 : 0,
        }, children: [_jsxs("div", { className: "mb-8 relative", children: [_jsx("div", { className: "w-28 h-28 rounded-full flex items-center justify-center", style: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }, children: _jsx("svg", { className: "w-14 h-14 text-white", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" }) }) }), _jsx("div", { className: "absolute inset-0 rounded-full", style: { background: 'rgba(255,255,255,0.05)' } })] }), _jsxs("h1", { className: "text-5xl font-bold text-white tracking-tight mb-3", children: ["Dement", _jsx("span", { style: { color: '#ed8936' }, children: "(AI)" })] }), _jsx("p", { className: "text-lg font-medium", style: { color: 'rgba(255,255,255,0.85)' }, children: "Cognitive Health Monitoring" }), _jsx("div", { className: "mt-16 flex gap-3", children: [0, 1, 2].map(i => (_jsx("div", { className: "w-2.5 h-2.5 rounded-full animate-pulse", style: {
                        backgroundColor: 'rgba(255,255,255,0.6)',
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '1s',
                    } }, i))) }), _jsx("p", { className: "absolute bottom-8 text-sm font-medium", style: { color: 'rgba(255,255,255,0.7)' }, children: "v1.0.0 \u2014 Clinical Edition" })] }));
}
