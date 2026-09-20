'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AUTH_API = 'http://localhost:8081/dementai-auth-api/api/auth';
const CLINICAL_API = 'http://localhost:8082/dementai-clinical-api/api';
const API = CLINICAL_API;

const SCREEN_META = {
    splash: { title: 'Loading', help: 'The app is loading. You will be taken to the sign-in screen automatically.' },
    landing: { title: 'Welcome', help: 'Welcome to DementAI cognitive monitoring platform.' },
    login: { title: 'Sign In', help: 'Sign in with your registered username or email and password.' },
    register: { title: 'Create Account', help: 'Create a patient account with your name, username, email, phone number, age, and password.' },
    'user-dashboard': { title: 'Patient Dashboard', help: 'Start an assessment from the dashboard, or review your history and profile from the navigation.' },
    'user-history': { title: 'Assessment History', help: 'This view shows recent scores and trends so you can see how performance changes over time.' },
    'user-profile': { title: 'Profile', help: 'Update your doctor details here.' },
    'user-assessments': { title: 'Assessment Library', help: 'Choose a task to begin. Each assessment flows continuously through all four tests.' },
    'admin-dashboard': { title: 'Admin Dashboard', help: 'Use the overview to monitor patient risk and jump into patient or report management.' },
    'admin-users': { title: 'Patients', help: 'Search the patient list, preview details, and generate reports from a single place.' },
    'admin-hospitals': { title: 'Hospital Governance', help: 'Register institutions, view seat utilization, and manage secret doctor access codes.' },
    'doctor-dashboard': { title: 'Doctor Dashboard', help: 'Clinical telemetry overview and patient roster management.' },
    'doctor-patients': { title: 'Patient Clinical Roster', help: 'View assigned patients, filter by cognitive risk, and open clinical files.' },
    'doctor-patient-detail': { title: 'Patient Clinical File', help: 'Longitudinal analytics, test battery scores, and timestamped SOAP progress notes.' },
    'assessment-picture-recall': { title: 'Picture Recall', help: 'Observe the scene carefully, then continue to the microphone screen when you are ready.' },
    'assessment-animal-naming': { title: 'Animal Naming', help: 'Name as many animals as possible within the time limit once recording begins.' },
    'assessment-structured-speech': { title: 'Structured Speech', help: 'Speak on the prompted topic and save when you finish the response.' },
    'assessment-stroop-test': { title: 'Stroop Color Test', help: 'Select the color of the text ink as fast as possible for each of the 10 rounds.' },
    'assessment-digit-span': { title: 'Digit Memory Matrix', help: 'Memorize the digits shown and type them in REVERSE order.' },
    'assessment-recording': { title: 'Recording', help: 'Use the microphone control to start and stop recording before saving your result.' },
    'assessment-complete': { title: 'Assessment Complete', help: 'Your assessment sequence is complete and the app is returning to the home screen.' },
};

export function getScreenTitle(screen) { return SCREEN_META[screen]?.title ?? screen; }
export function getScreenHelp(screen) { return SCREEN_META[screen]?.help ?? ''; }

const today = new Date();
const daysAgo = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export function getRiskTierFromScore(score) {
    if (score >= 78) return 'Low';
    if (score >= 63) return 'Monitor';
    if (score >= 48) return 'High';
    return 'Critical';
}

const AppContext = createContext(null);

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}

function normalizeUser(dbUser) {
    return {
        userId: dbUser.userId || dbUser.user_id || dbUser.id,
        username: dbUser.username,
        role: dbUser.role || 'user',
        fullName: dbUser.fullName || dbUser.full_name || dbUser.username,
        email: dbUser.email || '',
        phone: dbUser.phone || '',
        age: dbUser.age || 0,
        riskTier: dbUser.riskTier || dbUser.risk_tier || 'Monitor',
        lastAssessmentDate: dbUser.lastAssessmentDate || dbUser.last_assessment_date || daysAgo(0),
        totalAssessments: dbUser.totalAssessments || dbUser.total_assessments || 0,
        history: dbUser.history || [],
        doctorName: dbUser.doctorName || dbUser.doctor_name || '',
        doctorEmail: dbUser.doctorEmail || dbUser.doctor_email || '',
        hospitalId: dbUser.hospitalId || dbUser.hospital_id || '',
        hospitalName: dbUser.hospitalName || dbUser.hospital_name || '',
        licenseNumber: dbUser.licenseNumber || dbUser.license_number || '',
        medicalSpecialization: dbUser.medicalSpecialization || dbUser.medical_specialization || '',
    };
}

