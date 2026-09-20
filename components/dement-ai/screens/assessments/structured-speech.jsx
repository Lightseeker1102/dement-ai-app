'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useApp } from '../../context';
import { RecordingView } from './recording';
const TOPICS = [
    'Describe your typical morning routine in as much detail as possible.',
    'Talk about your favorite place you have ever visited.',
    'Describe the last meal you cooked or ate at home.',
    'Tell me about someone who has been important in your life.',
    'Describe a hobby or activity you enjoy and why.',
];
function getRandomTopic() {
    return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}
export default function StructuredSpeechScreen() {
    const { navigate, completeAssessment, showToast, cancelAssessmentFlow } = useApp();
    const [started, setStarted] = useState(false);
    const [topic] = useState(getRandomTopic);
    if (started) {
        return (_jsx(RecordingView, { durationSeconds: 60, assessmentType: "structured-speech", prompt: topic, onComplete: (score, duration, transcript) => {
                completeAssessment(score, duration, transcript);
                showToast('Assessment saved successfully!', 'success');
            }, onCancel: () => {
                cancelAssessmentFlow();
                navigate('user-assessments');
            } }));
    }
    return (_jsxs("div", { className: "w-full min-h-screen flex flex-col bg-background max-w-2xl mx-auto text-center", children: [_jsxs("div", { className: "flex-shrink-0 px-5 pt-10 pb-6", style: { background: 'linear-gradient(135deg, #1a365d 0%, #2c7a7b 100%)' }, children: [_jsxs("button", { onClick: () => {
                            cancelAssessmentFlow();
                            navigate('user-assessments');
                        }, className: "mx-auto flex items-center gap-2 mb-4", style: { color: 'rgba(255,255,255,0.8)' }, children: [_jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", clipRule: "evenodd" }) }), _jsx("span", { className: "text-sm font-medium", children: "Back" })] }), _jsx("div", { className: "w-14 h-14 rounded-2xl flex items-center justify-center mb-3", style: { background: 'rgba(255,255,255,0.15)', marginLeft: 'auto', marginRight: 'auto' }, children: _jsx("svg", { className: "w-7 h-7 text-white", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }) }), _jsx("h1", { className: "text-xl font-bold text-white", children: "Structured Speech" }), _jsx("p", { className: "text-sm mt-1", style: { color: 'rgba(255,255,255,0.7)' }, children: "Narrative Coherence Test" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-6 flex flex-col text-center", children: [_jsxs("div", { className: "rounded-2xl p-5 mb-5", style: { background: 'linear-gradient(135deg, #fffbf0, #fff8ec)', border: '1px solid #fed7aa' }, children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-3", children: [_jsx("div", { className: "w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-orange-600", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }) }), _jsx("p", { className: "text-sm font-bold text-orange-800", children: "Your Topic" })] }), _jsx("p", { className: "text-base font-medium text-orange-900 leading-relaxed", children: topic })] }), _jsxs("div", { className: "bg-card rounded-2xl p-4 shadow-sm border border-border mb-5 text-left", children: [_jsx("h2", { className: "text-sm font-bold text-foreground mb-3", children: "Instructions" }), _jsx("div", { className: "flex flex-col gap-2.5", children: [
                                    'Read the topic above before you start',
                                    'Speak continuously for the full 60 seconds',
                                    'Use complete sentences and specific details',
                                    'If you finish early, continue with related thoughts',
                                ].map((instruction, i) => (_jsxs("div", { className: "flex items-start gap-2.5", children: [_jsx("div", { className: "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5", style: { background: '#ed8936' }, children: i + 1 }), _jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: instruction })] }, i))) })] }), _jsxs("div", { className: "bg-card rounded-2xl p-4 shadow-sm border border-border mb-6 text-left", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground mb-2", children: "What we assess" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ['Speech coherence', 'Memory recall', 'Word finding', 'Narrative structure'].map(tag => (_jsx("span", { className: "text-xs px-2.5 py-1 rounded-full font-medium", style: { background: '#2c7a7b15', color: '#2c7a7b' }, children: tag }, tag))) })] }), _jsx("div", { className: "mt-auto", children: _jsxs("button", { onClick: () => setStarted(true), className: "w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-3 transition-all active:scale-[0.98]", style: {
                                background: 'linear-gradient(135deg, #2c7a7b, #1a5e5e)',
                                boxShadow: '0 4px 20px rgba(44,122,123,0.45)',
                            }, children: [_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" }) }), "Start Recording"] }) })] })] }));
}
