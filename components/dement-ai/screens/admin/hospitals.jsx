'use client';
import { useState } from 'react';
import { useApp } from '../../context';
import EmptyState from '../../components/empty-state';

function CreateHospitalModal({ onClose }) {
    const { createHospital, showToast } = useApp();
    const [hospitalName, setHospitalName] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [location, setLocation] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [maxDoctors, setMaxDoctors] = useState(50);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hospitalName.trim()) {
            showToast('Hospital name is required', 'error');
            return;
        }
        setSaving(true);
        const res = await createHospital({
            hospitalName: hospitalName.trim(),
            secretCode: secretCode.trim(),
            licenseNumber: licenseNumber.trim(),
            location: location.trim(),
            contactEmail: contactEmail.trim(),
            maxDoctors: Number(maxDoctors) || 50,
        });
        setSaving(false);
        if (res.ok) {
            showToast(`Hospital '${hospitalName}' registered successfully! Secret Code: ${res.hospital.secretCode}`, 'success');
            onClose();
        } else {
            showToast(res.message || 'Failed to create hospital', 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-border animate-in zoom-in-95 duration-200">
                <div className="px-6 py-5 flex items-center justify-between border-b border-border" style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2c7a7b 100%)' }}>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Register New Hospital</h2>
                        <p className="text-xs text-white/80 mt-0.5">Generates secret access code for doctor onboarding</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Hospital / Institution Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. St. Jude Cognitive Health Center"
                            value={hospitalName}
                            onChange={e => setHospitalName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">Secret Access Code</label>
                            <input
                                type="text"
                                placeholder="Auto-generated if empty"
                                value={secretCode}
                                onChange={e => setSecretCode(e.target.value.toUpperCase())}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">License / Registration #</label>
                            <input
                                type="text"
                                placeholder="e.g. HOSP-SJ-9921"
                                value={licenseNumber}
                                onChange={e => setLicenseNumber(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">Location / City</label>
                            <input
                                type="text"
                                placeholder="e.g. Boston, MA"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">Contact Email</label>
                            <input
                                type="email"
                                placeholder="admin@hospital.org"
                                value={contactEmail}
                                onChange={e => setContactEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Max Doctor Seat License Limit</label>
                        <input
                            type="number"
                            min="1"
                            max="500"
                            value={maxDoctors}
                            onChange={e => setMaxDoctors(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-sm text-muted-foreground hover:bg-muted transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.98]"
                            style={{ background: 'linear-gradient(135deg, #2c7a7b, #1a5e5e)' }}
                        >
                            {saving ? 'Registering...' : 'Register Hospital'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DeleteHospitalModal({ hospitals, onClose, onDeleteSingle, onDeleteBulk }) {
    const [mode, setMode] = useState('single'); // 'single' | 'selected' | 'all'
    const [selectedSingleId, setSelectedSingleId] = useState(hospitals[0]?.hospitalId || '');
    const [selectedIds, setSelectedIds] = useState([]);
    const [deleting, setDeleting] = useState(false);

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === hospitals.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(hospitals.map(h => h.hospitalId));
        }
    };

    const handleConfirm = async () => {
        setDeleting(true);
        if (mode === 'single') {
            if (!selectedSingleId) return;
            const target = hospitals.find(h => h.hospitalId === selectedSingleId);
            await onDeleteSingle(selectedSingleId, target?.hospitalName || '');
        } else if (mode === 'selected') {
            if (selectedIds.length === 0) return;
            await onDeleteBulk({ type: 'selected', hospitalIds: selectedIds });
        } else if (mode === 'all') {
            await onDeleteBulk({ type: 'all' });
        }
        setDeleting(false);
        onClose();
    };

    const selectedSingle = hospitals.find(h => h.hospitalId === selectedSingleId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
            <div className="bg-card rounded-3xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-border bg-gradient-to-r from-red-700 to-rose-800 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Hospital Removal Manager</h2>
                            <p className="text-xs text-white/80 mt-0.5">Delete single institution, selected batch, or all hospitals</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-5">
                    {/* Mode Selector Segmented Tabs */}
                    <div className="grid grid-cols-3 p-1 rounded-2xl bg-muted border border-border text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => setMode('single')}
                            className={`py-2.5 rounded-xl transition-all ${
                                mode === 'single' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Single Hospital
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('selected')}
                            className={`py-2.5 rounded-xl transition-all ${
                                mode === 'selected' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Selected ({selectedIds.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('all')}
                            className={`py-2.5 rounded-xl transition-all ${
                                mode === 'all' ? 'bg-red-600 text-white shadow-sm' : 'text-muted-foreground hover:text-red-600'
                            }`}
                        >
                            Delete All ({hospitals.length})
                        </button>
                    </div>

                    {/* Mode 1: Single Hospital Selector */}
                    {mode === 'single' && (
                        <div className="flex flex-col gap-3">
                            <label className="block text-sm font-semibold text-foreground">Select Hospital to Remove</label>
                            <select
                                value={selectedSingleId}
                                onChange={e => setSelectedSingleId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                            >
                                {hospitals.map(h => (
                                    <option key={h.hospitalId} value={h.hospitalId}>
                                        {h.hospitalName} ({h.location || 'N/A'}) • {h.doctorCount || 0} Doctors
                                    </option>
                                ))}
                            </select>
                            {selectedSingle && (
                                <div className="p-3 rounded-xl bg-muted/60 text-xs font-medium text-muted-foreground flex justify-between">
                                    <span>Code: <strong className="font-mono text-foreground">{selectedSingle.secretCode}</strong></span>
                                    <span>Doctors: <strong className="text-foreground">{selectedSingle.doctorCount || 0}</strong></span>
                                    <span>Patients: <strong className="text-foreground">{selectedSingle.patientCount || 0}</strong></span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mode 2: Multi-Select Checklist */}
                    {mode === 'selected' && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-foreground">Select Hospitals ({selectedIds.length} chosen)</label>
                                <button
                                    type="button"
                                    onClick={toggleSelectAll}
                                    className="text-xs font-bold text-[#2c7a7b] hover:underline"
                                >
                                    {selectedIds.length === hospitals.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>
                            <div className="max-h-52 overflow-y-auto border border-border rounded-xl p-2 flex flex-col gap-1 bg-background">
                                {hospitals.map(h => (
                                    <label
                                        key={h.hospitalId}
                                        className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                                            selectedIds.includes(h.hospitalId)
                                                ? 'border-red-400 bg-red-50 dark:bg-red-950/30 text-foreground font-semibold'
                                                : 'border-transparent hover:bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(h.hospitalId)}
                                                onChange={() => toggleSelect(h.hospitalId)}
                                                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                                            />
                                            <div>
                                                <p className="font-bold text-foreground">{h.hospitalName}</p>
                                                <p className="text-[11px] text-muted-foreground">{h.location || 'No location'} • License #{h.licenseNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted">
                                            {h.doctorCount || 0} Docs
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mode 3: Delete All Warning */}
                    {mode === 'all' && (
                        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-left">
                            <h3 className="text-sm font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                CRITICAL: Purge All Registered Institutions
                            </h3>
                            <p className="text-xs font-medium text-red-700 dark:text-red-400 mt-2 leading-relaxed">
                                You are about to permanently delete all <strong>{hospitals.length}</strong> hospital institutions. All secret doctor codes will be invalidated immediately.
                            </p>
                        </div>
                    )}

                    {/* Cascade Notice */}
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-start gap-2">
                        <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Affiliated doctors and patients will be unlinked automatically. User login accounts will remain active in system.</span>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={deleting}
                            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-muted-foreground hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={deleting || (mode === 'selected' && selectedIds.length === 0)}
                            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 shadow-md transition-all active:scale-[0.98]"
                        >
                            {deleting ? 'Executing...' : mode === 'all' ? `Purge All ${hospitals.length} Hospitals` : mode === 'selected' ? `Delete ${selectedIds.length} Selected` : 'Delete Hospital'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminHospitals() {
    const { hospitals, regenerateHospitalCode, deleteHospital, bulkDeleteHospitals, showToast } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const filteredHospitals = hospitals.filter(h =>
        h.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.secretCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.location && h.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleRegenerate = async (hospitalId, hospitalName) => {
        if (confirm(`Are you sure you want to rotate the secret access code for ${hospitalName}? Previous code will be invalidated.`)) {
            const res = await regenerateHospitalCode(hospitalId);
            if (res.ok) {
                showToast(`New Secret Code generated: ${res.secretCode}`, 'success');
            } else {
                showToast(res.message || 'Failed to rotate code', 'error');
            }
        }
    };

    const handleDeleteSingle = async (hospitalId, hospitalName) => {
        const res = await deleteHospital(hospitalId);
        if (res.ok) {
            showToast(`Hospital '${hospitalName}' removed successfully.`, 'info');
        } else {
            showToast(res.message || 'Failed to delete hospital', 'error');
        }
    };

    const handleDeleteBulk = async (payload) => {
        const res = await bulkDeleteHospitals(payload);
        if (res.ok) {
            showToast(res.message || 'Hospitals deleted successfully.', 'info');
        } else {
            showToast(res.message || 'Failed to delete hospitals', 'error');
        }
    };

    const totalDoctors = hospitals.reduce((acc, h) => acc + (h.doctorCount || 0), 0);
    const totalPatients = hospitals.reduce((acc, h) => acc + (h.patientCount || 0), 0);

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground sm:text-4xl tracking-tight">Clinical Governance & Hospitals</h1>
                    <p className="text-base text-muted-foreground mt-1">Manage institutional partners, monitor clinical seat capacity, and issue secret doctor registration codes.</p>
                </div>
                <div className="flex items-center gap-3">
                    {hospitals.length > 0 && (
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-5 py-3.5 rounded-2xl font-bold text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/60 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
                            title="Delete single, selected, or all hospital institutions"
                        >
                            <svg className="w-4 h-4 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Delete Hospitals
                        </button>
                    )}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3.5 rounded-2xl font-bold text-base text-white shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2c7a7b 100%)' }}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Register New Hospital
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 mb-8 sm:grid-cols-3 sm:gap-6">
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Registered Hospitals</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{hospitals.length}</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">Active Clinical Partners</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Verified Clinicians</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{totalDoctors}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">Doctors Onboarded via Secret Code</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Monitored Patients</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{totalPatients}</p>
                    <p className="text-xs text-teal-600 font-medium mt-1">Institutional Coverage</p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search hospitals by name, secret access code, or location..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border bg-card text-foreground font-medium placeholder:text-muted-foreground focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none shadow-sm"
                    />
                    <svg className="w-5 h-5 text-muted-foreground absolute left-4 top-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            {/* Hospital Roster Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {filteredHospitals.map(h => (
                    <div key={h.hospitalId} className="bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground tracking-tight">{h.hospitalName}</h3>
                                    <p className="text-xs text-muted-foreground font-medium">{h.location || 'Location Not Specified'} • License #{h.licenseNumber || 'N/A'}</p>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                    {h.status || 'ACTIVE'}
                                </span>
                            </div>

                            {/* Secret Code Display Card */}
                            <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Secret Doctor Access Code</p>
                                    <p className="text-lg font-mono font-bold text-[#1a365d] dark:text-teal-300 tracking-wider mt-0.5">{h.secretCode}</p>
                                </div>
                                <button
                                    onClick={() => handleRegenerate(h.hospitalId, h.hospitalName)}
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#2c7a7b] bg-[#2c7a7b]/10 hover:bg-[#2c7a7b]/20 transition-colors border border-[#2c7a7b]/20"
                                    title="Rotate Secret Code"
                                >
                                    Rotate Code
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                                <div className="p-3 rounded-xl bg-muted/50">
                                    <p className="text-xs text-muted-foreground font-medium">Onboarded Doctors</p>
                                    <p className="text-lg font-bold text-foreground mt-0.5">{h.doctorCount || 0} / {h.maxDoctors || 50}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/50">
                                    <p className="text-xs text-muted-foreground font-medium">Affiliated Patients</p>
                                    <p className="text-lg font-bold text-foreground mt-0.5">{h.patientCount || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-medium">
                            <span>Contact: {h.contactEmail || 'N/A'}</span>
                            <span>ID: {h.hospitalId}</span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredHospitals.length === 0 && (
                <EmptyState
                    title="No hospitals found"
                    description="No registered clinical institutions matched your search term."
                    icon={
                        <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1a1 1 0 000 2h2a1 1 0 100-2H7zm0 4a1 1 0 100 2h2a1 1 0 100-2H7zm0 4a1 1 0 100 2h2a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                    }
                />
            )}

            {showCreateModal && <CreateHospitalModal onClose={() => setShowCreateModal(false)} />}
            {showDeleteModal && (
                <DeleteHospitalModal
                    hospitals={hospitals}
                    onClose={() => setShowDeleteModal(false)}
                    onDeleteSingle={handleDeleteSingle}
                    onDeleteBulk={handleDeleteBulk}
                />
            )}
        </div>
    );
}
