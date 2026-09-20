'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../../context';
import EmptyState from '../../components/empty-state';

export default function AdminDoctors() {
    const { doctors, fetchDoctorsFromDB, updateDoctorByAdmin, deleteDoctorByAdmin, showToast } = useApp();
    const [search, setSearch] = useState('');
    const [editDoctor, setEditDoctor] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Edit Doctor Form State
    const [editFullName, setEditFullName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editHospitalName, setEditHospitalName] = useState('');
    const [editLicenseNumber, setEditLicenseNumber] = useState('');
    const [editSpecialization, setEditSpecialization] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchDoctorsFromDB();
    }, [fetchDoctorsFromDB]);

    const filtered = doctors.filter(d =>
        (d.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.username || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.hospitalName || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenEdit = (doc) => {
        setEditDoctor(doc);
        setEditFullName(doc.fullName || doc.username || '');
        setEditEmail(doc.email || '');
        setEditPhone(doc.phone || '');
        setEditHospitalName(doc.hospitalName || '');
        setEditLicenseNumber(doc.licenseNumber || '');
        setEditSpecialization(doc.medicalSpecialization || '');
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editDoctor) return;
        setSaving(true);

        const res = await updateDoctorByAdmin({
            userId: editDoctor.userId,
            fullName: editFullName.trim(),
            email: editEmail.trim(),
            phone: editPhone.trim(),
            hospitalName: editHospitalName.trim(),
            licenseNumber: editLicenseNumber.trim(),
            medicalSpecialization: editSpecialization.trim(),
        });

        setSaving(false);
        if (res.ok) {
            showToast(`Updated doctor profile for ${editFullName}`, 'success');
            setEditDoctor(null);
        } else {
            showToast(res.message || 'Failed to update doctor', 'error');
        }
    };

    const handleDeleteDoctor = async (doctorId, docName) => {
        const res = await deleteDoctorByAdmin(doctorId);
        if (res.ok) {
            showToast(`Revoked doctor access for ${docName}`, 'info');
            setDeleteConfirmId(null);
        } else {
            showToast(res.message || 'Failed to delete doctor', 'error');
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground sm:text-4xl tracking-tight">Clinician & Doctor Management</h1>
                    <p className="text-base text-muted-foreground mt-1">
                        Monitor registered attending doctors, verify medical licenses, and manage hospital affiliations.
                    </p>
                </div>
            </div>

            {/* Search & Stat Overview Grid */}
            <div className="grid gap-4 mb-8 sm:grid-cols-3">
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border sm:col-span-2 flex items-center gap-4">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search by doctor name, license #, or hospital..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none"
                        />
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border text-center">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Verified Clinicians</p>
                    <p className="text-3xl font-bold text-[#2c7a7b] mt-1">{doctors.length}</p>
                </div>
            </div>

            {/* Doctors Cards Roster */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(doc => {
                    const initials = (doc.fullName || doc.username || 'Dr')
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map(n => n[0])
                        .join('')
                        .toUpperCase();

                    return (
                        <div key={doc.userId} className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-all">
                            <div>
                                <div className="flex items-center gap-3.5 mb-4">
                                    <div className="w-11 h-11 rounded-xl bg-[#1a365d] text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                                        {initials}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-base font-bold text-foreground tracking-tight truncate">{doc.fullName || doc.username}</h3>
                                        <p className="text-xs text-[#2c7a7b] font-semibold truncate">{doc.medicalSpecialization || 'Cognitive Neurology'}</p>
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                                    <div className="flex justify-between py-1 border-b border-border/40">
                                        <span className="font-medium">Email:</span>
                                        <span className="font-semibold text-foreground truncate max-w-[160px]">{doc.email || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-border/40">
                                        <span className="font-medium">Phone:</span>
                                        <span className="font-semibold text-foreground">{doc.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-border/40">
                                        <span className="font-medium">Hospital:</span>
                                        <span className="font-semibold text-foreground truncate max-w-[160px]">{doc.hospitalName || 'Unassigned'}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="font-medium">License #:</span>
                                        <span className="font-mono font-bold text-foreground">{doc.licenseNumber || 'Verified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                    <span>{doc.assignedPatientsCount || 0} Patients</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => handleOpenEdit(doc)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2c7a7b] bg-[#2c7a7b]/10 hover:bg-[#2c7a7b]/20 border border-[#2c7a7b]/20 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmId(doc.userId)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                                    >
                                        Revoke
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <EmptyState
                    title="No doctors registered"
                    description="No verified clinician accounts match your search parameters."
                    icon={
                        <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    }
                />
            )}

            {/* Edit Doctor Modal */}
            {editDoctor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200 text-left">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Edit Doctor Profile</h2>
                                <p className="text-sm text-slate-500 mt-0.5">Updating profile for {editDoctor.username}</p>
                            </div>
                            <button onClick={() => setEditDoctor(null)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">✕</button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Name</label>
                                <input value={editFullName} onChange={e => setEditFullName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
                                    <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone</label>
                                    <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Medical License #</label>
                                    <input value={editLicenseNumber} onChange={e => setEditLicenseNumber(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 font-mono" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Specialization</label>
                                    <input value={editSpecialization} onChange={e => setEditSpecialization(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Affiliated Hospital / Institution</label>
                                <input value={editHospitalName} onChange={e => setEditHospitalName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800" />
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setEditDoctor(null)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">Cancel</button>
                                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[linear-gradient(135deg,#1a365d,#2c7a7b)]">{saving ? 'Saving...' : 'Save Profile'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Doctor Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Revoke Doctor Account?</h2>
                        <p className="text-sm text-slate-600 mb-6 font-medium">Are you sure you want to delete this doctor account? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200">Cancel</button>
                            <button onClick={() => {
                                const doc = doctors.find(d => d.userId === deleteConfirmId);
                                handleDeleteDoctor(deleteConfirmId, doc?.fullName || 'Doctor');
                            }} className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700">Yes, Revoke Access</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
