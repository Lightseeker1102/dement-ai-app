'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useCallback } from 'react';
const SCREEN_META = {
    splash: {
        title: 'Loading',
        help: 'The app is loading. You will be taken to the sign-in screen automatically.',
    },
    landing: {
        title: 'Welcome',
        help: 'Welcome to DementAI. Learn about our SaMD cognitive monitoring features.',
    },
    login: {
        title: 'Sign In',
        help: 'Patients can sign in with their registered username or email plus password, or admin / 1234567 for the admin demo.',
    },
    register: {
        title: 'Create Account',
        help: 'Create a patient account with your name, username, email, phone number, age, and password.',
    },
    'user-dashboard': {
        title: 'Patient Dashboard',
        help: 'Start an assessment from the dashboard, or review your history and profile from the navigation.',
    },
    'user-history': {
        title: 'Assessment History',
        help: 'This view shows recent scores and trends so you can see how performance changes over time.',
    },
    'user-profile': {
        title: 'Profile',
        help: 'Update your doctor details here so the demo feels complete and ready for review.',
    },
    'user-assessments': {
        title: 'Assessment Library',
        help: 'Choose a task to begin. Each assessment flows into the shared recording screen.',
    },
    'admin-dashboard': {
        title: 'Admin Dashboard',
        help: 'Use the overview to monitor patient risk and jump into patient or report management.',
    },
    'admin-users': {
        title: 'Patients',
        help: 'Search the patient list, preview details, and generate reports from a single place.',
    },
    'admin-reports': {
        title: 'Reports',
        help: 'Preview and download reports for each patient while checking the summary note.',
    },
    'assessment-picture-recall': {
        title: 'Picture Recall',
        help: 'Observe the scene carefully, then continue to the microphone screen when you are ready.',
    },
    'assessment-animal-naming': {
        title: 'Animal Naming',
        help: 'Name as many animals as possible within the time limit once recording begins.',
    },
    'assessment-structured-speech': {
        title: 'Structured Speech',
        help: 'Speak on the prompted topic and save when you finish the response.',
    },
    'assessment-recording': {
        title: 'Recording',
        help: 'Use the microphone control to start and stop recording before saving your result.',
    },
    'assessment-complete': {
        title: 'Assessment Complete',
        help: 'Your three-step assessment sequence is complete and the app is returning to the home screen.',
    },
};
export function getScreenTitle(screen) {
    return SCREEN_META[screen].title;
}
export function getScreenHelp(screen) {
    return SCREEN_META[screen].help;
}
// ─── Mock Data ────────────────────────────────────────────────────────────────
const today = new Date();
const daysAgo = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
export const MOCK_PATIENTS = [
    {
        id: '1',
        name: 'John Doe',
        age: 72,
        riskTier: 'High',
        lastAssessmentDate: daysAgo(2),
        totalAssessments: 8,
        assignedDoctorName: 'Dr. Amira Patel',
        assignedDoctorEmail: 'amira.patel@clinic.example',
        history: [
            { id: 'h1', type: 'animal-naming', date: daysAgo(2), score: 42, riskTier: 'High', durationSeconds: 60 },
            { id: 'h2', type: 'picture-recall', date: daysAgo(9), score: 38, riskTier: 'High', durationSeconds: 55 },
            { id: 'h3', type: 'structured-speech', date: daysAgo(16), score: 45, riskTier: 'Monitor', durationSeconds: 60 },
            { id: 'h4', type: 'animal-naming', date: daysAgo(23), score: 50, riskTier: 'Monitor', durationSeconds: 60 },
            { id: 'h5', type: 'picture-recall', date: daysAgo(30), score: 55, riskTier: 'Monitor', durationSeconds: 58 },
        ],
    },
    {
        id: '2',
        name: 'Sarah Smith',
        age: 68,
        riskTier: 'Monitor',
        lastAssessmentDate: daysAgo(5),
        totalAssessments: 5,
        assignedDoctorName: 'Dr. Daniel Kim',
        assignedDoctorEmail: 'daniel.kim@clinic.example',
        history: [
            { id: 'h6', type: 'structured-speech', date: daysAgo(5), score: 62, riskTier: 'Monitor', durationSeconds: 60 },
            { id: 'h7', type: 'animal-naming', date: daysAgo(12), score: 65, riskTier: 'Monitor', durationSeconds: 60 },
            { id: 'h8', type: 'picture-recall', date: daysAgo(19), score: 70, riskTier: 'Low', durationSeconds: 60 },
        ],
    },
    {
        id: '3',
        name: 'Robert Chen',
        age: 75,
        riskTier: 'Low',
        lastAssessmentDate: daysAgo(1),
        totalAssessments: 12,
        assignedDoctorName: 'Dr. Amira Patel',
        assignedDoctorEmail: 'amira.patel@clinic.example',
        history: [
            { id: 'h9', type: 'animal-naming', date: daysAgo(1), score: 82, riskTier: 'Low', durationSeconds: 60 },
            { id: 'h10', type: 'picture-recall', date: daysAgo(8), score: 79, riskTier: 'Low', durationSeconds: 60 },
            { id: 'h11', type: 'structured-speech', date: daysAgo(15), score: 80, riskTier: 'Low', durationSeconds: 60 },
        ],
    },
    {
        id: '4',
        name: 'Maria Garcia',
        age: 70,
        riskTier: 'Monitor',
        lastAssessmentDate: daysAgo(3),
        totalAssessments: 6,
        assignedDoctorName: 'Dr. Laila Morgan',
        assignedDoctorEmail: 'laila.morgan@clinic.example',
        history: [
            { id: 'h12', type: 'picture-recall', date: daysAgo(3), score: 58, riskTier: 'Monitor', durationSeconds: 52 },
            { id: 'h13', type: 'animal-naming', date: daysAgo(10), score: 61, riskTier: 'Monitor', durationSeconds: 60 },
            { id: 'h14', type: 'structured-speech', date: daysAgo(17), score: 66, riskTier: 'Monitor', durationSeconds: 60 },
        ],
    },
    {
        id: '5',
        name: 'James Wilson',
        age: 78,
        riskTier: 'High',
        lastAssessmentDate: daysAgo(7),
        totalAssessments: 10,
        assignedDoctorName: 'Dr. Daniel Kim',
        assignedDoctorEmail: 'daniel.kim@clinic.example',
        history: [
            { id: 'h15', type: 'animal-naming', date: daysAgo(7), score: 35, riskTier: 'High', durationSeconds: 60 },
            { id: 'h16', type: 'picture-recall', date: daysAgo(14), score: 40, riskTier: 'High', durationSeconds: 48 },
            { id: 'h17', type: 'structured-speech', date: daysAgo(21), score: 44, riskTier: 'High', durationSeconds: 60 },
        ],
    },
];
function buildUserHistory() {
    return [
        { id: 'u1', type: 'animal-naming', date: daysAgo(1), score: 71, riskTier: 'Monitor', durationSeconds: 60 },
        { id: 'u2', type: 'picture-recall', date: daysAgo(7), score: 68, riskTier: 'Monitor', durationSeconds: 55 },
        { id: 'u3', type: 'structured-speech', date: daysAgo(14), score: 75, riskTier: 'Low', durationSeconds: 60 },
        { id: 'u4', type: 'animal-naming', date: daysAgo(21), score: 72, riskTier: 'Monitor', durationSeconds: 60 },
        { id: 'u5', type: 'picture-recall', date: daysAgo(28), score: 65, riskTier: 'Monitor', durationSeconds: 58 },
        { id: 'u6', type: 'structured-speech', date: daysAgo(35), score: 78, riskTier: 'Low', durationSeconds: 60 },
    ];
}
const AppContext = createContext(null);
export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx)
        throw new Error('useApp must be used within AppProvider');
    return ctx;
}
// ─── Provider ────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentScreen, setCurrentScreen] = useState('splash');
    const [previousScreen, setPreviousScreen] = useState(null);
    const DEFAULT_PATIENT_ACCOUNT = {
        id: 'user-1',
        username: 'patient1',
        password: 'patient123',
        fullName: 'Emma Johnson',
        email: 'emma.johnson@example.com',
        phone: '+91 98450 12345',
        age: 66,
        riskTier: 'Monitor',
        lastAssessmentDate: daysAgo(1),
        totalAssessments: 6,
        history: buildUserHistory(),
        doctorName: 'Dr. Laila Morgan',
        doctorEmail: 'laila.morgan@clinic.example',
    };
    const [pendingAssessmentType, setPendingAssessmentType] = useState(null);
    const [assessmentFlow, setAssessmentFlow] = useState([]);
    const [assessmentStepIndex, setAssessmentStepIndex] = useState(0);
    const [assessmentCompletionSummary, setAssessmentCompletionSummary] = useState(null);
    const [patients, setPatients] = useState(MOCK_PATIENTS);
    const [patientAccounts, setPatientAccounts] = useState([DEFAULT_PATIENT_ACCOUNT]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [toasts, setToasts] = useState([]);
    const getAssessmentSequence = useCallback((startType) => {
        const ordered = ['picture-recall', 'animal-naming', 'structured-speech'];
        const startIndex = ordered.indexOf(startType);
        if (startIndex < 0)
            return ordered;
        return [...ordered.slice(startIndex), ...ordered.slice(0, startIndex)];
    }, []);
    const navigate = useCallback((screen) => {
        setCurrentScreen(prev => {
            setPreviousScreen(prev);
            return screen;
        });
    }, []);
    const login = useCallback((username, password) => {
        if (username === 'admin' && password === '1234567') {
            setCurrentUser({
                username: 'admin',
                role: 'admin',
                riskTier: 'Low',
                lastAssessmentDate: daysAgo(0),
                totalAssessments: 0,
                history: [],
            });
            navigate('admin-dashboard');
            return true;
        }
        const normalized = username.trim().toLowerCase();
        const patient = patientAccounts.find(account => account.username.toLowerCase() === normalized || account.email.toLowerCase() === normalized);
        if (patient) {
            if (!password)
                return false;
            if (patient.password !== password)
                return false;
            setCurrentUser({
                username: patient.username,
                role: 'user',
                fullName: patient.fullName,
                email: patient.email,
                phone: patient.phone,
                age: patient.age,
                riskTier: patient.riskTier,
                lastAssessmentDate: patient.lastAssessmentDate,
                totalAssessments: patient.totalAssessments,
                history: patient.history,
                doctorName: patient.doctorName,
                doctorEmail: patient.doctorEmail,
            });
            navigate('user-dashboard');
            return true;
        }
        return false;
    }, [navigate, patientAccounts]);
    const registerPatient = useCallback((account) => {
        const normalizedUsername = account.username.trim().toLowerCase();
        const normalizedEmail = account.email.trim().toLowerCase();
        if (patientAccounts.some(existing => existing.username.toLowerCase() === normalizedUsername)) {
            return { ok: false, message: 'That username is already in use.' };
        }
        if (patientAccounts.some(existing => existing.email.toLowerCase() === normalizedEmail)) {
            return { ok: false, message: 'That email is already registered.' };
        }
        const newAccount = {
            id: `user-${Date.now()}`,
            username: account.username.trim(),
            password: account.password,
            fullName: account.fullName.trim(),
            email: account.email.trim(),
            phone: account.phone.trim(),
            age: account.age,
            riskTier: 'Monitor',
            lastAssessmentDate: daysAgo(0),
            totalAssessments: 0,
            history: [],
        };
        setPatientAccounts(prev => [newAccount, ...prev]);
        return { ok: true, message: 'Account created successfully.' };
    }, [patientAccounts]);
    const logout = useCallback(() => {
        setCurrentUser(null);
        setAssessmentFlow([]);
        setAssessmentStepIndex(0);
        setAssessmentCompletionSummary(null);
        setPendingAssessmentType(null);
        navigate('login');
    }, [navigate]);
    const startAssessment = useCallback((type) => {
        const sequence = getAssessmentSequence(type);
        setAssessmentFlow(sequence);
        setAssessmentStepIndex(0);
        setAssessmentCompletionSummary(null);
        setPendingAssessmentType(sequence[0]);
        navigate(`assessment-${sequence[0]}`);
    }, [getAssessmentSequence, navigate]);
    const completeAssessment = useCallback((score, durationSeconds) => {
        const currentType = assessmentFlow[assessmentStepIndex] ?? pendingAssessmentType;
        if (!currentUser || !currentType)
            return;
        const tier = score >= 75 ? 'Low' : score >= 60 ? 'Monitor' : score >= 45 ? 'High' : 'Critical';
        const newAssessment = {
            id: `new-${Date.now()}`,
            type: currentType,
            date: daysAgo(0),
            score,
            riskTier: tier,
            durationSeconds,
        };
        setCurrentUser(prev => {
            if (!prev)
                return prev;
            return {
                ...prev,
                riskTier: tier,
                lastAssessmentDate: daysAgo(0),
                totalAssessments: prev.totalAssessments + 1,
                history: [newAssessment, ...prev.history],
            };
        });
        const effectiveFlow = assessmentFlow.length > 0 ? assessmentFlow : [currentType];
        const nextStepIndex = assessmentStepIndex + 1;
        const hasNextStep = nextStepIndex < effectiveFlow.length;
        setAssessmentCompletionSummary({
            assessment: newAssessment,
            stepIndex: nextStepIndex,
            totalSteps: effectiveFlow.length,
        });
        if (hasNextStep) {
            const nextType = effectiveFlow[nextStepIndex];
            setAssessmentStepIndex(nextStepIndex);
            setPendingAssessmentType(nextType);
            navigate(`assessment-${nextType}`);
            return;
        }
        if (effectiveFlow.length > 1) {
            setAssessmentFlow([]);
            setAssessmentStepIndex(0);
            setPendingAssessmentType(null);
            navigate('assessment-complete');
            return;
        }
        setAssessmentFlow([]);
        setAssessmentStepIndex(0);
        setPendingAssessmentType(null);
        navigate('user-dashboard');
    }, [assessmentFlow, assessmentStepIndex, currentUser, navigate, pendingAssessmentType]);
    const cancelAssessmentFlow = useCallback(() => {
        setAssessmentFlow([]);
        setAssessmentStepIndex(0);
        setAssessmentCompletionSummary(null);
        setPendingAssessmentType(null);
    }, []);
    const selectPatient = useCallback((id) => {
        setSelectedPatientId(id);
    }, []);
    const updatePatientDoctor = useCallback((patientId, doctorName, doctorEmail) => {
        setPatients(prev => prev.map(patient => {
            if (patient.id !== patientId)
                return patient;
            return {
                ...patient,
                assignedDoctorName: doctorName || undefined,
                assignedDoctorEmail: doctorEmail || undefined,
            };
        }));
    }, []);
    const updateDoctorInfo = useCallback((doctorName, doctorEmail) => {
        setCurrentUser(prev => {
            if (!prev)
                return prev;
            return { ...prev, doctorName, doctorEmail };
        });
    }, []);
    const showToast = useCallback((message, type = 'success') => {
        const id = `toast-${Date.now()}`;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);
    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);
    return (_jsx(AppContext.Provider, { value: {
            currentUser,
            login,
            registerPatient,
            logout,
            currentScreen,
            navigate,
            previousScreen,
            pendingAssessmentType,
            startAssessment,
            completeAssessment,
            cancelAssessmentFlow,
            assessmentCompletionSummary,
            patients,
            selectedPatientId,
            selectPatient,
            updatePatientDoctor,
            updateDoctorInfo,
            toasts,
            showToast,
            dismissToast,
        }, children: children }));
}
// ─── Helpers ─────────────────────────────────────────────────────────────────
export function getRiskColor(tier) {
    switch (tier) {
        case 'Low': return '#38a169';
        case 'Monitor': return '#d69e2e';
        case 'High': return '#dd6b20';
        case 'Critical': return '#e53e3e';
    }
}
export function getRiskBg(tier) {
    switch (tier) {
        case 'Low': return '#f0fff4';
        case 'Monitor': return '#fffff0';
        case 'High': return '#fffaf0';
        case 'Critical': return '#fff5f5';
    }
}
export function getAssessmentLabel(type) {
    switch (type) {
        case 'picture-recall': return 'Picture Recall';
        case 'animal-naming': return 'Animal Naming';
        case 'structured-speech': return 'Structured Speech';
    }
}
