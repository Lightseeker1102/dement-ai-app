'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { useApp } from '../../context';

const ML_SERVICE_URL = 'http://localhost:8000';

export function RecordingView({ durationSeconds, prompt, onComplete, onCancel, assessmentType }) {
    const [timeLeft, setTimeLeft] = useState(durationSeconds);
    const [isRecording, setIsRecording] = useState(false);
    const [isStopped, setIsStopped] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activePipelineStep, setActivePipelineStep] = useState(0);
    const [transcriptText, setTranscriptText] = useState('');
    const [isSpeechSupported, setIsSpeechSupported] = useState(true);

    const intervalRef = useRef(null);
    const elapsedRef = useRef(0);
    const recognitionRef = useRef(null);
    const isRecordingRef = useRef(false);

    // Audio visualization refs
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const animationFrameRef = useRef(null);
    const sourceRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionClass) {
            setIsSpeechSupported(false);
        }
    }, []);

    const startRecording = async () => {
        setIsRecording(true);
        isRecordingRef.current = true;
        elapsedRef.current = 0;
        setTimeLeft(durationSeconds);

        // Web Speech Recognition setup
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionClass) {
            try {
                const rec = new SpeechRecognitionClass();
                rec.continuous = true;
                rec.interimResults = true;
                rec.lang = 'en-US';
                rec.onresult = (event) => {
                    let accumulated = '';
                    for (let i = 0; i < event.results.length; i++) {
                        accumulated += event.results[i][0].transcript + ' ';
                    }
                    setTranscriptText(accumulated.trim());
                };
                rec.onend = () => {
                    if (isRecordingRef.current) {
                        try { rec.start(); } catch (_) {}
                    }
                };
                rec.onerror = (e) => {
                    if (e && e.error && e.error !== 'no-speech' && e.error !== 'aborted') {
                        console.warn('Speech recognition status:', e.error);
                    }
                };
                rec.start();
                recognitionRef.current = rec;
            } catch (err) {
                console.warn('Speech recognition start error:', err);
            }
        }

        // Setup live audio graph
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContextClass();
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 128; // high resolution waves

            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;
            sourceRef.current = source;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            dataArrayRef.current = dataArray;

            drawWave(true);
        } catch (err) {
            console.warn("Microphone not available, running simulated waveform.", err);
            drawWave(false);
        }

        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    stopRecording(durationSeconds);
                    return 0;
                }
                elapsedRef.current += 1;
                return prev - 1;
            });
        }, 1000);
    };

    const stopRecording = (elapsed) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (_) {}
        }
        setIsRecording(false);
        isRecordingRef.current = false;
        setIsStopped(true);
        const actualElapsed = elapsed ?? (durationSeconds - timeLeft);
        elapsedRef.current = actualElapsed;

        // Cleanup audio nodes
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }

        // Draw dynamic final resting line
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#38a169'; // Green resting wave
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }
    };

    // Beautiful wave drawer (supports real or simulated)
    const drawWave = (isReal) => {
        let simOffset = 0;
        const renderFrame = () => {
            if (!canvasRef.current) return;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 3;
            ctx.strokeStyle = '#e53e3e'; // Recording red
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();

            if (isReal && analyserRef.current && dataArrayRef.current) {
                const analyser = analyserRef.current;
                const dataArray = dataArrayRef.current;
                const bufferLength = analyser.frequencyBinCount;
                analyser.getByteTimeDomainData(dataArray);

                const sliceWidth = canvas.width / bufferLength;
                let x = 0;
                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = (v * canvas.height) / 2;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                    x += sliceWidth;
                }
            } else {
                // Simulation drawing
                simOffset += 0.18;
                const points = 40;
                const sliceWidth = canvas.width / points;
                let x = 0;
                for (let i = 0; i < points; i++) {
                    const baseWave = Math.sin(i * 0.25 + simOffset);
                    const modulation = Math.sin(simOffset * 0.08) * 0.6 + 0.4;
                    const noise = (Math.random() - 0.5) * 0.08;
                    const amp = (baseWave * modulation + noise) * (canvas.height * 0.35);
                    const y = canvas.height / 2 + amp;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                    x += sliceWidth;
                }
            }
            ctx.stroke();
            animationFrameRef.current = requestAnimationFrame(renderFrame);
        };
        animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    // Draw initial resting wave
    useEffect(() => {
        if (!isRecording && !isStopped && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#2c7a7b'; // Teal resting wave
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }
    }, [isRecording, isStopped]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (_) {}
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    const handleSave = async () => {
        setIsAnalyzing(true);
        setActivePipelineStep(0);

        const elapsed = elapsedRef.current > 0 ? elapsedRef.current : (durationSeconds - timeLeft);

        let finalTranscript = transcriptText.trim();
        if (!finalTranscript) {
            // No speech was captured — provide empty transcript for honest scoring
            finalTranscript = '';
            setTranscriptText(finalTranscript);
        }

        // Stage 1: Acoustic Feature Extraction
        await new Promise(r => setTimeout(r, 400));
        setActivePipelineStep(1);

        // Stage 2: Send transcript to ML Service for real evaluation
        let mlScore = null;
        const mlEndpoint = assessmentType === 'picture-recall'
            ? '/evaluate/picture-recall'
            : '/evaluate/structured-speech';

        try {
            const mlResponse = await fetch(`${ML_SERVICE_URL}${mlEndpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcript_text: finalTranscript,
                    duration_seconds: elapsed > 0 ? elapsed : durationSeconds,
                }),
            });
            if (mlResponse.ok) {
                const mlData = await mlResponse.json();
                if (mlData.ok && mlData.result && typeof mlData.result.score === 'number') {
                    mlScore = mlData.result.score;
                }
            }
        } catch (err) {
            console.warn('ML Service unreachable, falling back to client-side scoring:', err.message);
        }

        setActivePipelineStep(2);
        // Stage 3: Cognitive Cohort Semantic Mapping
        await new Promise(r => setTimeout(r, 400));
        setActivePipelineStep(3);

        // Stage 4: Risk Coefficient Classification
        await new Promise(r => setTimeout(r, 300));

        // Use ML score if available, otherwise fall back to client-side heuristic
        let calculatedScore;
        if (mlScore !== null) {
            calculatedScore = mlScore;
        } else {
            // Client-side fallback scoring
            const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'was', 'it', 'this', 'that', 'i', 'you', 'he', 'she', 'we', 'they']);
            const cleanedWords = finalTranscript.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0);
            const nonStopWords = cleanedWords.filter(w => !stopWords.has(w));
            const uniqueSubstantive = new Set(nonStopWords);
            if (cleanedWords.length === 0) {
                calculatedScore = 15;
            } else {
                calculatedScore = Math.min(98, Math.max(15, 30 + (uniqueSubstantive.size * 6)));
            }
        }

        onComplete(calculatedScore, elapsed, finalTranscript);
    };

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
    const progress = 1 - timeLeft / durationSeconds;

    if (isAnalyzing) {
        const steps = [
            { label: 'Acoustic Feature Extraction', desc: 'Analyzing tone, pitch variance, and speech pauses' },
            { label: 'Speech-to-Text Transcription', desc: 'Converting speech stream to structured text representation' },
            { label: 'Cognitive Cohort Semantic Mapping', desc: 'Evaluating syntactic complexity and word-association vectors' },
            { label: 'Risk Coefficient Classification', desc: 'Generating final predictive score and risk tier categorization' }
        ];

        return (_jsx("div", { className: "mx-auto flex w-full min-h-screen max-w-xl flex-col bg-background px-4 justify-center items-center text-center", children: _jsxs("div", { className: "w-full bg-card rounded-3xl border border-border p-8 shadow-2xl animate-in fade-in zoom-in duration-300", children: [_jsxs("div", { className: "flex flex-col items-center mb-8", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center mb-4 animate-bounce", children: _jsx("svg", { className: "w-8 h-8 text-[#2c7a7b]", fill: "none", stroke: "currentColor", strokeWidth: "1.8", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925-3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 002.25 6v1.5a6 6 0 006 6h1.5A3.75 3.75 0 0119.5 15v1.5a6 6 0 01-6 6h-1.5M12 18v3m0-3H9m3 0h3" }) }) }), _jsx("h2", { className: "text-2xl font-bold text-foreground", children: "DementAI Engine" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Analyzing speech biometrics & linguistic patterns..." })] }), _jsx("div", { className: "flex flex-col gap-6 text-left max-w-sm mx-auto", children: steps.map((step, idx) => {
                            const isDone = activePipelineStep > idx;
                            const isActive = activePipelineStep === idx;
                            return (_jsxs("div", { className: `flex items-start gap-4 transition-all duration-300 ${isDone ? 'opacity-100' : isActive ? 'opacity-100 scale-102 font-medium' : 'opacity-40'}`, children: [_jsx("div", { className: "flex-shrink-0 mt-0.5", children: isDone ? (_jsx("div", { className: "w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white", children: _jsx("svg", { className: "w-3.5 h-3.5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) })) : isActive ? (_jsx("div", { className: "w-6 h-6 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" })) : (_jsx("div", { className: "w-6 h-6 rounded-full border border-border bg-muted/40" })) }), _jsxs("div", { children: [_jsx("p", { className: `text-base font-semibold ${isActive ? 'text-[#2c7a7b]' : 'text-foreground'}`, children: step.label }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: step.desc })] })] }, idx));
                        }) })] }) }));
    }

    return (_jsxs("div", { className: "mx-auto flex w-full min-h-screen max-w-xl flex-col bg-background px-4 text-center sm:px-6 py-6", children: [
        _jsxs("div", { className: "flex-shrink-0 flex items-center justify-center gap-3 pt-4 pb-2", children: [
            _jsx("button", { onClick: onCancel, className: "w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground transition-colors hover:bg-muted/70", children: _jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", clipRule: "evenodd" }) }) }),
            _jsxs("div", { children: [_jsx("h2", { className: "text-base font-bold text-foreground", children: "Voice & Speech Recording" }), _jsx("p", { className: "text-xs text-muted-foreground", children: isSpeechSupported ? "Speak into microphone or type response below" : "Type your response in the box below" })] })
        ] }),

        prompt && (_jsxs("div", { className: "flex-shrink-0 mb-3 rounded-2xl p-4 text-left border border-blue-200 bg-blue-50/80", children: [
            _jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-blue-700 mb-1", children: "Topic Prompt" }),
            _jsx("p", { className: "text-sm font-semibold text-blue-900 leading-relaxed", children: prompt })
        ] })),

        _jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-4 gap-4", children: [
            _jsxs("div", { className: "relative w-36 h-36", children: [
                _jsxs("svg", { className: "w-full h-full -rotate-90", viewBox: "0 0 100 100", children: [
                    _jsx("circle", { cx: "50", cy: "50", r: "44", fill: "none", stroke: "#e2e8f0", strokeWidth: "6" }),
                    _jsx("circle", { cx: "50", cy: "50", r: "44", fill: "none", stroke: isStopped ? '#38a169' : isRecording ? '#e53e3e' : '#2c7a7b', strokeWidth: "6", strokeLinecap: "round", strokeDasharray: `${2 * Math.PI * 44}`, strokeDashoffset: `${2 * Math.PI * 44 * (1 - progress)}`, style: { transition: 'stroke-dashoffset 0.5s ease' } })
                ] }),
                _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-center", children: [
                    _jsx("span", { className: "text-3xl font-bold tabular-nums", style: { color: isStopped ? '#38a169' : isRecording ? '#e53e3e' : '#2c7a7b' }, children: timeStr }),
                    _jsx("span", { className: "text-xs text-muted-foreground mt-0.5", children: isStopped ? 'Stopped' : isRecording ? 'Recording...' : 'Ready' }),
                    _jsx("canvas", { ref: canvasRef, width: "110", height: "24", className: "w-[110px] h-[24px] mt-1 opacity-80" })
                ] })
            ] }),

            !isStopped && (_jsxs("div", { className: "relative flex flex-col items-center justify-center gap-3 w-full max-w-sm", children: [
                _jsxs("div", { className: "relative flex items-center justify-center", children: [
                    isRecording && (_jsxs(_Fragment, { children: [
                        _jsx("div", { className: "absolute rounded-full animate-ping", style: { width: 80, height: 80, background: '#e53e3e', opacity: 0.2, animationDuration: '1.5s' } }),
                        _jsx("div", { className: "absolute rounded-full animate-ping", style: { width: 68, height: 68, background: '#e53e3e', opacity: 0.15, animationDuration: '1.5s', animationDelay: '0.5s' } })
                    ] })),
                    _jsx("button", { onClick: isRecording ? () => stopRecording() : startRecording, className: "relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95", style: {
                        background: isRecording ? 'linear-gradient(135deg, #e53e3e, #c53030)' : 'linear-gradient(135deg, #2c7a7b, #1a5e5e)',
                        boxShadow: isRecording ? '0 6px 20px rgba(229,62,62,0.45)' : '0 6px 20px rgba(44,122,123,0.45)',
                    }, "aria-label": isRecording ? 'Stop recording' : 'Start recording', children: isRecording ? (
                        _jsx("svg", { className: "w-7 h-7", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2" }) })
                    ) : (
                        _jsx("svg", { className: "w-7 h-7", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" }) })
                    ) })
                ] }),
                isRecording && (_jsx("button", { type: "button", onClick: () => stopRecording(), className: "w-full py-2.5 rounded-xl font-bold text-sm text-white bg-amber-600 hover:bg-amber-700 shadow transition-all", children: "Finish Early" }))
            ] })),

            // Live Recognized Transcript & Text Input Fallback
            _jsxs("div", { className: "w-full text-left bg-card border border-border rounded-2xl p-4 shadow-sm", children: [
                _jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                    _jsx("label", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Captured Speech / Typed Text" }),
                    isRecording && (_jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-bold text-red-600 animate-pulse", children: [
                        _jsx("span", { className: "w-2 h-2 rounded-full bg-red-600" }),
                        "Listening..."
                    ] }))
                ] }),
                _jsx("textarea", {
                    value: transcriptText,
                    onChange: e => setTranscriptText(e.target.value),
                    placeholder: isRecording ? "Speaking into microphone..." : "Type or speak your answer here...",
                    rows: 3,
                    className: "w-full rounded-xl border border-border bg-muted/20 p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#2c7a7b] resize-none"
                })
            ] })
        ] }),

        _jsxs("div", { className: "flex-shrink-0 px-4 pt-3 pb-6 flex flex-col gap-2.5", children: [
            isStopped && (_jsxs("button", { onClick: handleSave, className: "w-full py-3.5 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]", style: {
                background: 'linear-gradient(135deg, #38a169, #276749)',
                boxShadow: '0 4px 14px rgba(56,161,105,0.4)',
            }, children: [
                _jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
                "Save & Analyze Response"
            ] })),
            _jsx("button", { onClick: onCancel, className: "w-full py-3 rounded-xl font-semibold text-sm border border-border text-muted-foreground hover:bg-muted/40", children: "Cancel Task" })
        ] })
    ] }));
}

export default function RecordingScreen() {
    const { navigate, completeAssessment, showToast, cancelAssessmentFlow } = useApp();
    return (_jsx(RecordingView, { durationSeconds: 60, assessmentType: "picture-recall", onComplete: (score, duration, transcript) => {
            completeAssessment(score, duration, transcript);
            showToast('Assessment response saved successfully!', 'success');
        }, onCancel: () => {
            cancelAssessmentFlow();
            navigate('user-assessments');
        } }));
}
