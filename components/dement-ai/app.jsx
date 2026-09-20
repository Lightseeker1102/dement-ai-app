'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import BottomNav from './components/bottom-nav';
import AdminBottomNav from './components/admin-bottom-nav';
import DoctorBottomNav from './components/doctor-bottom-nav';
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
import AdminHospitals from './screens/admin/hospitals';
import AdminDoctors from './screens/admin/doctors';
import DoctorDashboard from './screens/doctor/dashboard';
import DoctorPatients from './screens/doctor/patients';
import DoctorPatientDetail from './screens/doctor/patient-detail';

import PictureRecallScreen from './screens/assessments/picture-recall';
import AnimalNamingScreen from './screens/assessments/animal-naming';
import StructuredSpeechScreen from './screens/assessments/structured-speech';
import StroopTestScreen from './screens/assessments/stroop-test';
import DigitSpanScreen from './screens/assessments/digit-span';
import RecordingScreen from './screens/assessments/recording';
import AssessmentCompleteScreen from './screens/assessments/assessment-complete';

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

const doctorNavItems = [
    {
        screen: 'doctor-dashboard',
        label: 'Overview',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 1.8, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }) })),
    },
    {
        screen: 'doctor-patients',
        label: 'Patients',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 1.8, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) })),
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
        screen: 'admin-doctors',
        label: 'Doctors',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 1.8, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) })),
    },
    {
        screen: 'admin-hospitals',
        label: 'Hospitals',
        icon: (active) => (_jsx("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: active ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: active ? 0 : 1.8, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) })),
    },
];

function Sidebar({ onRequestLogout }) {
    const { currentUser, currentScreen, navigate } = useApp();
    if (!currentUser)
        return null;

    const navItems = currentUser.role === 'admin'
        ? adminNavItems
        : (currentUser.role === 'doctor' ? doctorNavItems : userNavItems);

    const initials = currentUser.username.slice(0, 2).toUpperCase();
    const isAssessmentScreen = currentScreen.startsWith('assessment-') || currentScreen === 'user-assessments';

    return (_jsxs("aside", { className: "hidden lg:flex flex-shrink-0 w-64 flex-col h-screen sticky top-0", style: { background: 'linear-gradient(180deg, #1a365d 0%, #2c5282 100%)' }, children: [_jsx("div", { className: "px-6 pt-8 pb-6 border-b border-white/10", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", style: { background: '#2c7a7b' }, children: _jsx("svg", { className: "w-7 h-7 text-white", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white font-bold text-xl leading-none", children: "Dement(AI)" }), _jsx("p", { className: "text-sm mt-1 capitalize", style: { color: 'rgba(255,255,255,0.85)' }, children: currentUser.role === 'admin' ? 'Admin Portal' : (currentUser.role === 'doctor' ? 'Doctor Portal' : 'Cognitive Health') })] })] }) }), _jsx("nav", { className: "flex-1 px-4 py-6 flex flex-col gap-1", role: "navigation", "aria-label": "Main navigation", children: navItems.map(item => {
                    const active = !isAssessmentScreen && currentScreen === item.screen;
                    return (_jsxs("button", { onClick: () => navigate(item.screen), className: "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all", style: {
                            background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                            color: active ? '#ffffff' : 'rgba(255,255,255,0.65)',
                        }, "aria-current": active ? 'page' : undefined, children: [item.icon(active), _jsx("span", { className: "text-base font-semibold", children: item.label })] }, item.screen));
                }) }), _jsx("div", { className: "px-4 pb-6 border-t border-white/10 pt-4", children: _jsxs("div", { className: "flex items-center gap-3 px-3 py-3 rounded-xl", style: { background: 'rgba(255,255,255,0.08)' }, children: [_jsx("div", { className: "w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0", style: { background: '#ed8936' }, children: initials }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-base font-semibold text-white truncate", children: currentUser.fullName || currentUser.username }), _jsx("p", { className: "text-sm capitalize", style: { color: 'rgba(255,255,255,0.8)' }, children: currentUser.role })] }), _jsx("button", { onClick: onRequestLogout, className: "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10", style: { color: 'rgba(255,255,255,0.85)' }, "aria-label": "Sign out", title: "Sign out", children: _jsx("svg", { className: "w-6 h-6", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z", clipRule: "evenodd" }) }) })] }) })] }));
}

