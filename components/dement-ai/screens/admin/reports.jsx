'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useApp, getRiskColor, getAssessmentLabel } from '../../context';
import RiskBadge from '../../components/risk-badge';

function ReportModal({ patient, onClose }) {
    const { showToast } = useApp();
    const avg = patient.history.length > 0
        ? Math.round(patient.history.reduce((s, h) => s + h.score, 0) / patient.history.length)
        : 0;
    const handleDownload = () => {
        // Trigger print dialog
        window.print();
        const doctorLine = patient.assignedDoctorEmail ? ` and queued for ${patient.assignedDoctorName ?? 'the assigned doctor'}` : '';
        showToast(`PDF report generated for ${patient.name}${doctorLine}`, 'success');
        onClose();
    };
    return (_jsxs(_Fragment, { children: [
        _jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center print:hidden", style: { background: 'rgba(0,0,0,0.5)' }, children: _jsxs("div", { className: "bg-card rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto m-4", children: [_jsxs("div", { className: "flex items-center justify-between px-6 pt-6 pb-4 border-b border-border", children: [_jsx("h2", { className: "text-xl font-bold text-foreground", children: "Patient Report" }), _jsx("button", { onClick: onClose, className: "w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/70 transition-colors", children: _jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) }) })] }), _jsxs("div", { className: "px-6 py-6", children: [_jsxs("div", { className: "rounded-2xl p-5 mb-5 border", style: { background: 'linear-gradient(135deg, #1a365d08, #2c7a7b08)', borderColor: '#2c7a7b25' }, children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("div", { className: "w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0", style: { background: getRiskColor(patient.riskTier) }, children: patient.name.split(' ').map(n => n[0]).join('') }), _jsxs("div", { children: [_jsx("p", { className: "text-lg font-bold text-foreground", children: patient.name }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Age ", patient.age] })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3 text-left", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Risk Tier" }), _jsx(RiskBadge, { tier: patient.riskTier })] }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold", style: { color: getRiskColor(patient.riskTier) }, children: avg }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Avg Score" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: patient.totalAssessments }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Tests Done" })] })] })] }), _jsxs("div", { className: "mb-5 rounded-2xl border border-border bg-muted/30 p-4", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: "Doctor delivery" }), _jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: patient.assignedDoctorName
                                                ? `Weekly PDFs will be sent to ${patient.assignedDoctorName}${patient.assignedDoctorEmail ? ` (${patient.assignedDoctorEmail})` : ''}.`
                                                : 'Assign a doctor in the Patients screen to enable weekly report delivery.' }), _jsx("button", { type: "button", onClick: () => {
                                                if (!patient.assignedDoctorName && !patient.assignedDoctorEmail) {
                                                    showToast('Assign a doctor before queueing weekly delivery.', 'error');
                                                    return;
                                                }
                                                showToast(`Weekly report PDF prepared for ${patient.assignedDoctorName ?? 'the assigned doctor'}.`, 'success');
                                            }, className: "mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#2c7a7b] shadow-sm transition-colors hover:bg-muted", children: "Queue weekly PDF to doctor" })] }), _jsx("h3", { className: "text-base font-bold text-foreground mb-3", children: "Assessment Breakdown" }), _jsx("div", { className: "flex flex-col gap-3 mb-5", children: patient.history.slice(0, 4).map(item => (_jsxs("div", { className: "flex items-center gap-4 py-3 border-b border-border last:border-0", children: [_jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0", style: { color: getRiskColor(item.riskTier), background: `${getRiskColor(item.riskTier)}18` }, children: item.score }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-base font-medium text-foreground", children: getAssessmentLabel(item.type) }), _jsx("p", { className: "text-sm text-muted-foreground", children: item.date })] }), _jsx(RiskBadge, { tier: item.riskTier })] }, item.id))) }), _jsxs("div", { className: "rounded-xl p-4 mb-5 border", style: { background: '#fffbf0', borderColor: '#fed7aa' }, children: [_jsx("p", { className: "text-sm font-semibold text-orange-800 mb-1", children: "Clinical Note" }), _jsx("p", { className: "text-sm text-orange-700 leading-relaxed", children: patient.riskTier === 'High' || patient.riskTier === 'Critical'
                                                ? 'Patient shows signs of cognitive decline. Recommend immediate clinical evaluation and follow-up within 2 weeks.'
                                                : patient.riskTier === 'Monitor'
                                                    ? 'Patient shows borderline cognitive performance. Continue monthly monitoring and encourage regular assessments.'
                                                    : 'Patient demonstrates healthy cognitive function. Continue routine quarterly monitoring.' })] }), _jsxs("button", { onClick: handleDownload, className: "w-full py-4 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]", style: { background: 'linear-gradient(135deg, #ed8936, #c97925)', boxShadow: '0 4px 14px rgba(237,137,54,0.35)' }, children: [_jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z", clipRule: "evenodd" }) }), "Download PDF Report"] })] })] }) }),
        
        /* Print layout only visible in window.print() */
        _jsxs("div", { className: "printable-report hidden print:block text-left font-serif p-8 bg-white text-black leading-relaxed", style: { fontFamily: 'Georgia, serif' }, children: [
            _jsxs("div", { className: "text-center mb-8 border-b-2 border-black pb-4", children: [
                _jsx("h1", { className: "text-3xl font-extrabold tracking-wide uppercase text-slate-800", children: "DementAI Cognitive Assessment Report" }),
                _jsx("p", { className: "text-sm mt-1 text-slate-600 font-sans", children: "Automated Voice Biometric Analysis Diagnostic Summary" }),
                _jsxs("p", { className: "text-xs text-slate-500 mt-1 font-sans", children: ["Clinic ID: CLIN-DEMENT-00912 \u00B7 Date Generated: ", new Date().toLocaleDateString()] })
            ] }),
            
            _jsxs("div", { className: "grid grid-cols-2 gap-6 mb-8 text-sm", children: [
                _jsxs("div", { children: [
                    _jsx("h2", { className: "font-bold border-b border-black pb-1 mb-2 uppercase text-xs tracking-wider font-sans", children: "Patient Information" }),
                    _jsxs("p", { children: [_jsx("strong", { children: "Name:" }), " ", patient.name] }),
                    _jsxs("p", { children: [_jsx("strong", { children: "Age:" }), " ", patient.age, " years old"] }),
                    _jsxs("p", { children: [_jsx("strong", { children: "Database ID:" }), " PAT-", patient.id, "-", patient.age] })
                ] }),
                _jsxs("div", { children: [
                    _jsx("h2", { className: "font-bold border-b border-black pb-1 mb-2 uppercase text-xs tracking-wider font-sans", children: "Clinical Oversight" }),
                    _jsxs("p", { children: [_jsx("strong", { children: "Primary Clinician:" }), " Dr. ", patient.assignedDoctorName ?? 'Not Assigned'] }),
                    _jsxs("p", { children: [_jsx("strong", { children: "Clinician Email:" }), " ", patient.assignedDoctorEmail ?? 'N/A'] }),
                    _jsxs("p", { children: [_jsx("strong", { children: "Monitoring Status:" }), " ", patient.riskTier, " Risk Category"] })
                ] })
            ] }),
            
            _jsxs("div", { className: "mb-8", children: [
                _jsx("h2", { className: "font-bold border-b border-black pb-1 mb-3 uppercase text-xs tracking-wider font-sans", children: "Cognitive Index Overview" }),
                _jsxs("div", { className: "flex gap-8 items-center bg-slate-50 p-4 border border-slate-200 rounded", children: [
                    _jsxs("div", { children: [
                        _jsxs("p", { className: "text-3xl font-extrabold text-slate-800", children: [avg, "/100"] }),
                        _jsx("p", { className: "text-[10px] text-slate-500 uppercase tracking-wide font-sans font-bold", children: "Mean Assessment Score" })
                    ] }),
                    _jsxs("div", { children: [
                        _jsx("p", { className: "text-3xl font-extrabold text-slate-800", children: patient.totalAssessments }),
                        _jsx("p", { className: "text-[10px] text-slate-500 uppercase tracking-wide font-sans font-bold", children: "Total Screening Intervals" })
                    ] }),
                    _jsxs("div", { children: [
                        _jsx("p", { className: "text-lg font-bold text-slate-700", children: patient.riskTier }),
                        _jsx("p", { className: "text-[10px] text-slate-500 uppercase tracking-wide font-sans font-bold", children: "Calculated Risk Classification" })
                    ] })
                ] })
            ] }),
            
            _jsxs("div", { className: "mb-8", children: [
                _jsx("h2", { className: "font-bold border-b border-black pb-1 mb-3 uppercase text-xs tracking-wider font-sans", children: "Historical Assessment Breakdown" }),
                _jsxs("table", { className: "w-full text-left text-sm border-collapse", children: [
                    _jsx("thead", { children: _jsxs("tr", { className: "border-b border-slate-300 bg-slate-100 text-xs uppercase tracking-wider font-bold font-sans", children: [
                            _jsx("th", { className: "py-2 px-3", children: "Test Model" }),
                            _jsx("th", { className: "py-2 px-3", children: "Date Completed" }),
                            _jsx("th", { className: "py-2 px-3", children: "Raw Cognitive Score" }),
                            _jsx("th", { className: "py-2 px-3", children: "Calculated Tier" })
                        ] }) }),
                    _jsx("tbody", { children: patient.history.map(item => (_jsxs("tr", { className: "border-b border-slate-200", children: [
                            _jsx("td", { className: "py-2 px-3 font-semibold", children: getAssessmentLabel(item.type) }),
                            _jsx("td", { className: "py-2 px-3", children: item.date }),
                            _jsxs("td", { className: "py-2 px-3 font-bold", children: [item.score, "/100"] }),
                            _jsx("td", { className: "py-2 px-3", children: item.riskTier })
                        ] }, item.id))) })
                ] })
            ] }),
            
            _jsxs("div", { className: "mb-10 p-4 border border-slate-300 bg-slate-50 rounded text-sm", children: [
                _jsx("h2", { className: "font-bold text-xs uppercase tracking-wider text-slate-700 mb-1 font-sans", children: "Clinical Evaluation Summary" }),
                _jsx("p", { className: "leading-relaxed italic text-slate-800", children: patient.riskTier === 'High' || patient.riskTier === 'Critical'
                        ? 'Biometric speech analysis suggests indicators consistent with significant cognitive impairment or early-stage decline. Pauses, syntax complexity variances, and keyword recall failures indicate a clinical recommendation for comprehensive formal diagnostic evaluation and neurological consultation.'
                        : patient.riskTier === 'Monitor'
                            ? 'Patient performs within borderline margins. Minor cognitive variances are present in verbal fluency and recall accuracy metrics. Recommended action: maintain active monthly screening assessments, encourage memory exercises, and monitor progression patterns.'
                            : 'Acoustic and semantic parameters demonstrate stable and healthy cognitive functioning. Lexical recall and narrative structure scores are consistent with baseline expectations. Standard annual or quarterly screening is recommended.' })
            ] }),
            
            _jsxs("div", { className: "grid grid-cols-2 gap-10 mt-16 pt-8 border-t border-slate-300 text-sm", children: [
                _jsxs("div", { children: [
                    _jsx("p", { className: "mb-8", children: "Oversight Doctor Signature: ________________________________" }),
                    _jsx("p", { children: "Date: ________________________" })
                ] }),
                _jsx("div", { className: "text-right", children: _jsx("p", { className: "text-xs text-slate-500 leading-normal font-sans", children: "This document is a simulated diagnostic aid generated by the DementAI screening engine based on speech and narrative recall biomarkers. It is intended for presentation and demonstration oversight." }) })
            ] })
        ] })
    ] }));
}

