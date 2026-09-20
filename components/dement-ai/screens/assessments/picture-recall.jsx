'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useApp } from '../../context';
import { RecordingView } from './recording';
const SCENE_DURATION = 10;
export default function PictureRecallScreen() {
    const { navigate, completeAssessment, showToast, cancelAssessmentFlow } = useApp();
    const [phase, setPhase] = useState('viewing');
    const [timeLeft, setTimeLeft] = useState(SCENE_DURATION);
    useEffect(() => {
        if (phase !== 'viewing')
            return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setPhase('countdown');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [phase]);
    useEffect(() => {
        if (phase !== 'countdown')
            return;
        // Brief transition before recording
        const timer = setTimeout(() => setPhase('recording'), 1500);
        return () => clearTimeout(timer);
    }, [phase]);
    if (phase === 'recording') {
        return (_jsx(RecordingView, { durationSeconds: 60, assessmentType: "picture-recall", prompt: "Describe the scene you just viewed in as much detail as you can remember.", onComplete: (score, duration, transcript) => {
                completeAssessment(score, duration, transcript);
                showToast('Assessment saved successfully!', 'success');
            }, onCancel: () => {
                cancelAssessmentFlow();
                navigate('user-assessments');
            } }));
    }
    if (phase === 'countdown') {
        return (_jsxs("div", { className: "w-full min-h-screen flex flex-col items-center justify-center bg-[#1a365d] px-5 pt-10 text-center", children: [_jsx("p", { className: "text-lg font-semibold text-white mb-2", children: "Time's up!" }), _jsx("p", { className: "text-sm text-white/70", children: "Get ready to describe the scene..." }), _jsx("div", { className: "mt-6 flex gap-2", children: [0, 1, 2].map(i => (_jsx("div", { className: "w-2 h-2 rounded-full animate-bounce bg-white/60", style: { animationDelay: `${i * 0.15}s` } }, i))) })] }));
    }
    // Viewing phase
    const progress = (SCENE_DURATION - timeLeft) / SCENE_DURATION;
    return (_jsxs("div", { className: "w-full min-h-screen flex flex-col bg-[#1a365d] text-center", children: [_jsxs("div", { className: "flex-shrink-0 flex items-center gap-3 px-5 pt-10 pb-4", children: [_jsx("button", { onClick: () => {
                            cancelAssessmentFlow();
                            navigate('user-assessments');
                        }, className: "w-9 h-9 rounded-full flex items-center justify-center", style: { background: 'rgba(255,255,255,0.15)' }, children: _jsx("svg", { className: "w-5 h-5 text-white", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", clipRule: "evenodd" }) }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-base font-bold text-white", children: "Picture Recall" }), _jsx("p", { className: "text-xs", style: { color: 'rgba(255,255,255,0.65)' }, children: "Study this scene carefully" })] }), _jsx("div", { className: "ml-auto flex items-center gap-2", children: _jsxs("span", { className: "text-2xl font-bold tabular-nums", style: { color: timeLeft <= 3 ? '#fc8181' : '#ed8936' }, children: [timeLeft, "s"] }) })] }), _jsx("div", { className: "flex-shrink-0 px-5 mb-4", children: _jsx("div", { className: "h-1.5 rounded-full", style: { background: 'rgba(255,255,255,0.15)' }, children: _jsx("div", { className: "h-full rounded-full transition-all", style: {
                            width: `${progress * 100}%`,
                            background: timeLeft <= 3 ? '#fc8181' : '#ed8936',
                        } }) }) }), _jsx("div", { className: "flex-1 flex items-center justify-center px-5 py-4 max-w-2xl mx-auto w-full", children: _jsx("div", { className: "w-full rounded-2xl overflow-hidden shadow-2xl bg-muted/20 border border-white/20", children: _jsx("img", { src: "/picture-recall-scene.jpg", alt: "Picture Recall Assessment Scene", className: "w-full h-auto max-h-[320px] object-cover" }) }) }), _jsxs("div", { className: "flex-shrink-0 px-5 py-5 text-center", children: [_jsx("p", { className: "text-sm font-medium", style: { color: 'rgba(255,255,255,0.85)' }, children: "Remember as many details as you can." }), _jsx("p", { className: "text-xs mt-1", style: { color: 'rgba(255,255,255,0.55)' }, children: "You will be asked to describe this scene." })] })] }));
}
