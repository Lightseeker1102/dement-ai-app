'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useApp, getRiskColor } from '../../context';
import RiskBadge from '../../components/risk-badge';
const MOTIVATIONAL_QUOTES = [
    {
        quote: "Every step you take today is a gift to your future self. You are doing something truly brave.",
        author: "Dement(AI) Care Team",
    },
    {
        quote: "Progress, not perfection. Each test you complete teaches us how to help you better.",
        author: "Dement(AI) Care Team",
    },
    {
        quote: "You are not alone on this journey. Every assessment brings you closer to better care.",
        author: "Dement(AI) Care Team",
    },
    {
        quote: "Small consistent steps lead to big results. Thank you for showing up for yourself today.",
        author: "Dement(AI) Care Team",
    },
    {
        quote: "Your mind is worth caring for. This test is a small act of love for yourself.",
        author: "Dement(AI) Care Team",
    },
];
export default function UserDashboard() {
    const { currentUser, navigate } = useApp();
    if (!currentUser)
        return null;
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
    });
    // Pick a stable quote based on the day of the week
    const quoteIndex = new Date().getDay() % MOTIVATIONAL_QUOTES.length;
    const quote = MOTIVATIONAL_QUOTES[quoteIndex];
    const lastScore = currentUser.history.length > 0 ? currentUser.history[0].score : null;
    const displayName = currentUser.fullName ?? currentUser.username;
    return (_jsxs("div", { className: "mx-auto grid max-w-6xl gap-8 px-4 py-6 text-left sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:px-8 lg:py-10", children: [_jsxs("div", { className: "flex min-w-0 flex-col gap-8", children: [_jsxs("div", { children: [_jsx("p", { className: "mb-1 text-base text-muted-foreground", children: today }), _jsxs("h1", { className: "text-3xl font-bold leading-tight text-foreground sm:text-4xl", children: ["Welcome back, ", _jsx("span", { style: { color: '#2c7a7b' }, children: displayName })] }), _jsx("p", { className: "mt-2 text-lg text-muted-foreground", children: "Here's a summary of your cognitive health status." })] }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5", children: [_jsxs("div", { className: "bg-card rounded-2xl p-6 border border-border shadow-sm", children: [_jsx("p", { className: "text-sm font-medium text-muted-foreground mb-2", children: "Risk Status" }), _jsx(RiskBadge, { tier: currentUser.riskTier, size: "lg" })] }), _jsxs("div", { className: "bg-card rounded-2xl p-6 border border-border shadow-sm", children: [_jsx("p", { className: "text-sm font-medium text-muted-foreground mb-1", children: "Total Assessments" }), _jsx("p", { className: "text-4xl font-bold text-foreground", children: currentUser.totalAssessments })] }), _jsxs("div", { className: "bg-card rounded-2xl p-6 border border-border shadow-sm", children: [_jsx("p", { className: "text-sm font-medium text-muted-foreground mb-1", children: "Last Score" }), _jsx("p", { className: "text-4xl font-bold", style: { color: lastScore !== null ? getRiskColor(currentUser.riskTier) : '#a0aec0' }, children: lastScore !== null ? lastScore : '—' })] })] }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsxs("button", { onClick: () => navigate('user-history'), className: "rounded-2xl border border-border bg-card px-5 py-4 text-left shadow-sm transition-all hover:shadow-md", children: [_jsx("p", { className: "text-sm font-semibold text-muted-foreground", children: "Quick link" }), _jsx("p", { className: "mt-1 text-lg font-semibold text-foreground", children: "Review my assessment history" })] }), _jsxs("button", { onClick: () => navigate('user-profile'), className: "rounded-2xl border border-border bg-card px-5 py-4 text-left shadow-sm transition-all hover:shadow-md", children: [_jsx("p", { className: "text-sm font-semibold text-muted-foreground", children: "Quick link" }), _jsx("p", { className: "mt-1 text-lg font-semibold text-foreground", children: "Update my profile and doctor info" })] })] }), (currentUser.doctorName || currentUser.doctorEmail) && (_jsxs("div", { className: "rounded-2xl border p-6 flex items-start gap-4", style: { background: '#ebf8ff', borderColor: '#bee3f8' }, children: [_jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center", style: { background: '#bee3f8' }, children: _jsx("svg", { className: "w-6 h-6", style: { color: '#2b6cb0' }, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold", style: { color: '#2b6cb0' }, children: "Your Care Provider" }), currentUser.doctorName && (_jsxs("p", { className: "mt-0.5 text-lg font-bold", style: { color: '#1a365d' }, children: ["Dr. ", currentUser.doctorName] })), currentUser.doctorEmail && (_jsx("a", { href: `mailto:${currentUser.doctorEmail}`, className: "mt-0.5 block text-base underline", style: { color: '#2b6cb0' }, children: currentUser.doctorEmail }))] })] })), _jsxs("div", { className: "rounded-2xl border px-5 py-4", style: { background: '#fffbf0', borderColor: '#fed7aa' }, children: [_jsx("p", { className: "text-sm font-semibold", style: { color: '#c05621' }, children: "Need help?" }), _jsx("p", { className: "mt-1 text-sm leading-relaxed text-foreground", children: "Use the top Help button or the navigation bar to move between assessment, history, and profile screens." })] }), currentUser.lastAssessmentDate && (_jsxs("p", { className: "text-sm text-muted-foreground", children: ["Last assessment completed on ", _jsx("strong", { children: currentUser.lastAssessmentDate })] }))] }), _jsxs("div", { className: "flex min-w-0 flex-col gap-6 lg:sticky lg:top-28", children: [_jsxs("div", { className: "rounded-[2rem] border p-6 shadow-sm", style: {
                            background: 'linear-gradient(135deg, #f4fff8 0%, #ecfff6 100%)',
                            borderColor: '#c6f6d5',
                        }, children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.2em]", style: { color: '#276749' }, children: "Start now" }), _jsx("h2", { className: "mt-2 text-2xl font-bold text-foreground", children: "Begin a new assessment flow" }), _jsx("p", { className: "mt-2 text-base leading-relaxed text-muted-foreground", children: "One tap starts the first test, then the next two will continue automatically." }), _jsxs("button", { onClick: () => navigate('user-assessments'), className: "mt-6 inline-flex w-full items-center justify-center gap-4 rounded-3xl px-10 py-6 text-white transition-all hover:opacity-90 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300", style: {
                                    background: 'linear-gradient(135deg, #276749 0%, #38a169 100%)',
                                    fontSize: '1.125rem',
                                    boxShadow: '0 8px 30px rgba(56, 161, 105, 0.45)',
                                    letterSpacing: '0.01em',
                                }, "aria-label": "Start a new cognitive assessment", children: [_jsx("svg", { className: "h-8 w-8", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M8 5v14l11-7z" }) }), "Start Assessment"] })] }), _jsx("div", { className: "rounded-2xl border p-7", style: {
                            background: 'linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%)',
                            borderColor: '#c6f6d5',
                        }, children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full text-xl font-serif font-bold", style: { background: '#c6f6d5', color: '#276749' }, children: "\u201C" }), _jsxs("div", { children: [_jsx("p", { className: "text-left font-medium leading-relaxed", style: { color: '#22543d', fontSize: '1.15rem', lineHeight: '1.75' }, children: quote.quote }), _jsxs("p", { className: "mt-3 text-sm font-semibold", style: { color: '#38a169' }, children: ["\u2014 ", quote.author] })] })] }) })] })] }));
}
