'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useApp, getRiskColor, getAssessmentLabel } from '../../context';
import { getMockTranscript } from '@/lib/mock-transcripts';
import RiskBadge from '../../components/risk-badge';

export default function AssessmentCompleteScreen() {
    const { assessmentCompletionSummary, navigate, showToast, cancelAssessmentFlow } = useApp();

    const handleFinish = () => {
        cancelAssessmentFlow();
        navigate('user-dashboard');
        showToast('Three-step assessment sequence completed.', 'success');
    };

    const summary = assessmentCompletionSummary;
    const assessment = summary?.assessment;
    const transcript = assessment ? getMockTranscript(assessment.type, assessment.score) : null;

    const stepLabel = summary
        ? `${summary.stepIndex} / ${summary.totalSteps}`
        : '3 / 3';

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 assessment-complete-rise bg-muted/30">
            <div className="w-full max-w-2xl rounded-[2rem] border border-border bg-card/95 px-6 py-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:px-10">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2c7a7b,#1a5e5e)] text-white shadow-lg">
                    <svg className="h-9 w-9" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Assessment flow complete</p>
                <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">You finished all three tests</h1>
                <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
                    Your results have been processed by DementAI's local speech biomarker models.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-muted/40 px-4 py-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Steps</p>
                        <p className="mt-2 text-2xl font-bold text-foreground">{stepLabel}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-muted/40 px-4 py-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Latest score</p>
                        <p className="mt-2 text-2xl font-bold text-foreground" style={{ color: assessment ? getRiskColor(assessment.riskTier) : 'inherit' }}>
                            {assessment?.score ?? '--'}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-muted/40 px-4 py-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Risk Status</p>
                        <div className="mt-2 flex justify-center">
                            {assessment ? <RiskBadge tier={assessment.riskTier} /> : <p className="text-lg font-semibold text-foreground">--</p>}
                        </div>
                    </div>
                </div>

                {/* Transcript Analysis Review Panel */}
                {assessment && transcript && (
                    <div className="mt-8 text-left rounded-2xl border border-border p-6 bg-background">
                        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center justify-between">
                            <span>Speech Analysis Preview</span>
                            <span className="text-xs font-medium text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded-full">
                                {getAssessmentLabel(assessment.type)}
                            </span>
                        </h2>
                        
                        {/* Highlights list */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {transcript.highlights.map((word, i) => (
                                <span key={i} className="text-xs px-2 py-1 rounded bg-[#2c7a7b]/10 text-[#2c7a7b] font-medium border border-[#2c7a7b]/20">
                                    ✓ {word}
                                </span>
                            ))}
                        </div>

                        {/* Transcript text content with bold highlights */}
                        <div className="rounded-xl bg-muted/40 p-4 border border-border max-h-36 overflow-y-auto mb-4">
                            <p className="text-sm text-foreground leading-relaxed italic">
                                {(() => {
                                    const words = transcript.text.split(' ');
                                    return words.map((word, idx) => {
                                        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                                        const isHighlighted = transcript.highlights.some(h => h.toLowerCase() === cleanWord.toLowerCase());
                                        return (
                                            <span key={idx} className={isHighlighted ? "font-bold text-[#2c7a7b] not-italic bg-teal-50 px-0.5 rounded" : ""}>
                                                {word}{' '}
                                            </span>
                                        );
                                    });
                                })()}
                            </p>
                        </div>

                        {/* Acoustic/Speech Metrics Grid */}
                        <div className="grid grid-cols-3 gap-2.5 bg-muted/20 p-3.5 rounded-xl border border-border">
                            <div>
                                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Speech Pauses</p>
                                <p className="text-sm font-bold text-foreground mt-0.5">{transcript.metrics.pauses || 'None'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                                    {assessment.type === 'animal-naming' ? 'Unique Words' : assessment.type === 'picture-recall' ? 'Recall Accuracy' : 'Coherence'}
                                </p>
                                <p className="text-sm font-bold text-foreground mt-0.5">
                                    {transcript.metrics.wordsCount || transcript.metrics.recallAccuracy || transcript.metrics.coherence || '--'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Biometric Score</p>
                                <p className="text-sm font-bold mt-0.5" style={{ color: getRiskColor(assessment.riskTier) }}>
                                    {assessment.score}/100
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <button onClick={handleFinish} className="mt-8 w-full py-4 rounded-xl font-bold text-lg text-white bg-[linear-gradient(135deg,#2c7a7b,#1a5e5e)] transition-all active:scale-[0.98] shadow-lg shadow-[#2c7a7b]/30">
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}
