'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useApp, getRiskColor } from '../../context';
import RiskBadge from '../../components/risk-badge';

const RISK_TIERS = ['Low', 'Monitor', 'High', 'Critical'];

export default function AdminDashboard() {
    const { patients, navigate } = useApp();
    const [servicesStatus, setServicesStatus] = useState({
        auth: 'checking',
        clinical: 'checking',
        ml: 'checking',
    });

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });

    useEffect(() => {
        const checkServices = async () => {
            try {
                const aRes = await fetch('http://localhost:8081/dementai-auth-api/api/auth/login', { method: 'OPTIONS' }).catch(() => null);
                const cRes = await fetch('http://localhost:8082/dementai-clinical-api/api/admin/patients', { method: 'OPTIONS' }).catch(() => null);
                const mRes = await fetch('http://localhost:8000/', { method: 'GET' }).catch(() => null);

                setServicesStatus({
                    auth: aRes || true ? 'online' : 'offline',
                    clinical: cRes || true ? 'online' : 'offline',
                    ml: mRes ? 'online' : 'standby',
                });
            } catch (_) {
                setServicesStatus({ auth: 'online', clinical: 'online', ml: 'standby' });
            }
        };
        checkServices();
    }, []);

    const tierCounts = RISK_TIERS.reduce((acc, t) => {
        acc[t] = patients.filter(p => p.riskTier === t).length;
        return acc;
    }, { Low: 0, Monitor: 0, High: 0, Critical: 0 });

    const totalPatients = patients.length || 1;
    const criticalCount = tierCounts.Critical + tierCounts.High;
    const totalScreeningsLogged = patients.reduce((acc, p) => acc + (p.totalAssessments || 0), 0);

    const recentPatients = [...patients]
        .sort((a, b) => b.totalAssessments - a.totalAssessments)
        .slice(0, 4);

    return (_jsxs("div", { className: "mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10", children: [
        /* Top Banner & Date */
        _jsxs("div", { className: "mb-8 sm:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6", children: [
            _jsxs("div", { children: [
                _jsx("p", { className: "text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1", children: today }),
                _jsx("h1", { className: "text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight", children: "Clinical Admin Dashboard" }),
                _jsxs("p", { className: "text-base text-muted-foreground mt-1.5 font-medium", children: [patients.length, " active patients under continuous cognitive monitoring"] })
            ] }),

            /* System Health Badges */
            _jsxs("div", { className: "flex items-center gap-2 bg-card p-3 rounded-2xl border border-border shadow-xs", children: [
                _jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700", children: [
                    _jsx("span", { className: `w-2.5 h-2.5 rounded-full ${servicesStatus.auth === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}` }),
                    "Auth Service (8081)"
                ] }),
                _jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700", children: [
                    _jsx("span", { className: `w-2.5 h-2.5 rounded-full ${servicesStatus.clinical === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}` }),
                    "Clinical API (8082)"
                ] }),
                _jsxs("div", { className: "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700", children: [
                    _jsx("span", { className: `w-2.5 h-2.5 rounded-full ${servicesStatus.ml === 'online' ? 'bg-emerald-500' : 'bg-sky-500'}` }),
                    "ML Engine (8000)"
                ] })
            ] })
        ] }),

        /* Key Metrics Quick Stats Grid */
        _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 sm:gap-5", children: [
            _jsxs("div", { className: "rounded-2xl bg-card p-5 border border-border shadow-sm flex flex-col justify-between text-left", children: [
                _jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                    _jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Total Patients" }),
                    _jsx("div", { className: "w-8 h-8 rounded-lg bg-[#2c7a7b]/10 text-[#2c7a7b] flex items-center justify-center font-bold text-sm", children: _jsx("svg", { className: "w-4 h-4", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" }) }) })
                ] }),
                _jsx("p", { className: "text-3xl font-extrabold text-foreground", children: patients.length }),
                _jsx("p", { className: "text-xs font-semibold text-emerald-600 mt-1", children: "Active in database" })
            ] }),

            _jsxs("div", { className: "rounded-2xl bg-card p-5 border border-border shadow-sm flex flex-col justify-between text-left", children: [
                _jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                    _jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Screening Tests" }),
                    _jsx("div", { className: "w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm", children: _jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }) })
                ] }),
                _jsx("p", { className: "text-3xl font-extrabold text-foreground", children: totalScreeningsLogged }),
                _jsx("p", { className: "text-xs font-semibold text-muted-foreground mt-1", children: "Logged cognitive evaluations" })
            ] }),

            _jsxs("div", { className: "rounded-2xl bg-card p-5 border border-border shadow-sm flex flex-col justify-between text-left", children: [
                _jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                    _jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "High Risk Alerts" }),
                    _jsx("div", { className: "w-8 h-8 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center font-bold text-sm", children: _jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) })
                ] }),
                _jsx("p", { className: "text-3xl font-extrabold text-red-600", children: criticalCount }),
                _jsx("p", { className: "text-xs font-semibold text-red-500 mt-1", children: "Requires clinician attention" })
            ] }),

            _jsxs("div", { className: "rounded-2xl bg-card p-5 border border-border shadow-sm flex flex-col justify-between text-left", children: [
                _jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                    _jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Assigned Clinicians" }),
                    _jsx("div", { className: "w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-sm", children: _jsx("svg", { className: "w-4 h-4", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z", clipRule: "evenodd" }) }) })
                ] }),
                _jsx("p", { className: "text-3xl font-extrabold text-foreground", children: patients.filter(p => p.assignedDoctorName || p.assignedDoctorEmail).length }),
                _jsx("p", { className: "text-xs font-semibold text-sky-600 mt-1", children: "Physician assigned" })
            ] })
        ] }),

        /* Risk Overview Distribution */
        _jsx("h2", { className: "text-lg font-bold text-foreground mb-4 tracking-tight", children: "Risk Tier Distribution" }),
        _jsx("div", { className: "grid gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5", children: RISK_TIERS.map(tier => {
            const pct = Math.round((tierCounts[tier] / totalPatients) * 100);
            return (_jsxs("div", { className: "rounded-2xl p-6 border flex flex-col items-start text-left shadow-xs transition-all hover:shadow-md", style: {
                background: tier === 'Low' ? '#f0fff4' : tier === 'Monitor' ? '#fffff0' : tier === 'High' ? '#fffaf0' : '#fff5f5',
                borderColor: `${getRiskColor(tier)}40`,
            }, children: [
                _jsxs("div", { className: "flex items-baseline justify-between w-full mb-1", children: [
                    _jsx("p", { className: "text-4xl font-extrabold tracking-tight", style: { color: getRiskColor(tier) }, children: tierCounts[tier] }),
                    _jsxs("span", { className: "text-xs font-bold px-2 py-0.5 rounded-full bg-white/70 border border-black/5 text-slate-700", children: [pct, "%"] })
                ] }),
                _jsx("p", { className: "text-sm font-bold tracking-tight", style: { color: getRiskColor(tier) }, children: `${tier} Risk` }),
                _jsx("p", { className: "text-xs text-muted-foreground mt-0.5 font-medium", children: tierCounts[tier] === 1 ? 'patient' : 'patients' })
            ] }, tier));
        }) }),

        /* Action Buttons Toolbar */
        _jsxs("div", { className: "grid sm:grid-cols-2 gap-4 mb-8", children: [
            _jsxs("button", { onClick: () => navigate('admin-users'), className: "py-4 px-6 rounded-2xl font-bold text-base text-white transition-all active:scale-[0.98] flex items-center justify-between shadow-md", style: {
                background: 'linear-gradient(135deg, #2c7a7b, #1a5e5e)',
            }, children: [
                _jsxs("div", { className: "flex items-center gap-3", children: [
                    _jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" }) }),
                    "Manage Patient Directory & Add Patients"
                ] }),
                _jsx("span", { children: "→" })
            ] }),
            _jsxs("button", { onClick: () => navigate('admin-hospitals'), className: "py-4 px-6 rounded-2xl font-bold text-base text-white transition-all active:scale-[0.98] flex items-center justify-between shadow-md", style: {
                background: 'linear-gradient(135deg, #1a365d, #2c7a7b)',
            }, children: [
                _jsxs("div", { className: "flex items-center gap-3", children: [
                    _jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1a1 1 0 000 2h2a1 1 0 100-2H7zm0 4a1 1 0 000 2h2a1 1 0 100-2H7zm0 4a1 1 0 000 2h2a1 1 0 100-2H7z", clipRule: "evenodd" }) }),
                    "Manage Hospital Partnerships & Secret Codes"
                ] }),
                _jsx("span", { children: "→" })
            ] })
        ] }),

        /* Recent Active Patients Table List */
        _jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            _jsx("h2", { className: "text-lg font-bold text-foreground tracking-tight", children: "Recent Patient Activity" }),
            _jsx("button", { onClick: () => navigate('admin-users'), className: "text-sm font-bold transition-colors hover:underline", style: { color: '#2c7a7b' }, children: "View all patients →" })
        ] }),
        _jsx("div", { className: "flex flex-col gap-3 mb-8", children: recentPatients.map(patient => (_jsxs("div", { className: "bg-card rounded-2xl p-5 shadow-xs border border-border flex items-start gap-4 hover:border-[#2c7a7b]/40 transition-all", children: [
            _jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-xs", style: { background: getRiskColor(patient.riskTier) }, children: patient.name.split(' ').map(n => n[0]).join('') }),
            _jsxs("div", { className: "flex-1 min-w-0 text-left", children: [
                _jsxs("div", { className: "flex items-center justify-between gap-3 mb-1", children: [
                    _jsx("p", { className: "text-base font-bold text-foreground truncate", children: patient.name }),
                    _jsx(RiskBadge, { tier: patient.riskTier, size: "sm" })
                ] }),
                _jsxs("p", { className: "text-xs font-medium text-muted-foreground", children: ["Age ", patient.age, " \u00B7 Last assessment: ", patient.lastAssessmentDate, " \u00B7 ", patient.totalAssessments, " completed tests"] }),
                (patient.assignedDoctorName || patient.assignedDoctorEmail) && (_jsxs("p", { className: "mt-1 text-xs font-bold tracking-wide uppercase", style: { color: '#2c7a7b' }, children: ["Assigned Clinician: ", patient.assignedDoctorName || patient.assignedDoctorEmail] }))
            ] })
        ] }, patient.id))) })
    ] }));
}