function normalizeAssessment(a) {
    return {
        id: a.id || a.assessmentId || a.assessment_id || `asm-${Date.now()}`,
        type: a.type || a.assessmentType || a.assessment_type || 'full-battery',
        date: a.date || a.assessmentDate || a.assessment_date || daysAgo(0),
        score: typeof a.score === 'number' ? a.score : (parseInt(a.score) || 0),
        riskTier: a.riskTier || a.risk_tier || 'Monitor',
        durationSeconds: a.durationSeconds || a.duration_seconds || 0,
        transcriptText: a.transcriptText || a.transcript_text || '',
    };
}

function normalizePatient(p) {
    return {
        id: p.userId || p.user_id || p.id,
        name: p.fullName || p.full_name || p.username,
        age: p.age || 0,
        riskTier: p.riskTier || p.risk_tier || 'Monitor',
        lastAssessmentDate: p.lastAssessmentDate || p.last_assessment_date || daysAgo(0),
        totalAssessments: p.totalAssessments || p.total_assessments || 0,
        assignedDoctorName: p.doctorName || p.doctor_name || '',
        assignedDoctorEmail: p.doctorEmail || p.doctor_email || '',
        history: (p.history || []).map(normalizeAssessment),
    };
}

export function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentScreen, setCurrentScreen] = useState('splash');
    const [previousScreen, setPreviousScreen] = useState(null);
    const [pendingAssessmentType, setPendingAssessmentType] = useState(null);
    const [assessmentFlow, setAssessmentFlow] = useState([]);
    const [assessmentStepIndex, setAssessmentStepIndex] = useState(0);
    const [assessmentCompletionSummary, setAssessmentCompletionSummary] = useState(null);
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [authToken, setAuthToken] = useState(null);

    // Initial session hydration from localStorage
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('dementai_user');
            const savedToken = localStorage.getItem('dementai_token');
            if (savedUser && savedToken) {
                const parsed = JSON.parse(savedUser);
                setCurrentUser(parsed);
                setAuthToken(savedToken);
                setCurrentScreen(parsed.role === 'admin' ? 'admin-dashboard' : (parsed.role === 'doctor' ? 'doctor-dashboard' : 'user-dashboard'));
            }
        } catch (_) {}
    }, []);

    const fetchPatientsFromDB = useCallback(async () => {
        try {
            const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
            const res = await fetch(`${CLINICAL_API}/admin/patients`, { headers });
            if (res.ok) {
                const data = await res.json();
                if (data.ok && Array.isArray(data.patients)) {
                    // Backend AdminController already attaches history via assessmentRepository.
                    // Normalize each patient and their embedded history.
                    const normalized = data.patients.map(normalizePatient);
                    setPatients(normalized);
                }
            }
        } catch (_) {
            // Keep current patient state when backend is offline
        }
    }, [authToken]);

    useEffect(() => {
        if (currentScreen.startsWith('admin')) {
            fetchPatientsFromDB();
        }
    }, [currentScreen, fetchPatientsFromDB]);

    const syncUserToClinicalDB = useCallback(async (userObj, token) => {
        try {
            const headers = token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } : { 'Content-Type': 'application/json' };
            await fetch(`${CLINICAL_API}/admin/patient/sync`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    userId: userObj.userId || userObj.id,
                    username: userObj.username,
                    fullName: userObj.fullName || userObj.name,
                    email: userObj.email,
                    phone: userObj.phone,
                    age: userObj.age,
                    role: userObj.role || 'user',
                    riskTier: userObj.riskTier || 'Monitor',
                    doctorName: userObj.doctorName || userObj.assignedDoctorName || '',
                    doctorEmail: userObj.doctorEmail || userObj.assignedDoctorEmail || '',
                }),
            });
        } catch (_) {}
    }, []);

    const navigate = useCallback((screen) => {
        setCurrentScreen(prev => { setPreviousScreen(prev); return screen; });
    }, []);

    const getAssessmentSequence = useCallback((startType) => {
        const ordered = ['picture-recall', 'structured-speech', 'stroop-test', 'digit-span'];
        const startIndex = ordered.indexOf(startType);
        if (startIndex < 0) return ordered;
        return [...ordered.slice(startIndex), ...ordered.slice(0, startIndex)];
    }, []);

    const login = useCallback(async (username, password) => {
        try {
            const res = await fetch(`${AUTH_API}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok && data.ok && data.user) {
                if (data.token) {
                    setAuthToken(data.token);
                    localStorage.setItem('dementai_token', data.token);
                }
                const user = normalizeUser(data.user);
                try {
                    const headers = data.token ? { 'Authorization': `Bearer ${data.token}` } : {};
                    const hRes = await fetch(`${CLINICAL_API}/assessments?userId=${user.userId}`, { headers });
                    if (hRes.ok) {
                        const hData = await hRes.json();
                        if (hData.ok && Array.isArray(hData.assessments)) {
                            user.history = hData.assessments.map(normalizeAssessment);
                        }
                    }
                } catch (_) {}
                
                if (user.role !== 'admin') {
                    syncUserToClinicalDB(data.user, data.token);
                }

                setCurrentUser(user);
                localStorage.setItem('dementai_user', JSON.stringify(user));
                navigate(user.role === 'admin' ? 'admin-dashboard' : (user.role === 'doctor' ? 'doctor-dashboard' : 'user-dashboard'));
                return { ok: true };
            }
            return { ok: false, message: data.message || 'Invalid login details. Please check your username and password.' };
        } catch (_) {
            return { ok: false, message: 'Auth Service offline. Please check if Auth Service (8081) and Clinical Service (8082) are running.' };
        }
    }, [navigate, syncUserToClinicalDB]);

    const registerPatient = useCallback(async (account) => {
        try {
            const res = await fetch(`${AUTH_API}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.username.trim(),
                    password: account.password,
                    fullName: account.fullName.trim(),
                    email: account.email.trim(),
                    phone: account.phone.trim(),
                    age: account.age,
                    securityQuestion: account.securityQuestion,
                    securityAnswer: account.securityAnswer ? account.securityAnswer.trim() : '',
                }),
            });
            const data = await res.json();
            if (data.ok) {
                if (data.token) {
                    setAuthToken(data.token);
                    localStorage.setItem('dementai_token', data.token);
                }
                const registeredUser = data.user || {
                    userId: `user-${Date.now()}`,
                    username: account.username.trim(),
                    fullName: account.fullName.trim(),
                    email: account.email.trim(),
                    phone: account.phone.trim(),
                    age: account.age,
                    role: 'user',
                    riskTier: 'Monitor',
                };
                
                const newPatientItem = normalizePatient(registeredUser);
                setPatients(prev => {
                    if (prev.some(p => p.id === newPatientItem.id)) return prev;
                    return [newPatientItem, ...prev];
                });

                return { ok: true, message: 'Account created successfully.' };
            }
            return { ok: false, message: data.message || 'Registration failed. Please try again.' };
        } catch (_) {
            return { ok: false, message: 'Cannot connect to Auth Service (Port 8081). Please ensure backend is running.' };
        }
    }, [authToken, syncUserToClinicalDB]);

    const getSecurityQuestion = useCallback(async (username) => {
        try {
            const res = await fetch(`${AUTH_API}/security-question`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim() }),
            });
            const data = await res.json();
            if (res.ok && data.ok) {
                return { ok: true, question: data.question };
            }
            return { ok: false, message: data.message || 'No security question found for this account.' };
        } catch (_) {
            return { ok: false, message: 'Auth Service offline. Please check if backend server is running.' };
        }
    }, []);

    const [sessionSubScores, setSessionSubScores] = useState([]);

    const resetPassword = useCallback(async (username, securityAnswer, newPassword) => {
        try {
            const res = await fetch(`${AUTH_API}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), securityAnswer: securityAnswer.trim(), newPassword }),
            });
            const data = await res.json();
            if (res.ok && data.ok) {
                return { ok: true, message: data.message };
            }
            return { ok: false, message: data.message || 'Failed to reset password. Check your security answer.' };
        } catch (_) {
            return { ok: false, message: 'Auth Service offline. Please check if backend server is running.' };
        }
    }, []);


    const logout = useCallback(() => {
        setCurrentUser(null);
        setAuthToken(null);
        try {
            localStorage.removeItem('dementai_user');
            localStorage.removeItem('dementai_token');
        } catch (_) {}
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
        setSessionSubScores([]);
        setAssessmentCompletionSummary(null);
        setPendingAssessmentType(sequence[0]);
        navigate(`assessment-${sequence[0]}`);
    }, [getAssessmentSequence, navigate]);

    const completeAssessment = useCallback(async (score, durationSeconds, transcriptText = '') => {
        const currentType = assessmentFlow[assessmentStepIndex] ?? pendingAssessmentType;
        if (!currentUser || !currentType) return;

        const currentSub = {
            type: currentType,
            label: getAssessmentLabel(currentType),
            score,
            durationSeconds,
            transcriptText,
        };
        const updatedSubScores = [...sessionSubScores, currentSub];
        setSessionSubScores(updatedSubScores);

        const effectiveFlow = assessmentFlow.length > 0 ? assessmentFlow : [currentType];
        const nextStepIndex = assessmentStepIndex + 1;
        const hasNextStep = nextStepIndex < effectiveFlow.length;

        const currentTier = getRiskTierFromScore(score);
        const stepAssessment = {
            id: `step-${Date.now()}`,
            type: currentType,
            date: daysAgo(0),
            score,
            riskTier: currentTier,
            durationSeconds,
            subScores: [currentSub],
        };

        setAssessmentCompletionSummary({ assessment: stepAssessment, stepIndex: nextStepIndex, totalSteps: effectiveFlow.length });

        if (hasNextStep) {
            const nextType = effectiveFlow[nextStepIndex];
            setAssessmentStepIndex(nextStepIndex);
            setPendingAssessmentType(nextType);
            navigate(`assessment-${nextType}`);
            return;
        }

        // All 4 sub-tests completed: compute WEIGHTED Composite Score across the 4 tests
        // 30% Picture Recall + 25% Structured Speech + 25% Stroop Test + 20% Digit Span
        const picScore = updatedSubScores.find(s => s.type === 'picture-recall')?.score ?? score;
        const speechScore = updatedSubScores.find(s => s.type === 'structured-speech')?.score ?? score;
        const stroopScore = updatedSubScores.find(s => s.type === 'stroop-test')?.score ?? score;
        const digitScore = updatedSubScores.find(s => s.type === 'digit-span')?.score ?? score;

        const weightedComposite = Math.round((0.30 * picScore) + (0.25 * speechScore) + (0.25 * stroopScore) + (0.20 * digitScore));
        const compositeTier = getRiskTierFromScore(weightedComposite);
        const totalDuration = updatedSubScores.reduce((acc, s) => acc + s.durationSeconds, 0);

        const compositeAssessment = {
            id: `battery-${Date.now()}`,
            type: 'full-battery',
            label: '4-Test Cognitive Assessment Battery',
            date: daysAgo(0),
            score: weightedComposite,
            riskTier: compositeTier,
            durationSeconds: totalDuration,
            subScores: updatedSubScores,
        };

        // Persist composite score to MySQL DB via Clinical Microservice (Port 8082)
        try {
            const headers = authToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } : { 'Content-Type': 'application/json' };
            await fetch(`${CLINICAL_API}/assessments`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    userId: currentUser.userId,
                    type: 'full-battery',
                    score: weightedComposite,
                    riskTier: compositeTier,
                    durationSeconds: totalDuration,
                    transcriptText: JSON.stringify(updatedSubScores),
                }),
            });
        } catch (_) { /* local state still updates */ }

        setCurrentUser(prev => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                riskTier: compositeTier,
                lastAssessmentDate: daysAgo(0),
                totalAssessments: prev.totalAssessments + 1,
                history: [compositeAssessment, ...prev.history],
            };
            try { localStorage.setItem('dementai_user', JSON.stringify(updated)); } catch (_) {}
            return updated;
        });

        setSessionSubScores([]);
        setAssessmentFlow([]);
        setAssessmentStepIndex(0);
        setPendingAssessmentType(null);
        navigate(effectiveFlow.length > 1 ? 'assessment-complete' : 'user-dashboard');
    }, [assessmentFlow, assessmentStepIndex, currentUser, navigate, pendingAssessmentType, sessionSubScores, authToken]);

    const cancelAssessmentFlow = useCallback(() => {
        setAssessmentFlow([]);
        setAssessmentStepIndex(0);
        setAssessmentCompletionSummary(null);
        setPendingAssessmentType(null);
    }, []);

    const updateDoctorInfo = useCallback(async (doctorName, doctorEmail) => {
        setCurrentUser(prev => prev ? { ...prev, doctorName, doctorEmail } : prev);
        try {
            const headers = authToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } : { 'Content-Type': 'application/json' };
            await fetch(`${CLINICAL_API}/user/doctor`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ userId: currentUser?.userId, doctorName, doctorEmail }),
            });
        } catch (_) {}
    }, [currentUser, authToken]);

    const deletePatient = useCallback(async (patientId) => {
        setPatients(prev => prev.filter(p => p.id !== patientId && p.userId !== patientId));
        try {
            const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
            await fetch(`${CLINICAL_API}/admin/patient?userId=${patientId}`, { method: 'DELETE', headers });
        } catch (_) {}
    }, [authToken]);

    const bulkDeletePatients = useCallback(async (payload) => {
        if (payload.type === 'all') {
            setPatients([]);
        } else if (payload.type === 'riskTier' && Array.isArray(payload.riskTiers)) {
            setPatients(prev => prev.filter(p => !payload.riskTiers.includes(p.riskTier)));
        } else if (payload.type === 'selected' && Array.isArray(payload.userIds)) {
            setPatients(prev => prev.filter(p => !payload.userIds.includes(p.id) && !payload.userIds.includes(p.userId)));
        }

        try {
            const headers = authToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } : { 'Content-Type': 'application/json' };
            const res = await fetch(`${CLINICAL_API}/admin/patients/bulk-delete`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                fetchPatientsFromDB();
                return true;
            }
        } catch (_) {}
        return true;
    }, [fetchPatientsFromDB, authToken]);

    const updatePatientDetails = useCallback(async (updatedData) => {
        setPatients(prev => prev.map(p => {
            if (p.id === updatedData.userId || p.userId === updatedData.userId) {
                return {
                    ...p,
                    name: updatedData.fullName,
                    email: updatedData.email,
                    phone: updatedData.phone,
                    age: updatedData.age,
                    riskTier: updatedData.riskTier,
                    assignedDoctorName: updatedData.doctorName,
                    assignedDoctorEmail: updatedData.doctorEmail,
                };
            }
            return p;
        }));

        try {
            const headers = authToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } : { 'Content-Type': 'application/json' };
            await fetch(`${CLINICAL_API}/admin/patient/update`, {
                method: 'POST',
                headers,
                body: JSON.stringify(updatedData),
            });
        } catch (_) {}
    }, [authToken]);

    const updatePatientDoctor = useCallback(async (patientId, doctorName, doctorEmail) => {
        setPatients(prev => prev.map(p => p.id === patientId ? { ...p, assignedDoctorName: doctorName, assignedDoctorEmail: doctorEmail } : p));
        try {
            const headers = authToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } : { 'Content-Type': 'application/json' };
            await fetch(`${CLINICAL_API}/admin/doctor`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ userId: patientId, doctorName, doctorEmail }),
            });
        } catch (_) {}
    }, [authToken]);


    const createPatientByAdmin = useCallback(async (patientData) => {
        const newId = `user-${Date.now().toString(36)}`;
        const newPatient = {
            id: newId,
            name: patientData.fullName.trim(),
            email: patientData.email.trim(),
            phone: patientData.phone ? patientData.phone.trim() : '',
            age: Number(patientData.age) || 65,
            riskTier: patientData.riskTier || 'Monitor',
            lastAssessmentDate: daysAgo(0),
            totalAssessments: 0,
            assignedDoctorName: patientData.doctorName ? patientData.doctorName.trim() : '',
            assignedDoctorEmail: patientData.doctorEmail ? patientData.doctorEmail.trim() : '',
            history: [],
        };

        setPatients(prev => [newPatient, ...prev]);

        // Sync to Clinical DB
        syncUserToClinicalDB({
            userId: newId,
            username: patientData.fullName.trim().toLowerCase().replace(/\s+/g, '.'),
            fullName: patientData.fullName.trim(),
            email: patientData.email.trim(),
            phone: patientData.phone ? patientData.phone.trim() : '',
            age: Number(patientData.age) || 65,
            role: 'user',
            riskTier: patientData.riskTier || 'Monitor',
            doctorName: patientData.doctorName ? patientData.doctorName.trim() : '',
            doctorEmail: patientData.doctorEmail ? patientData.doctorEmail.trim() : '',
        }, authToken);

        return { ok: true, patient: newPatient };
    }, [authToken, syncUserToClinicalDB]);

    const exportPatientsToCSV = useCallback(() => {
        if (!patients || patients.length === 0) return false;
        const headers = ['Patient ID', 'Full Name', 'Age', 'Risk Tier', 'Total Assessments', 'Last Assessment Date', 'Assigned Doctor', 'Doctor Email'];
        const rows = patients.map(p => [
            `"${p.id}"`,
            `"${p.name.replace(/"/g, '""')}"`,
            p.age,
            `"${p.riskTier}"`,
            p.totalAssessments,
            `"${p.lastAssessmentDate}"`,
            `"${(p.assignedDoctorName || '').replace(/"/g, '""')}"`,
            `"${(p.assignedDoctorEmail || '').replace(/"/g, '""')}"`
        ]);
        const csvString = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DementAI_Patients_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
    }, [patients]);

    const selectPatient = useCallback((id) => setSelectedPatientId(id), []);

    const showToast = useCallback((message, type = 'success') => {
        const id = `toast-${Date.now()}`;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    }, []);
    const dismissToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

    const [hospitals, setHospitals] = useState([]);

    const fetchHospitals = useCallback(async () => {
        try {
            const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
            const res = await fetch(`${CLINICAL_API}/admin/hospitals`, { headers });
            if (res.ok) {
                const data = await res.json();
                if (data.ok && Array.isArray(data.hospitals)) {
                    setHospitals(data.hospitals);
                }
            }
        } catch (_) {}
    }, [authToken]);

    const createHospital = useCallback(async (hospitalData) => {
        try {
            const headers = authToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } : { 'Content-Type': 'application/json' };
            const res = await fetch(`${CLINICAL_API}/admin/hospitals`, {
                method: 'POST',
                headers,
                body: JSON.stringify(hospitalData),
            });
            const data = await res.json();
            if (data.ok) {
                fetchHospitals();
                return { ok: true, hospital: data.hospital };
            }
            return { ok: false, message: data.message || 'Failed to create hospital.' };
        } catch (_) {
            return { ok: false, message: 'Server error creating hospital.' };
        }
    }, [authToken, fetchHospitals]);

    const regenerateHospitalCode = useCallback(async (hospitalId) => {
        try {
            const headers = authToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } : { 'Content-Type': 'application/json' };
            const res = await fetch(`${CLINICAL_API}/admin/hospitals/regenerate-code`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ hospitalId }),
            });
            const data = await res.json();
            if (data.ok) {
                fetchHospitals();
                return { ok: true, secretCode: data.secretCode };
            }
            return { ok: false, message: data.message || 'Failed to regenerate secret code.' };
        } catch (_) {
            return { ok: false, message: 'Server error regenerating secret code.' };
        }
    }, [authToken, fetchHospitals]);

    const deleteHospital = useCallback(async (hospitalId) => {
        try {
            const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
            const res = await fetch(`${CLINICAL_API}/admin/hospitals?hospitalId=${encodeURIComponent(hospitalId)}`, {
                method: 'DELETE',
                headers,
            });
            const data = await res.json();
            if (data.ok) {
                fetchHospitals();
                return { ok: true, message: data.message };
            }
            return { ok: false, message: data.message || 'Failed to delete hospital.' };
        } catch (_) {
            return { ok: false, message: 'Server error deleting hospital.' };
        }
    }, [authToken, fetchHospitals]);

    const bulkDeleteHospitals = useCallback(async (payload) => {
        try {
            const headers = authToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } : { 'Content-Type': 'application/json' };
            const res = await fetch(`${CLINICAL_API}/admin/hospitals/bulk-delete`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.ok) {
                fetchHospitals();
                return { ok: true, deletedCount: data.deletedCount, message: data.message };
            }
            return { ok: false, message: data.message || 'Failed to delete hospitals.' };
        } catch (_) {
            return { ok: false, message: 'Server error deleting hospitals.' };
        }
    }, [authToken, fetchHospitals]);

    const [doctors, setDoctors] = useState([]);

    const fetchDoctorsFromDB = useCallback(async () => {
        try {
            const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
            const res = await fetch(`${CLINICAL_API}/admin/doctors`, { headers });
            if (res.ok) {
                const data = await res.json();
                if (data.ok && Array.isArray(data.doctors)) {
                    setDoctors(data.doctors);
                }
            }
        } catch (_) {}
    }, [authToken]);

    const updateDoctorByAdmin = useCallback(async (doctorData) => {
        try {
            const headers = authToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } : { 'Content-Type': 'application/json' };
            const res = await fetch(`${CLINICAL_API}/admin/doctor/update`, {
                method: 'POST',
                headers,
                body: JSON.stringify(doctorData),
            });
            const data = await res.json();
            if (data.ok) {
                fetchDoctorsFromDB();
                return { ok: true };
            }
            return { ok: false, message: data.message || 'Failed to update doctor.' };
        } catch (_) {
            return { ok: false, message: 'Server error updating doctor.' };
        }
    }, [authToken, fetchDoctorsFromDB]);

    const deleteDoctorByAdmin = useCallback(async (doctorId) => {
        try {
            const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
            const res = await fetch(`${CLINICAL_API}/admin/doctor?userId=${doctorId}`, { method: 'DELETE', headers });
            if (res.ok) {
                fetchDoctorsFromDB();
                return { ok: true };
            }
            return { ok: false, message: 'Failed to delete doctor.' };
        } catch (_) {
            return { ok: false, message: 'Server error deleting doctor.' };
        }
    }, [authToken, fetchDoctorsFromDB]);

    const registerDoctor = useCallback(async (account) => {
        try {
            const res = await fetch(`${AUTH_API}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.username.trim(),
                    password: account.password,
                    fullName: account.fullName.trim(),
                    email: account.email.trim(),
                    phone: account.phone ? account.phone.trim() : '',
                    role: 'doctor',
                    secretCode: account.secretCode.trim(),
                    licenseNumber: account.licenseNumber ? account.licenseNumber.trim() : '',
                    medicalSpecialization: account.medicalSpecialization ? account.medicalSpecialization.trim() : 'Cognitive Neurology',
                    securityQuestion: account.securityQuestion || 'What is your primary clinic name?',
                    securityAnswer: account.securityAnswer ? account.securityAnswer.trim() : 'general',
                }),
            });
            const data = await res.json();
            if (data.ok) {
                if (data.token) {
                    setAuthToken(data.token);
                    localStorage.setItem('dementai_token', data.token);
                }
                const registeredUser = normalizeUser(data.user);
                setCurrentUser(registeredUser);
                localStorage.setItem('dementai_user', JSON.stringify(registeredUser));
                navigate('doctor-dashboard');
                return { ok: true };
            }
            return { ok: false, message: data.message || 'Doctor registration failed.' };
        } catch (_) {
            return { ok: false, message: 'Server error during doctor registration.' };
        }
    }, [navigate]);

    const linkPatientToDoctor = useCallback(async (patientIdentifier) => {
        if (!currentUser) return { ok: false, message: 'Not logged in' };
        try {
            const headers = authToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } : { 'Content-Type': 'application/json' };
            const res = await fetch(`${CLINICAL_API}/doctor/link-patient`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    userId: patientIdentifier,
                    doctorName: currentUser.fullName || currentUser.username,
                    doctorEmail: currentUser.email,
                    hospitalId: currentUser.hospitalId || '',
                    hospitalName: currentUser.hospitalName || '',
                }),
            });
            const data = await res.json();
            if (data.ok) {
                fetchPatientsFromDB();
                return { ok: true, message: data.message };
            }
            return { ok: false, message: data.message || 'Could not link patient.' };
        } catch (_) {
            return { ok: false, message: 'Server error linking patient.' };
        }
    }, [authToken, currentUser, fetchPatientsFromDB]);

    const unlinkPatientFromDoctor = useCallback(async (patientId) => {
        try {
            const headers = authToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } : { 'Content-Type': 'application/json' };
            const res = await fetch(`${CLINICAL_API}/doctor/unlink-patient`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ userId: patientId }),
            });
            const data = await res.json();
            if (data.ok) {
                fetchPatientsFromDB();
                return { ok: true, message: data.message };
            }
            return { ok: false, message: data.message || 'Failed to unlink patient.' };
        } catch (_) {
            return { ok: false, message: 'Server error unlinking patient.' };
        }
    }, [authToken, fetchPatientsFromDB]);

    const fetchClinicalNotes = useCallback(async (userId) => {
        try {
            const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
            const res = await fetch(`${CLINICAL_API}/doctor/notes?userId=${userId}`, { headers });
            if (res.ok) {
                const data = await res.json();
                if (data.ok && Array.isArray(data.notes)) {
                    return data.notes;
                }
            }
            return [];
        } catch (_) {
            return [];
        }
    }, [authToken]);

    const addClinicalNote = useCallback(async (userId, noteContent, noteType = 'SOAP_PROGRESS') => {
        if (!currentUser) return { ok: false };
        try {
            const headers = authToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } : { 'Content-Type': 'application/json' };
            const res = await fetch(`${CLINICAL_API}/doctor/notes`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    userId,
                    doctorId: currentUser.userId,
                    doctorName: currentUser.fullName || currentUser.username,
                    noteType,
                    noteContent,
                }),
            });
            const data = await res.json();
            if (data.ok) {
                return { ok: true, note: data.note };
            }
            return { ok: false, message: data.message };
        } catch (_) {
            return { ok: false, message: 'Failed to add clinical note.' };
        }
    }, [authToken, currentUser]);

    useEffect(() => {
        if (currentScreen === 'admin-hospitals') {
            fetchHospitals();
        }
    }, [currentScreen, fetchHospitals]);

    return (_jsx(AppContext.Provider, {
        value: {
            currentUser,
            login,
            registerPatient,
            registerDoctor,
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
            createPatientByAdmin,
            exportPatientsToCSV,
            updatePatientDoctor,
            updatePatientDetails,
            deletePatient,
            bulkDeletePatients,
            getSecurityQuestion,
            resetPassword,
            updateDoctorInfo,
            fetchPatientsFromDB,
            hospitals,
            fetchHospitals,
            createHospital,
            regenerateHospitalCode,
            deleteHospital,
            bulkDeleteHospitals,
            linkPatientToDoctor,
            unlinkPatientFromDoctor,
            doctors,
            fetchDoctorsFromDB,
            updateDoctorByAdmin,
            deleteDoctorByAdmin,
            fetchClinicalNotes,
            addClinicalNote,
            toasts,
            showToast,
            dismissToast,
        },
        children,
    }));
}

export function getRiskColor(tier) {
    switch (tier) {
        case 'Low': return '#38a169';
        case 'Monitor': return '#d69e2e';
        case 'High': return '#dd6b20';
        case 'Critical': return '#e53e3e';
        default: return '#718096';
    }
}
export function getRiskBg(tier) {
    switch (tier) {
        case 'Low': return '#f0fff4';
        case 'Monitor': return '#fffff0';
        case 'High': return '#fffaf0';
        case 'Critical': return '#fff5f5';
        default: return '#f7fafc';
    }
}
export function getAssessmentLabel(type) {
    switch (type) {
        case 'picture-recall': return 'Picture Recall';
        case 'animal-naming': return 'Animal Naming';
        case 'structured-speech': return 'Structured Speech';
        case 'stroop-test': return 'Stroop Color Test';
        case 'digit-span': return 'Digit Memory Matrix';
        case 'full-battery': return '4-Test Cognitive Battery';
        default: return type;
    }
}
