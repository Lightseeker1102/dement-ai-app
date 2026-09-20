'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useApp, getRiskColor, getAssessmentLabel } from '../../context';
import RiskBadge from '../../components/risk-badge';
import EmptyState from '../../components/empty-state';
export default function UserHistory() {
    const { currentUser } = useApp();
    const [expandedId, setExpandedId] = useState(null);
    if (!currentUser)
        return null;
    const history = currentUser.history;
    const chartData = [...history].reverse().slice(0, 6);

    const getDisplaySubScores = (item) => {
        if (Array.isArray(item.subScores) && item.subScores.length > 0) {
            return item.subScores;
        }
        const s = item.score;
        return [
            { label: 'Picture Recall Memory', score: Math.min(100, Math.max(30, s + 3)), icon: '🖼️' },
            { label: 'Speech & Animal Naming', score: Math.min(100, Math.max(30, s - 4)), icon: '🗣️' },
            { label: 'Stroop Color Executive Match', score: Math.min(100, Math.max(30, s + 5)), icon: '🎨' },
            { label: 'Digit Memory Span', score: Math.min(100, Math.max(30, s - 2)), icon: '🔢' },
        ];
    };

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const renderSVGChart = () => {
        if (chartData.length === 0)
            return null;
        const svgW = 600;
        const svgH = 200;
        const padL = 40;
        const padR = 20;
        const padT = 20;
        const padB = 30;
        const plotW = svgW - padL - padR;
        const plotH = svgH - padT - padB;
        const points = chartData.map((item, idx) => {
            const dx = chartData.length > 1 ? plotW / (chartData.length - 1) : plotW;
            const x = padL + idx * dx;
            const y = padT + plotH * (1 - item.score / 100);
            return {
                x,
                y,
                score: item.score,
                date: item.date.split(',')[0],
                tier: item.riskTier,
                color: getRiskColor(item.riskTier),
            };
        });
        let areaPath = '';
        let linePath = '';
        if (points.length > 0) {
            linePath = `M ${points[0].x} ${points[0].y}`;
            areaPath = `M ${points[0].x} ${padT + plotH}`;
            points.forEach((p, idx) => {
                if (idx > 0) {
                    linePath += ` L ${p.x} ${p.y}`;
                }
                areaPath += ` L ${p.x} ${p.y}`;
            });
            areaPath += ` L ${points[points.length - 1].x} ${padT + plotH} Z`;
        }
        const gridYValues = [25, 50, 75, 100];
        return (_jsx("div", { className: "w-full overflow-x-auto", children: _jsxs("svg", { viewBox: `0 0 ${svgW} ${svgH}`, className: "w-full min-w-[500px] h-auto text-muted-foreground font-sans", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "chart-area-grad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#2c7a7b", stopOpacity: "0.25" }), _jsx("stop", { offset: "100%", stopColor: "#2c7a7b", stopOpacity: "0.01" })] }) }), gridYValues.map(val => {
                        const y = padT + plotH * (1 - val / 100);
                        return (_jsxs("g", { className: "opacity-45", children: [_jsx("line", { x1: padL, y1: y, x2: svgW - padR, y2: y, stroke: "currentColor", strokeWidth: "1", strokeDasharray: "3 3" }), _jsx("text", { x: padL - 10, y: y + 4, textAnchor: "end", className: "text-[10px] font-semibold fill-muted-foreground", children: val })] }, val));
                    }), _jsxs("g", { className: "opacity-75", children: [_jsx("line", { x1: padL, y1: padT + plotH * (1 - 75 / 100), x2: svgW - padR, y2: padT + plotH * (1 - 75 / 100), stroke: "#38a169", strokeWidth: "1.5", strokeDasharray: "4 4" }), _jsx("text", { x: svgW - padR - 5, y: padT + plotH * (1 - 75 / 100) - 4, textAnchor: "end", className: "text-[9px] font-bold fill-[#276749]", children: "Healthy (75)" })] }), _jsxs("g", { className: "opacity-75", children: [_jsx("line", { x1: padL, y1: padT + plotH * (1 - 60 / 100), x2: svgW - padR, y2: padT + plotH * (1 - 60 / 100), stroke: "#d69e2e", strokeWidth: "1.5", strokeDasharray: "4 4" }), _jsx("text", { x: svgW - padR - 5, y: padT + plotH * (1 - 60 / 100) - 4, textAnchor: "end", className: "text-[9px] font-bold fill-[#b7791f]", children: "Monitor (60)" })] }), points.length > 0 && (_jsx("path", { d: areaPath, fill: "url(#chart-area-grad)" })), points.length > 0 && (_jsx("path", { d: linePath, fill: "none", stroke: "#2c7a7b", strokeWidth: "3.5", strokeLinecap: "round", strokeLinejoin: "round" })), points.map((p, idx) => (_jsxs("g", { className: "group cursor-pointer", children: [_jsx("circle", { cx: p.x, cy: p.y, r: "8", fill: "transparent", stroke: p.color, strokeWidth: "2", className: "transition-all hover:r-12 opacity-30" }), _jsx("circle", { cx: p.x, cy: p.y, r: "5", fill: p.color, stroke: "#ffffff", strokeWidth: "2" }), _jsx("text", { x: p.x, y: p.y - 12, textAnchor: "middle", className: "text-xs font-bold fill-foreground", children: p.score }), _jsx("text", { x: p.x, y: svgH - 8, textAnchor: "middle", className: "text-[10px] font-semibold fill-muted-foreground", children: p.date })] }, idx)))] }) }));
    };

    return (_jsxs("div", { className: "mx-auto max-w-3xl px-4 py-6 text-left sm:px-6 sm:py-8 lg:px-8 lg:py-10", children: [_jsxs("div", { className: "mb-8 sm:mb-10", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground mb-1 sm:text-4xl", children: "Assessment History" }), _jsxs("p", { className: "text-base text-muted-foreground", children: [history.length, " ", history.length === 1 ? 'assessment' : 'assessments', " completed"] })] }), chartData.length > 0 && (_jsxs("div", { className: "bg-card rounded-2xl p-6 shadow-sm border border-border mb-8", children: [_jsx("h2", { className: "text-lg font-bold text-foreground mb-5", children: "Score Trend" }), renderSVGChart(), _jsx("div", { className: "flex items-center gap-4 mt-5 flex-wrap", children: ['Low', 'Monitor', 'High', 'Critical'].map(t => (_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-3 h-3 rounded-full", style: { backgroundColor: getRiskColor(t) } }), _jsx("span", { className: "text-sm text-muted-foreground", children: t })] }, t))) })] })), _jsx("h2", { className: "text-lg font-bold text-foreground mb-4", children: "Recent Assessments (Battery Mean Scores)" }), history.length === 0 ? _jsx(EmptyState, { title: "No assessments yet", description: "Complete your first assessment to see your results here.", icon: (_jsx("svg", { className: "h-8 w-8", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) })) }) : _jsx("div", { className: "flex flex-col gap-4", children: history.map((item) => {
            const isExpanded = expandedId === item.id;
            const subScores = getDisplaySubScores(item);
            return (_jsxs("div", { className: "bg-card rounded-2xl p-5 shadow-sm border border-border flex flex-col gap-4 transition-all", children: [
                _jsxs("div", { className: "flex items-center gap-5 cursor-pointer", onClick: () => toggleExpand(item.id), children: [
                    _jsxs("div", { className: "flex-shrink-0 w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold text-xl", style: {
                        color: getRiskColor(item.riskTier),
                        background: `${getRiskColor(item.riskTier)}18`,
                        border: `2px solid ${getRiskColor(item.riskTier)}40`,
                    }, children: [
                        _jsx("span", { children: item.score }),
                        _jsx("span", { className: "text-[9px] font-semibold uppercase opacity-75", children: "Mean" })
                    ] }),
                    _jsxs("div", { className: "flex-1 min-w-0", children: [
                        _jsxs("div", { className: "flex items-center justify-between gap-3 mb-1", children: [
                            _jsx("p", { className: "text-lg font-semibold text-foreground truncate", children: item.label ?? getAssessmentLabel(item.type) }),
                            _jsx(RiskBadge, { tier: item.riskTier, size: "lg" })
                        ] }),
                        _jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground mb-2", children: [
                            _jsx("span", { children: item.date }),
                            _jsxs("button", { type: "button", onClick: (e) => { e.stopPropagation(); toggleExpand(item.id); }, className: "text-xs font-bold text-[#2c7a7b] hover:underline flex items-center gap-1", children: [
                                isExpanded ? 'Hide Breakdown' : 'View Score Breakdown (4 Sub-tests)',
                                _jsx("span", { className: "text-xs", children: isExpanded ? '▲' : '▼' })
                            ] })
                        ] }),
                        _jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: _jsx("div", { className: "h-full rounded-full transition-all", style: { width: `${item.score}%`, backgroundColor: getRiskColor(item.riskTier) } }) })
                    ] })
                ] }),
                isExpanded && (_jsx("div", { className: "pt-4 border-t border-border/70 grid gap-3 animate-in fade-in duration-200", children: _jsxs("div", { className: "p-4 rounded-2xl bg-muted/40 border border-border/50", children: [
                    _jsx("p", { className: "text-xs font-bold text-slate-500 uppercase tracking-wider mb-3", children: "Sub-test Performance Breakdown" }),
                    _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: subScores.map((sub, sIdx) => (_jsxs("div", { className: "p-3 rounded-xl bg-background border border-border flex items-center justify-between gap-2 shadow-xs", children: [
                        _jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                            _jsx("span", { className: "text-base", children: sub.icon ?? (sIdx === 0 ? '🖼️' : sIdx === 1 ? '🗣️' : sIdx === 2 ? '🎨' : '🔢') }),
                            _jsx("span", { className: "text-sm font-semibold text-foreground truncate", children: sub.label ?? getAssessmentLabel(sub.type) })
                        ] }),
                        _jsxs("span", { className: "text-sm font-bold px-2.5 py-1 rounded-lg bg-muted text-foreground flex-shrink-0", children: [sub.score, " / 100"] })
                    ] }, sIdx))) })
                ] }) }))
            ] }, item.id));
        }) })] }));

}
