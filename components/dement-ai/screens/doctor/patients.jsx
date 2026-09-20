'use client';
import { useState, useEffect } from 'react';
import { useApp, getRiskColor } from '../../context';
import RiskBadge from '../../components/risk-badge';
import EmptyState from '../../components/empty-state';

export default function DoctorPatients() {
    const { currentUser, patients, fetchPatientsFromDB, selectPatient, unlinkPatientFromDoctor, showToast, navigate } = useApp();
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState('All');
    const [unlinkConfirmPatient, setUnlinkConfirmPatient] = useState(null);

    useEffect(() => {
        fetchPatientsFromDB();
    }, [fetchPatientsFromDB]);

    const myPatients = patients.filter(p =>
        (p.assignedDoctorEmail && currentUser?.email && p.assignedDoctorEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
        (p.assignedDoctorName && currentUser?.fullName && p.assignedDoctorName.toLowerCase() === currentUser.fullName.toLowerCase())
    );

    const filtered = myPatients.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase());
        const matchesTier = tierFilter === 'All' || p.riskTier === tierFilter;
        return matchesSearch && matchesTier;
    });

    const handleOpenPatient = (patientId) => {
        selectPatient(patientId);
        navigate('doctor-patient-detail');
    };

    const handleUnlink = (patientId, patientName, e) => {
        e.stopPropagation();
        setUnlinkConfirmPatient({ id: patientId, name: patientName });
    };

    const executeUnlink = async () => {
        if (!unlinkConfirmPatient) return;
        const { id, name } = unlinkConfirmPatient;
        const res = await unlinkPatientFromDoctor(id);
        if (res.ok) {
            showToast(`Removed ${name} from roster`, 'info');
        } else {
            showToast(res.message || 'Failed to remove patient', 'error');
        }
        setUnlinkConfirmPatient(null);
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground sm:text-4xl tracking-tight">Patient Clinical Roster</h1>
                    <p className="text-base text-muted-foreground mt-1">
                        View assigned patients, analyze cognitive risk scores, and manage your clinical roster.
                    </p>
                </div>
            </div>

            {/* Filters Row */}
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-bold">
                        Assigned Patients ({myPatients.length})
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search patient name or ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-medium focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none"
                    />

                    <select
                        value={tierFilter}
                        onChange={e => setTierFilter(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-bold focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none"
                    >
                        <option value="All">All Risk Tiers</option>
                        <option value="Critical">Critical Risk</option>
                        <option value="High">High Risk</option>
                        <option value="Monitor">Monitor Tier</option>
                        <option value="Low">Low Risk</option>
                    </select>
                </div>
            </div>

            {/* Patients Roster Cards Grid */}
            {myPatients.length === 0 ? (
                <EmptyState
                    title="No assigned patients on your clinical roster yet"
                    description="Your hospital administrator or attending physician can assign patients to your clinical roster."
                    icon={
                        <svg className="h-10 w-10 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    }
                />
            ) : filtered.length === 0 ? (
                <EmptyState
                    title="No matching patients found"
                    description="No patient files matched your current search or risk tier filter."
                    icon={
                        <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    }
                />
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map(patient => (
                        <div
                            key={patient.id}
                            onClick={() => handleOpenPatient(patient.id)}
                            className="bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-sm" style={{ background: getRiskColor(patient.riskTier) }}>
                                            {patient.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground tracking-tight group-hover:text-[#2c7a7b] transition-colors">{patient.name}</h3>
                                            <p className="text-xs text-muted-foreground font-medium">Patient ID: {patient.id}</p>
                                        </div>
                                    </div>
                                    <RiskBadge tier={patient.riskTier} size="lg" />
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm my-4">
                                    <div className="p-3 rounded-xl bg-muted/50">
                                        <p className="text-xs text-muted-foreground font-medium">Age</p>
                                        <p className="text-base font-bold text-foreground mt-0.5">{patient.age || 'N/A'}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-muted/50">
                                        <p className="text-xs text-muted-foreground font-medium">Completed Batteries</p>
                                        <p className="text-base font-bold text-foreground mt-0.5">{patient.totalAssessments || 0}</p>
                                    </div>
                                </div>

                                <p className="text-xs font-semibold text-[#2c7a7b]">
                                    {patient.assignedDoctorName ? `Assigned: ${patient.assignedDoctorName}` : 'Unassigned to Doctor'}
                                </p>
                            </div>

                            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-2">
                                <span className="text-xs text-muted-foreground font-medium">Last Test: {patient.lastAssessmentDate || 'Recent'}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={(e) => handleUnlink(patient.id, patient.name, e)}
                                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                                        title="Remove from my active list"
                                    >
                                        Unlink
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenPatient(patient.id)}
                                        className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[linear-gradient(135deg,#2c7a7b,#1a5e5e)] hover:shadow-md transition-all active:scale-[0.98]"
                                    >
                                        Clinical File →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation Unlink Modal */}
            {unlinkConfirmPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h-2v6h2V7zm0 8h-2v2h2v-2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Unlink Patient File?</h2>
                        <p className="text-base font-medium text-slate-600 mb-8 leading-relaxed">
                            Are you sure you want to remove <span className="font-bold text-slate-900">{unlinkConfirmPatient.name}</span> from your active clinical roster?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setUnlinkConfirmPatient(null)}
                                className="flex-1 py-4 px-6 rounded-2xl font-bold text-base text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeUnlink}
                                className="flex-1 py-4 px-6 rounded-2xl font-bold text-base text-white bg-red-600 hover:bg-red-700 shadow-md transition-all active:scale-[0.98]"
                            >
                                Yes, Unlink Patient
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
