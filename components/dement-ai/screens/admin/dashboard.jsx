'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useApp, getRiskColor } from '../../context';
import RiskBadge from '../../components/risk-badge';
const RISK_TIERS = ['Low', 'Monitor', 'High', 'Critical'];
export default function AdminDashboard() {
    const { patients, navigate } = useApp();
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
    });
    const tierCounts = RISK_TIERS.reduce((acc, t) => {
        acc[t] = patients.filter(p => p.riskTier === t).length;
        return acc;
    }, { Low: 0, Monitor: 0, High: 0, Critical: 0 });
    const recentPatients = [...patients]
        .sort((a, b) => b.totalAssessments - a.totalAssessments)
        .slice(0, 4);
    return (_jsxs("div", { className: "mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10", children: [_jsxs("div", { className: "mb-8 sm:mb-10", children: [_jsx("p", { className: "text-base text-muted-foreground mb-1", children: today }), _jsx("h1", { className: "text-3xl font-bold text-foreground sm:text-4xl", children: "Admin Dashboard" }), _jsxs("p", { className: "text-lg text-muted-foreground mt-2", children: [patients.length, " patients under monitoring"] })] }), _jsx("h2", { className: "text-lg font-bold text-foreground mb-4", children: "Risk Overview" }), _jsx("div", { className: "grid gap-4 mb-8 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5 sm:mb-10", children: RISK_TIERS.map(tier => (_jsxs("div", { className: "rounded-2xl p-6 border flex flex-col items-start text-left", style: {
                        background: tier === 'Low' ? '#f0fff4' : tier === 'Monitor' ? '#fffff0' : tier === 'High' ? '#fffaf0' : '#fff5f5',
                        borderColor: `${getRiskColor(tier)}30`,
                    }, children: [_jsx("p", { className: "text-5xl font-bold mb-2", style: { color: getRiskColor(tier) }, children: tierCounts[tier] }), _jsx("p", { className: "text-sm font-semibold", style: { color: getRiskColor(tier) }, children: tier }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: tierCounts[tier] === 1 ? 'patient' : 'patients' })] }, tier))) }), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-bold text-foreground", children: "Recent Activity" }), _jsx("button", { onClick: () => navigate('admin-users'), className: "text-base font-semibold transition-colors", style: { color: '#2c7a7b' }, children: "View all patients" })] }), _jsx("div", { className: "flex flex-col gap-4 mb-8", children: recentPatients.map(patient => (_jsxs("div", { className: "bg-card rounded-2xl p-5 shadow-sm border border-border flex items-start gap-5", children: [_jsx("div", { className: "flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-white", style: { background: getRiskColor(patient.riskTier) }, children: patient.name.split(' ').map(n => n[0]).join('') }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 mb-1", children: [_jsx("p", { className: "text-lg font-semibold text-foreground truncate", children: patient.name }), _jsx(RiskBadge, { tier: patient.riskTier, size: "lg" })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Age ", patient.age, " \u00B7 Last test: ", patient.lastAssessmentDate, " \u00B7 ", patient.totalAssessments, " assessments"] })] })] }, patient.id))) }), _jsxs("button", { onClick: () => navigate('admin-reports'), className: "w-full py-5 rounded-2xl font-bold text-xl text-white transition-all active:scale-[0.98] flex items-center justify-start gap-3 px-6", style: {
                    background: 'linear-gradient(135deg, #ed8936, #c97925)',
                    boxShadow: '0 6px 20px rgba(237,137,54,0.4)',
                }, children: [_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z", clipRule: "evenodd" }) }), "Generate Patient Reports"] })] }));
}