function ShellHeader({ onRequestLogout }) {
    const { currentScreen, currentUser } = useApp();
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    return (_jsxs(_Fragment, { children: [
            _jsx("header", { className: "sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/95 px-6 py-4 backdrop-blur lg:px-8", children: _jsxs("div", { className: "flex w-full items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: getScreenTitle(currentScreen) })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => setIsHelpOpen(true), className: "rounded-xl bg-muted px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80 transition-colors", children: "Help" }), _jsx("button", { onClick: onRequestLogout, className: "lg:hidden rounded-xl bg-muted px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80 transition-colors", children: "Sign out" })] })] }) }),
            isHelpOpen && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200", children: _jsxs("div", { className: "bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto m-4 animate-in zoom-in-95 duration-200 text-left", children: [
                _jsxs("div", { className: "flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 sticky top-0 bg-white z-10", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-slate-800 tracking-tight", children: "How to Use" }), _jsxs("p", { className: "text-sm font-semibold text-[#2c7a7b] mt-0.5", children: ["Step-by-step guide for ", getScreenTitle(currentScreen)] })] }), _jsx("button", { onClick: () => setIsHelpOpen(false), className: "w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors", children: "✕" })] }),
                _jsx("div", { className: "p-6 flex flex-col gap-4", children: _jsxs("p", { className: "text-base text-slate-600 font-medium", children: [getScreenHelp(currentScreen)] }) }),
                _jsx("div", { className: "px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end sticky bottom-0 bg-white z-10", children: _jsx("button", { onClick: () => setIsHelpOpen(false), className: "px-8 py-3.5 rounded-2xl font-bold text-lg text-white bg-[linear-gradient(135deg,#2c7a7b,#1a5e5e)] hover:shadow-lg transition-all active:scale-[0.98]", children: "Got it, Thank You!" }) })
            ] }) }))
        ] }));
}

function AppRouter() {
    const { currentScreen, currentUser, logout, toasts, dismissToast, navigate } = useApp();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
            case 'admin-doctors': return _jsx(AdminDoctors, {});
            case 'admin-hospitals': return _jsx(AdminHospitals, {});

            case 'doctor-dashboard': return _jsx(DoctorDashboard, {});
            case 'doctor-patients': return _jsx(DoctorPatients, {});
            case 'doctor-patient-detail': return _jsx(DoctorPatientDetail, {});

            case 'assessment-picture-recall': return _jsx(PictureRecallScreen, {});
            case 'assessment-animal-naming': return _jsx(AnimalNamingScreen, {});
            case 'assessment-structured-speech': return _jsx(StructuredSpeechScreen, {});
            case 'assessment-stroop-test': return _jsx(StroopTestScreen, {});
            case 'assessment-digit-span': return _jsx(DigitSpanScreen, {});
            case 'assessment-recording': return _jsx(RecordingScreen, {});
            case 'assessment-complete': return _jsx(AssessmentCompleteScreen, {});
            default:
                if (currentUser.role === 'admin') return _jsx(AdminDashboard, {});
                if (currentUser.role === 'doctor') return _jsx(DoctorDashboard, {});
                return _jsx(UserDashboard, {});
        }
    };

    return (_jsxs("div", { className: "flex min-h-screen flex-col lg:flex-row", children: [
        _jsx(Sidebar, { onRequestLogout: () => setShowLogoutConfirm(true) }),
        _jsxs("div", { className: "flex min-h-screen flex-1 flex-col", children: [
            _jsx(ShellHeader, { onRequestLogout: () => setShowLogoutConfirm(true) }),
            _jsx("main", { className: "flex-1 overflow-y-auto bg-background pb-24 lg:pb-0", children: renderMain() })
        ] }),
        _jsx("div", { className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur lg:hidden", children:
            currentUser.role === 'admin' ? _jsx(AdminBottomNav, {}) : (currentUser.role === 'doctor' ? _jsx(DoctorBottomNav, {}) : _jsx(BottomNav, {}))
        }),
        _jsx(ToastContainer, { toasts: toasts, onDismiss: dismissToast }),

        showLogoutConfirm && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left", children: _jsxs("div", { className: "bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-200", children: [
            _jsx("div", { className: "w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm", children: _jsx("svg", { className: "w-8 h-8", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }) }),
            _jsx("h2", { className: "text-2xl font-bold text-slate-800 mb-2 tracking-tight", children: "Are you sure you want to sign out?" }),
            _jsx("p", { className: "text-base font-medium text-slate-600 mb-8 leading-relaxed", children: "You will need to enter your username and password to log back into Dement(AI)." }),
            _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
                _jsx("button", { onClick: () => setShowLogoutConfirm(false), className: "flex-1 py-4 px-6 rounded-2xl font-bold text-lg text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]", style: { background: 'linear-gradient(135deg, #38a169, #276749)' }, children: "No, Stay Signed In" }),
                _jsx("button", { onClick: () => { setShowLogoutConfirm(false); logout(); }, className: "py-4 px-6 rounded-2xl font-bold text-base text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all active:scale-[0.98]", children: "Yes, Sign Out" })
            ] })
        ] }) }))
    ] }));
}

export default function DementAIApp() {
    return (_jsx(AppProvider, { children: _jsx(AppRouter, {}) }));
}
