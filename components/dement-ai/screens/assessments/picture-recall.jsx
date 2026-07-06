'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        return (_jsx(RecordingView, { durationSeconds: 60, prompt: "Describe the scene you just viewed in as much detail as you can remember.", onComplete: (score, duration) => {
                completeAssessment(score, duration);
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
                        } }) }) }), _jsx("div", { className: "flex-1 flex items-center justify-center px-5 py-4 max-w-2xl mx-auto w-full", children: _jsx("div", { className: "w-full rounded-2xl overflow-hidden shadow-2xl", style: { background: '#87ceeb' }, children: _jsxs("svg", { viewBox: "0 0 320 220", className: "w-full", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("rect", { width: "320", height: "220", fill: "#87ceeb" }), _jsx("circle", { cx: "270", cy: "40", r: "22", fill: "#ffd700", opacity: "0.9" }), _jsx("ellipse", { cx: "80", cy: "50", rx: "30", ry: "14", fill: "white", opacity: "0.8" }), _jsx("ellipse", { cx: "100", cy: "44", rx: "22", ry: "14", fill: "white", opacity: "0.9" }), _jsx("ellipse", { cx: "60", cy: "44", rx: "20", ry: "12", fill: "white", opacity: "0.9" }), _jsx("ellipse", { cx: "200", cy: "35", rx: "24", ry: "11", fill: "white", opacity: "0.7" }), _jsx("ellipse", { cx: "220", cy: "30", rx: "18", ry: "11", fill: "white", opacity: "0.8" }), _jsx("rect", { x: "0", y: "140", width: "320", height: "80", fill: "#4caf50" }), _jsx("rect", { x: "0", y: "140", width: "320", height: "20", fill: "#66bb6a" }), _jsx("ellipse", { cx: "160", cy: "220", rx: "50", ry: "15", fill: "#d4a96a" }), _jsx("rect", { x: "130", y: "155", width: "60", height: "65", fill: "#d4a96a", rx: "4" }), _jsx("rect", { x: "60", y: "152", width: "48", height: "6", rx: "2", fill: "#8d5524" }), _jsx("rect", { x: "64", y: "158", width: "6", height: "12", fill: "#8d5524" }), _jsx("rect", { x: "96", y: "158", width: "6", height: "12", fill: "#8d5524" }), _jsx("rect", { x: "60", y: "148", width: "48", height: "4", rx: "1", fill: "#a0522d" }), _jsx("rect", { x: "28", y: "100", width: "10", height: "55", fill: "#8d5524", rx: "2" }), _jsx("circle", { cx: "33", cy: "88", r: "28", fill: "#2e7d32" }), _jsx("circle", { cx: "20", cy: "96", r: "18", fill: "#388e3c" }), _jsx("circle", { cx: "46", cy: "96", r: "18", fill: "#388e3c" }), _jsx("rect", { x: "255", y: "105", width: "10", height: "50", fill: "#8d5524", rx: "2" }), _jsx("circle", { cx: "260", cy: "93", r: "26", fill: "#2e7d32" }), _jsx("circle", { cx: "248", cy: "100", r: "17", fill: "#388e3c" }), _jsx("circle", { cx: "272", cy: "100", r: "17", fill: "#388e3c" }), _jsx("circle", { cx: "84", cy: "142", r: "6", fill: "#f5cba7" }), _jsx("rect", { x: "79", y: "148", width: "10", height: "12", rx: "2", fill: "#3f51b5" }), _jsx("line", { x1: "84", y1: "152", x2: "78", y2: "160", stroke: "#f5cba7", strokeWidth: "2", strokeLinecap: "round" }), _jsx("line", { x1: "84", y1: "152", x2: "90", y2: "160", stroke: "#f5cba7", strokeWidth: "2", strokeLinecap: "round" }), _jsx("ellipse", { cx: "170", cy: "168", rx: "14", ry: "8", fill: "#c8a26b" }), _jsx("circle", { cx: "183", cy: "164", r: "7", fill: "#c8a26b" }), _jsx("ellipse", { cx: "188", cy: "161", rx: "4", ry: "3", fill: "#c8a26b" }), _jsx("line", { x1: "158", y1: "168", x2: "156", y2: "176", stroke: "#c8a26b", strokeWidth: "2", strokeLinecap: "round" }), _jsx("line", { x1: "163", y1: "170", x2: "161", y2: "178", stroke: "#c8a26b", strokeWidth: "2", strokeLinecap: "round" }), _jsx("line", { x1: "172", y1: "170", x2: "170", y2: "178", stroke: "#c8a26b", strokeWidth: "2", strokeLinecap: "round" }), _jsx("line", { x1: "177", y1: "168", x2: "175", y2: "176", stroke: "#c8a26b", strokeWidth: "2", strokeLinecap: "round" }), _jsx("path", { d: "M184 176 Q188 174 192 178", stroke: "#c8a26b", strokeWidth: "2", fill: "none", strokeLinecap: "round" }), [30, 50, 290, 310].map((x, i) => (_jsxs("g", { children: [_jsx("circle", { cx: x, cy: "152", r: "4", fill: i % 2 === 0 ? '#f06292' : '#ffb74d' }), _jsx("line", { x1: x, y1: "152", x2: x, y2: "162", stroke: "#4caf50", strokeWidth: "1.5" })] }, i))), _jsx("ellipse", { cx: "240", cy: "175", rx: "18", ry: "8", fill: "#64b5f6", opacity: "0.7" }), _jsx("rect", { x: "235", y: "158", width: "10", height: "18", rx: "3", fill: "#90caf9" }), _jsx("ellipse", { cx: "240", cy: "157", rx: "8", ry: "4", fill: "#bbdefb" }), _jsx("path", { d: "M240 152 Q235 145 238 140", stroke: "#64b5f6", strokeWidth: "2", fill: "none", strokeLinecap: "round" }), _jsx("path", { d: "M240 152 Q245 145 242 140", stroke: "#64b5f6", strokeWidth: "2", fill: "none", strokeLinecap: "round" })] }) }) }), _jsxs("div", { className: "flex-shrink-0 px-5 py-5 text-center", children: [_jsx("p", { className: "text-sm font-medium", style: { color: 'rgba(255,255,255,0.85)' }, children: "Remember as many details as you can." }), _jsx("p", { className: "text-xs mt-1", style: { color: 'rgba(255,255,255,0.55)' }, children: "You will be asked to describe this scene." })] })] }));
}
