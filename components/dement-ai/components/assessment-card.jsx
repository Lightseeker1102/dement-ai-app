'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const configs = {
    'picture-recall': {
        title: 'Picture Recall',
        description: 'View a scene for 10 seconds, then describe what you remember',
        duration: '~2 min',
        iconBg: '#ebf8ff',
        iconColor: '#2b6cb0',
        icon: (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) })),
    },
    'animal-naming': {
        title: 'Animal Naming',
        description: 'Name as many animals as you can in 60 seconds',
        duration: '60 sec',
        iconBg: '#f0fff4',
        iconColor: '#276749',
        icon: (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" }) })),
    },
    'structured-speech': {
        title: 'Structured Speech',
        description: 'Speak about a given topic for 60 seconds',
        duration: '60 sec',
        iconBg: '#fffaf0',
        iconColor: '#c05621',
        icon: (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) })),
    },
};
export default function AssessmentCard({ type, onStart }) {
    const config = configs[type];
    return (_jsxs("button", { onClick: () => onStart(type), className: "w-full flex items-start gap-4 rounded-[1.35rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.94))] p-4 text-left shadow-[0_16px_36px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(15,23,42,0.12)] active:scale-[0.98]", children: [_jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center", style: { backgroundColor: config.iconBg, color: config.iconColor }, children: config.icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("h3", { className: "font-semibold text-foreground text-base", children: config.title }), _jsx("span", { className: "text-xs text-muted-foreground flex-shrink-0 bg-muted px-2 py-0.5 rounded-full", children: config.duration })] }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5 leading-relaxed", children: config.description }), _jsx("p", { className: "mt-3 inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground", children: "Ready when you are" })] }), _jsx("div", { className: "flex-shrink-0 self-center text-muted-foreground", children: _jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", clipRule: "evenodd" }) }) })] }));
}
