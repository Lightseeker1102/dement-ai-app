'use client';
import { useState } from 'react';
import { useApp, getRiskColor, getRiskTierFromScore, getAssessmentLabel } from '../../context';
import RiskBadge from '../../components/risk-badge';
import EmptyState from '../../components/empty-state';

function PatientDetail({ patient, onClose }) {
    const { updatePatientDoctor, showToast } = useApp();
    const [doctorName, setDoctorName] = useState(patient.assignedDoctorName ?? '');
    const [doctorEmail, setDoctorEmail] = useState(patient.assignedDoctorEmail ?? '');
    const [saving, setSaving] = useState(false);

    const handleSaveDoctor = () => {
        setSaving(true);
        updatePatientDoctor(patient.id, doctorName.trim(), doctorEmail.trim());
        setTimeout(() => {
            setSaving(false);
            showToast(doctorName.trim()
                ? `${patient.name} assigned to ${doctorName.trim()}`
                : `${patient.name} doctor assignment cleared`, 'success');
        }, 250);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto m-4 border border-slate-100">
                <div className="px-6 pt-7 pb-6 rounded-t-3xl text-white" style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2c7a7b 100%)' }}>
                    <button onClick={onClose} className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold">Back to Patients</span>
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white border-2 border-white/30 shadow-md" style={{ background: getRiskColor(patient.riskTier) }}>
                            {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">{patient.name}</h2>
                            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                Age {patient.age} &middot; {patient.totalAssessments} assessments completed
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200">
                            <RiskBadge tier={patient.riskTier} size="lg" />
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-2">Current Risk Tier</p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200">
                            <p className="text-4xl font-bold tracking-tight" style={{ color: getRiskColor(patient.riskTier) }}>
                                {patient.history?.[0]?.score ?? '--'}
                            </p>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Latest Score</p>
                        </div>
                    </div>

                    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-base font-bold text-slate-800">Assigned Doctor</p>
                                <p className="text-xs font-medium text-slate-500 mt-0.5">Specify clinician responsible for patient medical oversight.</p>
                            </div>
                            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-500 border border-slate-200 shadow-xs">Clinical Sync</span>
                        </div>
                        <div className="mt-4 grid gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor={`doctor-name-${patient.id}`}>Doctor name</label>
                                <input id={`doctor-name-${patient.id}`} value={doctorName} onChange={e => setDoctorName(e.target.value)} placeholder="Dr. Amira Patel" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor={`doctor-email-${patient.id}`}>Doctor email</label>
                                <input id={`doctor-email-${patient.id}`} type="email" value={doctorEmail} onChange={e => setDoctorEmail(e.target.value)} placeholder="dr.name@hospital.org" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]" />
                            </div>
                            <button type="button" onClick={handleSaveDoctor} disabled={saving} className="rounded-xl bg-[linear-gradient(135deg,#2c7a7b,#1a5e5e)] px-4 py-3 text-base font-bold text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-70">
                                {saving ? 'Saving...' : 'Save Doctor Assignment'}
                            </button>
                        </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-800 mb-3">Assessment History</h3>
                    <div className="flex flex-col gap-4">
                        {patient.history && patient.history.length > 0 ? (
                            patient.history.map(item => {
                                // Parse sub-scores from transcriptText (JSON array of individual test scores)
                                let subScores = [];
                                try {
                                    if (item.transcriptText && item.transcriptText.startsWith('[')) {
                                        subScores = JSON.parse(item.transcriptText);
                                    }
                                } catch (_) {}

                                return (
                                    <div key={item.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                        {/* Assessment header row */}
                                        <div className="p-4 flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm" style={{ color: getRiskColor(item.riskTier), background: `${getRiskColor(item.riskTier)}18`, border: `2px solid ${getRiskColor(item.riskTier)}30` }}>
                                                {item.score}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base font-bold text-slate-800">{getAssessmentLabel(item.type)}</p>
                                                <p className="text-xs font-medium text-slate-500">{item.date} &middot; {Math.round((item.durationSeconds || 0) / 60)}m {(item.durationSeconds || 0) % 60}s</p>
                                            </div>
                                            <RiskBadge tier={item.riskTier} />
                                        </div>

                                        {/* Sub-score breakdown (if available from full-battery assessment) */}
                                        {subScores.length > 0 && (
                                            <div className="border-t border-slate-200 px-4 py-3 bg-white/60">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Score Breakdown</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {subScores.map((sub, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 rounded-lg bg-slate-100/80 px-3 py-2">
                                                            <span className="font-bold text-sm" style={{ color: getRiskColor(getRiskTierFromScore(sub.score)) }}>{sub.score}</span>
                                                            <span className="text-xs font-medium text-slate-600 truncate">{sub.label || getAssessmentLabel(sub.type)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-xs text-slate-400">Weights:</span>
                                                    <span className="text-xs text-slate-500">Picture 30% · Speech 25% · Stroop 25% · Digit 20%</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-3xl mb-2">📋</p>
                                <p className="text-sm font-semibold text-slate-600">No assessments completed yet</p>
                                <p className="text-xs text-slate-400 mt-1">This patient has not taken any cognitive tests.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminUsers() {
    const { patients, selectPatient, deletePatient, bulkDeletePatients, updatePatientDetails, createPatientByAdmin, exportPatientsToCSV, navigate, showToast } = useApp();
    const [selectedId, setSelectedId] = useState(null);
    const [search, setSearch] = useState('');
    const [riskFilter, setRiskFilter] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [editPatient, setEditPatient] = useState(null);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // Edit form states
    const [editFullName, setEditFullName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editAge, setEditAge] = useState('');
    const [editRiskTier, setEditRiskTier] = useState('Monitor');
    const [editDoctorName, setEditDoctorName] = useState('');
    const [editDoctorEmail, setEditDoctorEmail] = useState('');

    // Add form states
    const [addFullName, setAddFullName] = useState('');
    const [addEmail, setAddEmail] = useState('');
    const [addPhone, setAddPhone] = useState('');
    const [addAge, setAddAge] = useState('68');
    const [addRiskTier, setAddRiskTier] = useState('Monitor');
    const [addDoctorName, setAddDoctorName] = useState('');
    const [addDoctorEmail, setAddDoctorEmail] = useState('');

    // Bulk delete state
    const [bulkOption, setBulkOption] = useState('selected');
    const [selectedTiers, setSelectedTiers] = useState(['Critical']);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const selected = patients.find(p => p.id === selectedId) ?? null;
    const patientToDelete = patients.find(p => p.id === deleteConfirmId) ?? null;

    const filtered = patients
        .filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.email && p.email.toLowerCase().includes(search.toLowerCase())) ||
                (p.assignedDoctorName && p.assignedDoctorName.toLowerCase().includes(search.toLowerCase()));
            const matchesTier = riskFilter === 'All' || p.riskTier === riskFilter;
            return matchesSearch && matchesTier;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'age') return b.age - a.age;
            if (sortBy === 'assessments') return b.totalAssessments - a.totalAssessments;
            if (sortBy === 'risk') {
                const order = { Critical: 4, High: 3, Monitor: 2, Low: 1 };
                return (order[b.riskTier] || 0) - (order[a.riskTier] || 0);
            }
            return 0;
        });

    const handleReport = (patient, e) => {
        e.stopPropagation();
        selectPatient(patient.id);
        navigate('admin-reports');
        showToast(`Selected report view for ${patient.name}`, 'info');
    };

    const handleDeleteSingle = (patient, e) => {
        e.stopPropagation();
        setDeleteConfirmId(patient.id);
    };

    const handleOpenEdit = (patient, e) => {
        e.stopPropagation();
        setEditPatient(patient);
        setEditFullName(patient.name);
        setEditEmail(patient.email ?? '');
        setEditPhone(patient.phone ?? '');
        setEditAge(patient.age ?? 65);
        setEditRiskTier(patient.riskTier ?? 'Monitor');
        setEditDoctorName(patient.assignedDoctorName ?? '');
        setEditDoctorEmail(patient.assignedDoctorEmail ?? '');
    };

    const handleSaveEdit = async () => {
        if (!editPatient) return;
        if (!editFullName.trim() || !editEmail.trim()) {
            showToast('Full name and Email are required', 'error');
            return;
        }
        await updatePatientDetails({
            userId: editPatient.id,
            fullName: editFullName.trim(),
            email: editEmail.trim(),
            phone: editPhone.trim(),
            age: Number(editAge) || 65,
            riskTier: editRiskTier,
            doctorName: editDoctorName.trim(),
            doctorEmail: editDoctorEmail.trim(),
        });
        showToast(`Updated details for ${editFullName.trim()}`, 'success');
        setEditPatient(null);
    };

    const handleCreatePatient = async () => {
        if (!addFullName.trim() || !addEmail.trim()) {
            showToast('Full name and Email are required to register a patient', 'error');
            return;
        }
        await createPatientByAdmin({
            fullName: addFullName.trim(),
            email: addEmail.trim(),
            phone: addPhone.trim(),
            age: addAge,
            riskTier: addRiskTier,
            doctorName: addDoctorName.trim(),
            doctorEmail: addDoctorEmail.trim(),
        });
        showToast(`New patient profile created for ${addFullName.trim()}`, 'success');
        setShowAddModal(false);
        setAddFullName('');
        setAddEmail('');
        setAddPhone('');
        setAddAge('68');
        setAddDoctorName('');
        setAddDoctorEmail('');
    };

    const handleExport = () => {
        const success = exportPatientsToCSV();
        if (success) {
            showToast('Exported patient list to CSV', 'success');
        } else {
            showToast('No patient data to export', 'error');
        }
    };

    const confirmDeleteSingle = () => {
        if (patientToDelete) {
            deletePatient(patientToDelete.id);
            showToast(`Patient ${patientToDelete.name} removed`, 'success');
            setDeleteConfirmId(null);
        }
    };

    const handleToggleTier = (tier) => {
        setSelectedTiers(prev => prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]);
    };

    const handleToggleUserSelect = (id) => {
        setSelectedUserIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAllUsers = () => {
        if (selectedUserIds.length === patients.length) {
            setSelectedUserIds([]);
        } else {
            setSelectedUserIds(patients.map(p => p.id));
        }
    };

    const handleExecuteBulkDelete = async () => {
        if (bulkOption === 'all') {
            await bulkDeletePatients({ type: 'all' });
            showToast('All patient records erased', 'warning');
        } else if (bulkOption === 'riskTier') {
            if (selectedTiers.length === 0) {
                showToast('Please select at least one risk tier', 'error');
                return;
            }
            await bulkDeletePatients({ type: 'riskTier', riskTiers: selectedTiers });
            showToast(`Erased patients in risk tiers: ${selectedTiers.join(', ')}`, 'warning');
        } else if (bulkOption === 'selected') {
            if (selectedUserIds.length === 0) {
                showToast('Please select at least one patient to delete', 'error');
                return;
            }
            await bulkDeletePatients({ type: 'selected', userIds: selectedUserIds });
            showToast(`Erased ${selectedUserIds.length} selected patient records`, 'warning');
        }
        setShowBulkModal(false);
        setSelectedUserIds([]);
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {selected && <PatientDetail patient={selected} onClose={() => setSelectedId(null)} />}

            {/* Add New Patient Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Add New Patient Record</h2>
                                <p className="text-sm font-medium text-slate-500 mt-1">Create a new clinical profile directly in the database.</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">✕</button>
                        </div>

                        <div className="grid gap-4 mb-6">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Full Name *</label>
                                <input value={addFullName} onChange={e => setAddFullName(e.target.value)} placeholder="e.g., Robert Vance" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address *</label>
                                    <input type="email" value={addEmail} onChange={e => setAddEmail(e.target.value)} placeholder="robert@hospital.org" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Phone Number</label>
                                    <input value={addPhone} onChange={e => setAddPhone(e.target.value)} placeholder="(555) 234-5678" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Age</label>
                                    <input type="number" min={10} max={115} value={addAge} onChange={e => setAddAge(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Initial Risk Tier</label>
                                    <select value={addRiskTier} onChange={e => setAddRiskTier(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]">
                                        {['Low', 'Monitor', 'High', 'Critical'].map(t => (
                                            <option key={t} value={t}>{t} Risk</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Assigned Doctor Name</label>
                                    <input value={addDoctorName} onChange={e => setAddDoctorName(e.target.value)} placeholder="Dr. Amira Patel" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Doctor Email</label>
                                    <input type="email" value={addDoctorEmail} onChange={e => setAddDoctorEmail(e.target.value)} placeholder="dr.patel@hospital.org" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button onClick={() => setShowAddModal(false)} className="px-5 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">Cancel</button>
                            <button onClick={handleCreatePatient} className="px-6 py-3 rounded-xl font-bold text-white bg-[linear-gradient(135deg,#2c7a7b,#1a5e5e)] hover:shadow-lg shadow-md transition-all active:scale-[0.98]">Register Patient</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Single Delete Confirmation Modal */}
            {patientToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Remove Patient Record?</h2>
                        <p className="text-base font-medium text-slate-600 mb-6 leading-relaxed">
                            Are you sure you want to permanently erase <strong className="text-slate-900">{patientToDelete.name}</strong> and all associated assessment records? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3.5 px-5 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all">Cancel</button>
                            <button onClick={confirmDeleteSingle} className="flex-1 py-3.5 px-5 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all">Delete Permanently</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit / Modify Patient Details Modal */}
            {editPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Modify Patient Details</h2>
                                <p className="text-sm text-slate-500 mt-1">Updating record for {editPatient.name}</p>
                            </div>
                            <button onClick={() => setEditPatient(null)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">✕</button>
                        </div>

                        <div className="grid gap-4 mb-6">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Full Name</label>
                                <input value={editFullName} onChange={e => setEditFullName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
                                    <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Phone Number</label>
                                    <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Age</label>
                                    <input type="number" min={5} max={120} value={editAge} onChange={e => setEditAge(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Risk Tier</label>
                                    <select value={editRiskTier} onChange={e => setEditRiskTier(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]">
                                        {['Low', 'Monitor', 'High', 'Critical'].map(t => (
                                            <option key={t} value={t}>{t} Risk</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Doctor Name</label>
                                    <input value={editDoctorName} onChange={e => setEditDoctorName(e.target.value)} placeholder="Dr. Amira Patel" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Doctor Email</label>
                                    <input type="email" value={editDoctorEmail} onChange={e => setEditDoctorEmail(e.target.value)} placeholder="dr.name@hospital.org" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button onClick={() => setEditPatient(null)} className="px-5 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">Cancel</button>
                            <button onClick={handleSaveEdit} className="px-6 py-3 rounded-xl font-bold text-white bg-[linear-gradient(135deg,#2c7a7b,#1a5e5e)] hover:shadow-lg shadow-md">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Delete Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Bulk Clean Patients</h2>
                                <p className="text-sm text-slate-500 mt-1">Erase database records by category or selection.</p>
                            </div>
                            <button onClick={() => setShowBulkModal(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">✕</button>
                        </div>

                        <div className="flex flex-col gap-4 mb-6">
                            <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${bulkOption === 'selected' ? 'border-[#2c7a7b] bg-[#2c7a7b]/5' : 'border-slate-200'}`}>
                                <input type="radio" name="bulkOpt" checked={bulkOption === 'selected'} onChange={() => setBulkOption('selected')} className="mt-1" />
                                <div>
                                    <p className="font-bold text-slate-800">Delete Selected Patients</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Select individual patients from the list below.</p>
                                </div>
                            </label>

                            <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${bulkOption === 'riskTier' ? 'border-[#2c7a7b] bg-[#2c7a7b]/5' : 'border-slate-200'}`}>
                                <input type="radio" name="bulkOpt" checked={bulkOption === 'riskTier'} onChange={() => setBulkOption('riskTier')} className="mt-1" />
                                <div>
                                    <p className="font-bold text-slate-800">Delete by Risk Tier</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Target specific risk categories.</p>
                                </div>
                            </label>

                            <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${bulkOption === 'all' ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}>
                                <input type="radio" name="bulkOpt" checked={bulkOption === 'all'} onChange={() => setBulkOption('all')} className="mt-1" />
                                <div>
                                    <p className="font-bold text-red-700">Delete ALL Patients</p>
                                    <p className="text-xs text-red-600/80 mt-0.5">Wipe all non-admin patient records entirely.</p>
                                </div>
                            </label>
                        </div>

                        {bulkOption === 'riskTier' && (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 grid grid-cols-2 gap-3">
                                {['Critical', 'High', 'Monitor', 'Low'].map(tier => (
                                    <label key={tier} className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                                        <input type="checkbox" checked={selectedTiers.includes(tier)} onChange={() => handleToggleTier(tier)} />
                                        <span>{tier} Risk</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {bulkOption === 'selected' && (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 max-h-48 overflow-y-auto flex flex-col gap-2">
                                <button type="button" onClick={handleSelectAllUsers} className="text-left text-xs font-bold text-[#2c7a7b] mb-2 uppercase tracking-wide">
                                    {selectedUserIds.length === patients.length ? 'Deselect All' : 'Select All'}
                                </button>
                                {patients.map(p => (
                                    <label key={p.id} className="flex items-center justify-between cursor-pointer text-sm font-medium text-slate-700 p-2 rounded-xl hover:bg-slate-100">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" checked={selectedUserIds.includes(p.id)} onChange={() => handleToggleUserSelect(p.id)} />
                                            <span className="font-bold text-slate-800">{p.name}</span>
                                        </div>
                                        <RiskBadge tier={p.riskTier} />
                                    </label>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button onClick={() => setShowBulkModal(false)} className="px-5 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">Cancel</button>
                            <button onClick={handleExecuteBulkDelete} className="px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-md">Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Header & Action Toolbar */}
            <div className="mb-6 sm:mb-8 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-1 tracking-tight">Patient Directory</h1>
                    <p className="text-base font-medium text-muted-foreground">{patients.length} registered patients currently monitored</p>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                    <button onClick={() => setShowAddModal(true)} className="px-5 py-3 rounded-2xl font-bold text-sm text-white bg-[linear-gradient(135deg,#2c7a7b,#1a5e5e)] hover:shadow-md transition-all flex items-center gap-2 shadow-sm active:scale-[0.98]">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        + Add Patient
                    </button>
                    <button onClick={handleExport} className="px-4 py-3 rounded-2xl font-bold text-sm text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all flex items-center gap-2 shadow-xs active:scale-[0.98]">
                        <svg className="w-4 h-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export CSV
                    </button>
                    <button onClick={() => setShowBulkModal(true)} className="px-4 py-3 rounded-2xl font-bold text-sm text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all flex items-center gap-2 shadow-xs active:scale-[0.98]">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Bulk Clean
                    </button>
                </div>
            </div>

            {/* Search Input & Sort Controls */}
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
                <div className="relative sm:col-span-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by patient name, email, or assigned doctor..." className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-card border border-border text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2c7a7b] shadow-xs" />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Sort:</span>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#2c7a7b] shadow-xs">
                        <option value="name">Name (A-Z)</option>
                        <option value="risk">Highest Risk First</option>
                        <option value="assessments">Most Assessments</option>
                        <option value="age">Age (Oldest First)</option>
                    </select>
                </div>
            </div>

            {/* Risk Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1 flex-shrink-0">Filter Tier:</span>
                {['All', 'Critical', 'High', 'Monitor', 'Low'].map(t => {
                    const isActive = riskFilter === t;
                    const count = t === 'All' ? patients.length : patients.filter(p => p.riskTier === t).length;
                    return (
                        <button key={t} onClick={() => setRiskFilter(t)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${isActive ? 'bg-[#2c7a7b] text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}>
                            {t === 'All' ? 'All Tiers' : `${t} Risk`}
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'}`}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Patient Cards Grid / List */}
            <div className="flex flex-col gap-4">
                {filtered.map(patient => (
                    <div key={patient.id} onClick={() => setSelectedId(patient.id)} role="button" tabIndex={0} onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedId(patient.id);
                        }
                    }} className="w-full rounded-2xl border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(247,250,252,0.92))] p-5 text-left shadow-[0_16px_36px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(15,23,42,0.12)] relative">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-white shadow-sm" style={{ background: getRiskColor(patient.riskTier) }}>
                                {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-3 mb-1">
                                    <p className="text-lg font-bold text-foreground truncate tracking-tight">{patient.name}</p>
                                    <RiskBadge tier={patient.riskTier} size="lg" />
                                </div>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Age {patient.age} &middot; {patient.email || 'No email'} &middot; Last test: {patient.lastAssessmentDate}
                                </p>
                                {(patient.assignedDoctorName || patient.assignedDoctorEmail) && (
                                    <p className="mt-1.5 text-xs font-bold tracking-wide uppercase" style={{ color: '#2c7a7b' }}>
                                        Physician: {patient.assignedDoctorName || patient.assignedDoctorEmail}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border gap-2 flex-wrap">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{patient.totalAssessments} screening tests logged</span>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={e => handleOpenEdit(patient, e)} className="text-xs font-bold px-3.5 py-2 rounded-xl transition-colors text-[#2c7a7b] bg-[#2c7a7b]/10 hover:bg-[#2c7a7b]/20 border border-[#2c7a7b]/20">Modify Profile</button>
                                <button type="button" onClick={e => handleDeleteSingle(patient, e)} className="text-xs font-bold px-3.5 py-2 rounded-xl transition-colors text-red-600 bg-red-50 hover:bg-red-100 border border-red-200">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="p-8 rounded-3xl bg-card border border-border text-center flex flex-col items-center justify-center">
                        <EmptyState title="No matching patients found" description={riskFilter !== 'All' ? `No patient profiles match the "${riskFilter} Risk" filter criteria.` : "No patients match your search term."} icon={<svg className="h-8 w-8 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>} />
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => { setSearch(''); setRiskFilter('All'); }} className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">Reset Filters</button>
                            <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#2c7a7b] text-white hover:bg-[#236364]">+ Add Patient</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
