'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import BottomNav from './components/bottom-nav';
import AdminBottomNav from './components/admin-bottom-nav';
import { AppProvider, getScreenHelp, getScreenTitle, useApp } from './context';
import ToastContainer from './components/toast';
import SplashScreen from './screens/splash-screen';
import LandingScreen from './screens/landing-screen';
import LoginScreen from './screens/login-screen';
import CreateAccountScreen from './screens/create-account-screen';
import UserDashboard from './screens/user/dashboard';
import UserHistory from './screens/user/history';
import UserProfile from './screens/user/profile';
import UserAssessments from './screens/user/assessments';
import AdminDashboard from './screens/admin/dashboard';
import AdminUsers from './screens/admin/users';
import AdminReports from './screens/admin/reports';
import PictureRecallScreen from './screens/assessments/picture-recall';
import AnimalNamingScreen from './screens/assessments/animal-naming';
import StructuredSpeechScreen from './screens/assessments/structured-speech';
import RecordingScreen from './screens/assessments/recording';
import AssessmentCompleteScreen from './screens/assessments/assessment-complete';
// ─── Sidebar nav items ─────────────────────────────────────────────────────────
const userNavItems = [
    {
        screen: 'user-dashboard',
        label: 'Home',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 1.8, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }) })),
    },
    {
        screen: 'user-history',
        label: 'My History',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 1.8, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) })),
    },
    {
        screen: 'user-profile',
        label: 'My Profile',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 1.8, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) })),
    },
];
const adminNavItems = [
    {
        screen: 'admin-dashboard',
        label: 'Overview',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 1.8, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }) })),
    },
    {
        screen: 'admin-users',
        label: 'Patients',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 1.8, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) })),
    },
    {
        screen: 'admin-reports',
        label: 'Reports',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 1.8, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) })),
    },
];
// ─── Sidebar component ─────────────────────────────────────────────────────────
function Sidebar() {
    const { currentUser, currentScreen, navigate, logout } = useApp();
    if (!currentUser)
        return null;
    const navItems = currentUser.role === 'admin' ? adminNavItems : userNavItems;
    const initials = currentUser.username.slice(0, 2).toUpperCase();
    // Assessment screens should highlight nothing (hidden page)
    const isAssessmentScreen = currentScreen.startsWith('assessment-') || currentScreen === 'user-assessments';
    return (_jsxs("aside", { className: "hidden lg:flex flex-shrink-0 w-64 flex-col h-screen sticky top-0", style: { background: 'linear-gradient(180deg, #1a365d 0%, #2c5282 100%)' }, children: [_jsx("div", { className: "px-6 pt-8 pb-6 border-b border-white/10", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", style: { background: '#2c7a7b' }, children: _jsx("svg", { className: "w-6 h-6 text-white", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white font-bold text-lg leading-none", children: "Dement(AI)" }), _jsx("p", { className: "text-xs mt-0.5", style: { color: 'rgba(255,255,255,0.55)' }, children: currentUser.role === 'admin' ? 'Admin Panel' : 'Cognitive Health' })] })] }) }), _jsx("nav", { className: "flex-1 px-4 py-6 flex flex-col gap-1", role: "navigation", "aria-label": "Main navigation", children: navItems.map(item => {
                    const active = !isAssessmentScreen && currentScreen === item.screen;
                    return (_jsxs("button", { onClick: () => navigate(item.screen), className: "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all", style: {
                            background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                            color: active ? '#ffffff' : 'rgba(255,255,255,0.65)',
                        }, "aria-current": active ? 'page' : undefined, children: [item.icon(active), _jsx("span", { className: "text-base font-semibold", children: item.label })] }, item.screen));
                }) }), _jsx("div", { className: "px-4 pb-6 border-t border-white/10 pt-4", children: _jsxs("div", { className: "flex items-center gap-3 px-3 py-3 rounded-xl", style: { background: 'rgba(255,255,255,0.08)' }, children: [_jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0", style: { background: '#ed8936' }, children: initials }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-white truncate", children: currentUser.username }), _jsx("p", { className: "text-xs capitalize", style: { color: 'rgba(255,255,255,0.55)' }, children: currentUser.role })] }), _jsx("button", { onClick: logout, className: "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors", style: { color: 'rgba(255,255,255,0.55)' }, "aria-label": "Sign out", title: "Sign out", children: _jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z", clipRule: "evenodd" }) }) })] }) })] }));
}
function ShellHeader() {
    const { currentUser, currentScreen, logout } = useApp();
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    if (!currentUser)
        return null;
    return (_jsxs(_Fragment, { children: [
        _jsx("header", { className: "sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80", children: _jsxs("div", { className: "flex w-full items-center justify-between gap-4 px-4 py-3 text-left sm:px-6 lg:px-8", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground", children: currentUser.role === 'admin' ? 'Admin workspace' : 'Patient workspace' }), _jsx("h1", { className: "truncate text-lg font-semibold text-foreground", children: getScreenTitle(currentScreen) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => setIsHelpOpen(true), className: "rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted", children: "How to Use?" }), _jsx("button", { onClick: logout, className: "lg:hidden rounded-full bg-muted px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted/80", children: "Sign out" })] })] }) }),
        
        isHelpOpen && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-200", children: _jsxs("div", { className: "bg-card rounded-3xl border border-border shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto m-4 animate-in zoom-in duration-200 text-left", children: [
            _jsxs("div", { className: "flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100", children: [
                _jsxs("div", { children: [
                    _jsx("h2", { className: "text-xl font-bold text-foreground", children: "How to Use" }),
                    _jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: ["Instructions for ", getScreenTitle(currentScreen)] })
                ] }),
                _jsx("button", { onClick: () => setIsHelpOpen(false), className: "w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/70 transition-colors", children: _jsx("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) }) })
            ] }),
            
            _jsx("div", { className: "p-6", children: 
                /* ======================================================== */
                /* DEVELOPER CUSTOM CONTENT START - EDIT THIS BLOCK FREELY  */
                /* ======================================================== */
                _jsxs("div", { className: "rounded-2xl border-2 border-dashed border-[#2c7a7b]/20 bg-[#2c7a7b]/5 p-6 min-h-[180px] flex flex-col items-center justify-center text-center", children: [
                    _jsx("svg", { className: "w-10 h-10 text-[#2c7a7b] mb-3 opacity-60", fill: "none", stroke: "currentColor", strokeWidth: "1.5", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" }) }),
                    _jsx("p", { className: "text-base font-bold text-foreground mb-1", children: "Custom Guide Space" }),
                    _jsxs("p", { className: "text-xs text-muted-foreground max-w-xs leading-relaxed mb-4", children: [
                        "Hey so do these assessments for like two months and then youll get  your results okay? start by clicking the start assessment button ",
                        _jsx("code", { className: "bg-slate-200/50 px-1 py-0.5 rounded text-[11px] font-mono", children: "app.jsx" }),
                        " under this commented container block."
                    ] })
                    /* Developer: Add your list items, text, screenshots, or checklists here! */
                ] })
                /* ======================================================== */
                /* DEVELOPER CUSTOM CONTENT END                             */
                /* ======================================================== */
            }),
            
            _jsx("div", { className: "px-6 py-4 bg-muted/30 border-t border-slate-100 flex justify-end", children: _jsx("button", { onClick: () => setIsHelpOpen(false), className: "px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-[linear-gradient(135deg,#2c7a7b,#1a5e5e)] transition-all active:scale-[0.98]", children: "Got it" }) })
        ] }) }))
    ] }));
}
// ─── Main layout ───────────────────────────────────────────────────────────────
function AppRouter() {
    const { currentScreen, currentUser, toasts, dismissToast, navigate } = useApp();
    // Splash & login: full-screen, no sidebar
    if (currentScreen === 'splash')
        return (_jsxs(_Fragment, { children: [_jsx(SplashScreen, {}), _jsx(ToastContainer, { toasts: toasts, onDismiss: dismissToast })] }));
    if (currentScreen === 'landing')
        return (_jsxs(_Fragment, { children: [_jsx(LandingScreen, { onStart: () => navigate('login') }), _jsx(ToastContainer, { toasts: toasts, onDismiss: dismissToast })] }));
    if (currentScreen === 'register')
        return (_jsxs(_Fragment, { children: [_jsx(CreateAccountScreen, {}), _jsx(ToastContainer, { toasts: toasts, onDismiss: dismissToast })] }));
    if (currentScreen === 'login' || !currentUser)
        return (_jsxs(_Fragment, { children: [_jsx(LoginScreen, {}), _jsx(ToastContainer, { toasts: toasts, onDismiss: dismissToast })] }));
    const renderMain = () => {
        switch (currentScreen) {
            case 'user-dashboard': return _jsx(UserDashboard, {});
            case 'user-history': return _jsx(UserHistory, {});
            case 'user-profile': return _jsx(UserProfile, {});
            case 'user-assessments': return _jsx(UserAssessments, {});
            case 'admin-dashboard': return _jsx(AdminDashboard, {});
            case 'admin-users': return _jsx(AdminUsers, {});
            case 'admin-reports': return _jsx(AdminReports, {});
            case 'assessment-picture-recall': return _jsx(PictureRecallScreen, {});
            case 'assessment-animal-naming': return _jsx(AnimalNamingScreen, {});
            case 'assessment-structured-speech': return _jsx(StructuredSpeechScreen, {});
            case 'assessment-recording': return _jsx(RecordingScreen, {});
            case 'assessment-complete': return _jsx(AssessmentCompleteScreen, {});
            default: return _jsx(UserDashboard, {});
        }
    };
    return (_jsxs("div", { className: "flex min-h-screen flex-col lg:flex-row", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex min-h-screen flex-1 flex-col", children: [_jsx(ShellHeader, {}), _jsx("main", { className: "flex-1 overflow-y-auto bg-background pb-24 lg:pb-0", children: renderMain() })] }), _jsx("div", { className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur lg:hidden", children: currentUser.role === 'admin' ? _jsx(AdminBottomNav, {}) : _jsx(BottomNav, {}) }), _jsx(ToastContainer, { toasts: toasts, onDismiss: dismissToast })] }));
}
export default function DementAIApp() {
    return (_jsx(AppProvider, { children: _jsx(AppRouter, {}) }));
}