export default function AdminReports() {
    const { patients, showToast } = useApp();
    const [reportPatient, setReportPatient] = useState(null);
    return (_jsxs("div", { className: "mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10", children: [reportPatient && (_jsx(ReportModal, { patient: reportPatient, onClose: () => setReportPatient(null) })), _jsxs("div", { className: "mb-8 sm:mb-10", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground mb-1 sm:text-4xl", children: "Reports" }), _jsx("p", { className: "text-base text-muted-foreground", children: "Generate and download patient assessment reports" })] }), _jsx("div", { className: "flex flex-col gap-5", children: patients.map(patient => {
                    const avg = patient.history.length > 0
                        ? Math.round(patient.history.reduce((s, h) => s + h.score, 0) / patient.history.length)
                        : 0;
                    return (_jsxs("div", { className: "rounded-2xl border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(247,250,252,0.92))] p-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)]", children: [_jsxs("div", { className: "flex items-start gap-4 mb-5", children: [_jsx("div", { className: "flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-white", style: { background: getRiskColor(patient.riskTier) }, children: patient.name.split(' ').map(n => n[0]).join('') }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 mb-1", children: [_jsx("p", { className: "text-lg font-semibold text-foreground truncate", children: patient.name }), _jsx(RiskBadge, { tier: patient.riskTier, size: "lg" })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Age ", patient.age, " \u00B7 Avg score: ", avg, " \u00B7 ", patient.totalAssessments, " tests"] }), (patient.assignedDoctorName || patient.assignedDoctorEmail) && (_jsxs("p", { className: "mt-1 text-sm font-medium", style: { color: '#2c7a7b' }, children: ["Weekly PDF target: ", patient.assignedDoctorName ?? 'doctor'] }))] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { type: "button", onClick: () => setReportPatient(patient), className: "flex-1 rounded-xl px-4 py-3.5 text-base font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]", style: { background: 'linear-gradient(135deg, #2c7a7b, #1a5e5e)' }, children: [_jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: [_jsx("path", { d: "M10 12a2 2 0 100-4 2 2 0 000 4z" }), _jsx("path", { fillRule: "evenodd", d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z", clipRule: "evenodd" })] }), "Preview Report"] }), _jsxs("button", { type: "button", onClick: () => showToast(`Report generated for ${patient.name}`, 'success'), className: "flex-1 rounded-xl px-4 py-3.5 text-base font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]", style: { background: 'linear-gradient(135deg, #ed8936, #c97925)' }, children: [_jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z", clipRule: "evenodd" }) }), "Download PDF"] })] })] }, patient.id));
                }) })] }));
}
