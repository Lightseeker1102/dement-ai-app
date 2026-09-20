'use client';
import { useState, useEffect } from 'react';
import { useApp, getRiskColor } from '../../context';
import RiskBadge from '../../components/risk-badge';

function LinkPatientModal({ onClose }) {
    const { linkPatientToDoctor, showToast } = useApp();
    const [patientId, setPatientId] = useState('');
    const [linking, setLinking] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!patientId.trim()) {
            showToast('Please enter a Patient ID, Username, or Email', 'error');
            return;
        }
        setLinking(true);
        const res = await linkPatientToDoctor(patientId.trim());
        setLinking(false);
        if (res.ok) {
            showToast(res.message || 'Patient successfully added to your clinic roster!', 'success');
            onClose();
        } else {
            showToast(res.message || 'Failed to link patient.', 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-border animate-in zoom-in-95 duration-200">
                <div className="px-6 py-5 flex items-center justify-between border-b border-border" style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2c7a7b 100%)' }}>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Link Patient to Clinic</h2>
                        <p className="text-xs text-white/80 mt-0.5">Enter Patient User ID, Username, or Email</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Patient Identifier *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. user-101 or eleanor.vance"
                            value={patientId}
                            onChange={e => setPatientId(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none"
                        />
                        <p className="text-xs text-muted-foreground mt-1.5">You can obtain the Patient ID from the patient's mobile app profile.</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-sm text-muted-foreground hover:bg-muted transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={linking}
                            className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.98]"
                            style={{ background: 'linear-gradient(135deg, #2c7a7b, #1a5e5e)' }}
                        >
                            {linking ? 'Linking...' : 'Add to My Roster'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function DoctorDashboard() {
    const { currentUser, patients, fetchPatientsFromDB, selectPatient, navigate } = useApp();
    const [showLinkModal, setShowLinkModal] = useState(false);

    useEffect(() => {
        fetchPatientsFromDB();
    }, [fetchPatientsFromDB]);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
    });

    const myPatients = patients.filter(p =>
        (p.assignedDoctorEmail && currentUser?.email && p.assignedDoctorEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
        (p.assignedDoctorName && currentUser?.fullName && p.assignedDoctorName.toLowerCase() === currentUser.fullName.toLowerCase())
    );

    const activeList = myPatients.length > 0 ? myPatients : patients;

    const criticalPatients = activeList.filter(p => p.riskTier === 'Critical' || p.riskTier === 'High');
    const recentActivity = [...activeList]
        .sort((a, b) => b.totalAssessments - a.totalAssessments)
        .slice(0, 5);

    const handleSelectPatient = (patientId) => {
        selectPatient(patientId);
        navigate('doctor-patient-detail');
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold text-[#2c7a7b] uppercase tracking-wider mb-1">{today}</p>
                    <h1 className="text-3xl font-bold text-foreground sm:text-4xl tracking-tight">
                        Welcome back, {currentUser?.fullName || 'Dr. Amira Patel'}
                    </h1>
                    <p className="text-base text-muted-foreground mt-1">
                        {currentUser?.hospitalName ? `${currentUser.hospitalName} • ` : ''}
                        {currentUser?.medicalSpecialization || 'Cognitive Neurology Clinic'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowLinkModal(true)}
                        className="px-5 py-3 rounded-2xl font-bold text-sm text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #1a365d, #2c7a7b)' }}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Link New Patient
                    </button>
                </div>
            </div>



            {/* Stat Counters */}
            <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assigned Patients</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{activeList.length}</p>
                    <p className="text-xs text-teal-600 font-medium mt-1">Under Direct Care</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Critical Risk Alerts</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{activeList.filter(p => p.riskTier === 'Critical').length}</p>
                    <p className="text-xs text-red-500 font-medium mt-1">Immediate Review Req.</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">High Risk Watchlist</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{activeList.filter(p => p.riskTier === 'High').length}</p>
                    <p className="text-xs text-orange-500 font-medium mt-1">Frequent Testing</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Stable / Low Risk</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{activeList.filter(p => p.riskTier === 'Low' || p.riskTier === 'Monitor').length}</p>
                    <p className="text-xs text-emerald-500 font-medium mt-1">Routine Monitoring</p>
                </div>
            </div>

            {/* Recent Patients Table / Cards */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight">Recent Patient Battery Activity</h2>
                <button onClick={() => navigate('doctor-patients')} className="text-sm font-semibold text-[#2c7a7b] hover:underline">
                    View Full Roster ({activeList.length}) →
                </button>
            </div>

            <div className="flex flex-col gap-4 mb-8">
                {recentActivity.map(patient => (
                    <div
                        key={patient.id}
                        onClick={() => handleSelectPatient(patient.id)}
                        className="bg-card rounded-3xl p-5 shadow-sm border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-13 h-13 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-sm" style={{ background: getRiskColor(patient.riskTier) }}>
                                {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-foreground truncate group-hover:text-[#2c7a7b] transition-colors">{patient.name}</h3>
                                    <RiskBadge tier={patient.riskTier} size="md" />
                                </div>
                                <p className="text-xs text-muted-foreground font-medium mt-1">
                                    Age {patient.age || 'N/A'} • Last Assessment: {patient.lastAssessmentDate || 'Recent'} • {patient.totalAssessments} completed batteries
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-xl text-xs font-bold text-[#2c7a7b] bg-[#2c7a7b]/10 group-hover:bg-[#2c7a7b] group-hover:text-white transition-all border border-[#2c7a7b]/20"
                            >
                                Open Clinical File
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showLinkModal && <LinkPatientModal onClose={() => setShowLinkModal(false)} />}
        </div>
    );
}
