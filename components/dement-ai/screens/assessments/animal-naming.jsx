'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useApp } from '../../context';
import { RecordingView } from './recording';
export default function AnimalNamingScreen() {
    const { navigate, completeAssessment, showToast, cancelAssessmentFlow } = useApp();
    const [started, setStarted] = useState(false);
    if (started) {
        return (_jsx(RecordingView, { durationSeconds: 60, onComplete: (score, duration) => {
                completeAssessment(score, duration);
                showToast('Assessment saved successfully!', 'success');
            }, onCancel: () => {
                cancelAssessmentFlow();
                navigate('user-assessments');
            } }));
    }
    return (_jsxs("div", { className: "w-full min-h-screen flex flex-col bg-background max-w-2xl mx-auto text-center", children: [_jsxs("div", { className: "flex-shrink-0 px-5 pt-10 pb-6", style: { background: 'linear-gradient(135deg, #1a365d 0%, #2c7a7b 100%)' }, children: [_jsxs("button", { onClick: () => {
                            cancelAssessmentFlow();
                            navigate('user-assessments');
                        }, className: "mx-auto flex items-center gap-2 mb-4", style: { color: 'rgba(255,255,255,0.8)' }, children: [_jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", clipRule: "evenodd" }) }), _jsx("span", { className: "text-sm font-medium", children: "Back" })] }), _jsx("div", { className: "w-14 h-14 rounded-2xl flex items-center justify-center mb-3", style: { background: 'rgba(255,255,255,0.15)', marginLeft: 'auto', marginRight: 'auto' }, children: _jsx("svg", { className: "w-7 h-7 text-white", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" }) }) }), _jsx("h1", { className: "text-xl font-bold text-white", children: "Animal Naming" }), _jsx("p", { className: "text-sm mt-1", style: { color: 'rgba(255,255,255,0.7)' }, children: "Verbal Fluency Test" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-6 flex flex-col", children: [_jsxs("div", { className: "bg-card rounded-2xl p-5 shadow-sm border border-border mb-5", children: [_jsx("h2", { className: "text-base font-bold text-foreground mb-3", children: "Your Task" }), _jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: ["Name as many ", _jsx("strong", { className: "text-foreground", children: "different animals" }), " as you can think of in", ' ', _jsx("strong", { className: "text-foreground", children: "60 seconds" }), "."] }), _jsx("div", { className: "mt-4 flex flex-col gap-2", children: [
                                    'Speak clearly and at a comfortable pace',
                                    'Any animal counts — pets, wild, farm, sea',
                                    'Do not repeat the same animal twice',
                                ].map((tip, i) => (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5", style: { background: '#2c7a7b' }, children: i + 1 }), _jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: tip })] }, i))) })] }), _jsxs("div", { className: "bg-card rounded-2xl p-4 shadow-sm border border-border mb-6", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground mb-2", children: "Examples" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ['Dog', 'Cat', 'Elephant', 'Tiger', 'Eagle', 'Dolphin', '...'].map(animal => (_jsx("span", { className: "text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium", children: animal }, animal))) })] }), _jsxs("div", { className: "flex items-center justify-center gap-3 mb-8", children: [_jsx("div", { className: "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold", style: { background: '#f0fff4', color: '#276749', border: '2px solid #68d39110' }, children: "60" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: "60 Seconds" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Timer starts when you tap Start" })] })] }), _jsx("div", { className: "mt-auto", children: _jsxs("button", { onClick: () => setStarted(true), className: "w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-3 transition-all active:scale-[0.98]", style: {
                                background: 'linear-gradient(135deg, #2c7a7b, #1a5e5e)',
                                boxShadow: '0 4px 20px rgba(44,122,123,0.45)',
                            }, children: [_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" }) }), "Start Recording"] }) })] })] }));
}
