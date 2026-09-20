'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useApp } from '../../context';

export default function DigitSpanScreen() {
    const { navigate, completeAssessment, showToast, cancelAssessmentFlow } = useApp();
    const [round, setRound] = useState(1);
    const [sequence, setSequence] = useState([]);
    const [phase, setPhase] = useState('flash'); // 'flash' | 'recall' | 'complete'
    const [userInput, setUserInput] = useState('');
    const [correctCount, setCorrectCount] = useState(0);
    const [maxSpan, setMaxSpan] = useState(0);

    const generateSequence = (length) => {
        const seq = [];
        for (let i = 0; i < length; i++) {
            seq.push(Math.floor(Math.random() * 9) + 1);
        }
        setSequence(seq);
        setPhase('flash');
        setUserInput('');
    };

    useEffect(() => {
        // Start round 1 with 2 digits (progressing to 6 digits across 5 rounds)
        generateSequence(2);
    }, []);

    useEffect(() => {
        if (phase !== 'flash') return;
        // Flash digits for 3.5 seconds
        const timer = setTimeout(() => {
            setPhase('recall');
        }, 3500);
        return () => clearTimeout(timer);
    }, [phase, sequence]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const expectedReverse = [...sequence].reverse().join('');
        const isCorrect = userInput.trim() === expectedReverse;

        const updatedCorrect = isCorrect ? correctCount + 1 : correctCount;
        const currentLength = sequence.length;
        const updatedMaxSpan = isCorrect ? Math.max(maxSpan, currentLength) : maxSpan;

        setCorrectCount(updatedCorrect);
        setMaxSpan(updatedMaxSpan);

        if (round >= 5) {
            setPhase('complete');
            const spanScore = updatedMaxSpan >= 5 ? 100 : (updatedMaxSpan === 4 ? 85 : (updatedMaxSpan === 3 ? 65 : 45));
            const finalScore = Math.min(100, Math.max(15, spanScore + Math.round((updatedCorrect / 5) * 15)));

            setTimeout(() => {
                completeAssessment(finalScore, 40);
                showToast(`Digit Span Test Complete! Max Reverse Span: ${updatedMaxSpan} Digits`, 'success');
            }, 1200);
        } else {
            setRound(r => r + 1);
            generateSequence(2 + round); // Progressively increase length (2 -> 3 -> 4 -> 5 -> 6)
        }
    };

    return (_jsxs("div", { className: "w-full min-h-screen flex flex-col bg-background max-w-xl mx-auto text-center px-4 py-6", children: [
        _jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            _jsxs("button", { onClick: () => { cancelAssessmentFlow(); navigate('user-assessments'); }, className: "inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground", children: [
                _jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
                "Back"
            ] }),
            _jsxs("div", { className: "text-right", children: [
                _jsxs("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: ["Round ", round, " / 5"] }),
                _jsxs("p", { className: "text-sm font-bold text-[#2c7a7b]", children: ["Memory Span: ", sequence.length, " Digits"] })
            ] })
        ] }),

        _jsxs("div", { className: "bg-card rounded-3xl border border-border p-8 shadow-xl mb-6 flex-1 flex flex-col items-center justify-center", children: [
            phase === 'flash' ? (_jsxs(_Fragment, { children: [
                _jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4", children: "Memorize these digits" }),
                _jsx("div", { className: "flex gap-3 my-6 animate-pulse", children: sequence.map((num, i) => (_jsx("div", { className: "w-14 h-16 rounded-2xl bg-teal-500/10 border-2 border-[#2c7a7b] flex items-center justify-center text-3xl font-extrabold text-[#2c7a7b]", children: num }, i))) }),
                _jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Get ready to type them in REVERSE order!" })
            ] })) : phase === 'recall' ? (_jsxs("form", { onSubmit: handleSubmit, className: "w-full max-w-sm flex flex-col items-center", children: [
                _jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4", children: "Type Digits in REVERSE Order" }),
                _jsx("input", { type: "text", value: userInput, onChange: e => setUserInput(e.target.value.replace(/[^0-9]/g, '')), maxLength: sequence.length, placeholder: "Reverse Sequence", autoFocus: true, className: "w-full text-center text-3xl font-mono tracking-[0.5em] py-4 rounded-2xl border-2 border-[#2c7a7b] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#2c7a7b] mb-6 shadow-inner" }),
                _jsx("button", { type: "submit", disabled: userInput.length !== sequence.length, className: "w-full py-4 rounded-xl font-bold text-lg text-white transition-all active:scale-95 disabled:opacity-50", style: { background: 'linear-gradient(135deg, #2c7a7b, #1a5e5e)' }, children: "Submit Reverse Sequence" })
            ] })) : (_jsxs("div", { className: "animate-bounce text-emerald-600 font-bold text-lg", children: ["Calculating Reverse Memory Index..."] }))
        ] })
    ] }));
}
