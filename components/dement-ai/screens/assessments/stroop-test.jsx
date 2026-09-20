'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context';

const COLOR_OPTIONS = [
    { name: 'Red', hex: '#e53e3e' },
    { name: 'Green', hex: '#38a169' },
    { name: 'Blue', hex: '#3182ce' },
    { name: 'Yellow', hex: '#d69e2e' }
];

export default function StroopTestScreen() {
    const { navigate, completeAssessment, showToast, cancelAssessmentFlow } = useApp();
    const [round, setRound] = useState(1);
    const [wordText, setWordText] = useState('RED');
    const [inkColor, setInkColor] = useState(COLOR_OPTIONS[1]); // Green ink
    const [correctCount, setCorrectCount] = useState(0);
    const [reactionTimes, setReactionTimes] = useState([]);
    const [gameComplete, setGameComplete] = useState(false);

    const roundStartTimeRef = useRef(Date.now());

    const generateRound = () => {
        const wordIdx = Math.floor(Math.random() * COLOR_OPTIONS.length);
        let inkIdx = Math.floor(Math.random() * COLOR_OPTIONS.length);
        // Ensure mismatched ink color for Stroop effect
        while (inkIdx === wordIdx) {
            inkIdx = Math.floor(Math.random() * COLOR_OPTIONS.length);
        }
        setWordText(COLOR_OPTIONS[wordIdx].name.toUpperCase());
        setInkColor(COLOR_OPTIONS[inkIdx]);
        roundStartTimeRef.current = Date.now();
    };

    useEffect(() => {
        generateRound();
    }, []);

    const handleColorSelect = (selectedColor) => {
        const reactionTime = Date.now() - roundStartTimeRef.current;
        const isCorrect = selectedColor.name.toLowerCase() === inkColor.name.toLowerCase();

        const updatedCorrect = isCorrect ? correctCount + 1 : correctCount;
        const updatedTimes = [...reactionTimes, reactionTime];

        setCorrectCount(updatedCorrect);
        setReactionTimes(updatedTimes);

        if (round >= 10) {
            setGameComplete(true);
            const accuracy = Math.round((updatedCorrect / 10) * 100);
            const avgReaction = Math.round(updatedTimes.reduce((a, b) => a + b, 0) / updatedTimes.length);
            
            // Calculate Stroop score (1200ms baseline for older adults, 75% Accuracy + 25% Speed)
            const speedScore = Math.max(20, 100 - Math.max(0, Math.round((avgReaction - 1200) / 15)));
            const finalScore = Math.min(100, Math.max(15, Math.round(0.75 * accuracy + 0.25 * speedScore)));

            setTimeout(() => {
                completeAssessment(finalScore, 30);
                showToast(`Stroop Test Complete! Accuracy: ${accuracy}% (${avgReaction}ms)`, 'success');
            }, 1200);
        } else {
            setRound(r => r + 1);
            generateRound();
        }
    };

    const avgTime = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 0;

    return (_jsxs("div", { className: "w-full min-h-screen flex flex-col bg-background max-w-xl mx-auto text-center px-4 py-6", children: [
        _jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            _jsxs("button", { onClick: () => { cancelAssessmentFlow(); navigate('user-assessments'); }, className: "inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground", children: [
                _jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
                "Back"
            ] }),
            _jsxs("div", { className: "text-right", children: [
                _jsxs("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: ["Round ", round, " / 10"] }),
                _jsxs("p", { className: "text-sm font-bold text-[#2c7a7b]", children: [avgTime > 0 ? `${avgTime} ms avg` : 'Attention Test'] })
            ] })
        ] }),

        _jsxs("div", { className: "bg-card rounded-3xl border border-border p-8 shadow-xl mb-6 flex-1 flex flex-col items-center justify-center", children: [
            _jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6", children: "Select the INK COLOR (Not the word)" }),
            
            _jsx("div", { className: "my-8 py-6 px-10 rounded-2xl bg-muted/40 border border-border/50", children: _jsx("span", { className: "text-5xl font-extrabold tracking-wider transition-all duration-200", style: { color: inkColor.hex }, children: wordText }) }),

            gameComplete ? (_jsxs("div", { className: "mt-4 animate-bounce text-emerald-600 font-bold text-lg", children: ["Processing Minigame Score..."] })) : (_jsx("p", { className: "text-xs text-muted-foreground mt-4", children: "Tap the button matching the text ink color as fast as you can!" }))
        ] }),

        _jsx("div", { className: "grid grid-cols-2 gap-4 mb-4", children: COLOR_OPTIONS.map(opt => (_jsx("button", { onClick: () => !gameComplete && handleColorSelect(opt), disabled: gameComplete, className: "py-4 rounded-2xl text-lg font-bold text-white transition-all active:scale-95 shadow-md hover:brightness-110 disabled:opacity-50", style: { background: opt.hex }, children: opt.name }, opt.name))) })
    ] }));
}
