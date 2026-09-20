'use client';
import { useApp } from '../../context';
import RiskBadge from '../../components/risk-badge';

export default function UserProfile() {
    const { currentUser } = useApp();
    if (!currentUser)
        return null;

    const displayName = currentUser.fullName ?? currentUser.username;
    const initials = displayName.slice(0, 2).toUpperCase();

    return (
        <div className="mx-auto max-w-2xl px-4 py-6 text-left sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="mb-8 sm:mb-10">
                <h1 className="text-3xl font-bold text-foreground mb-1 sm:text-4xl">My Profile</h1>
                <p className="text-base text-muted-foreground">Your personal information and clinical health summary.</p>
            </div>

            {/* Profile Avatar Card */}
            <div className="rounded-2xl p-8 mb-8 flex items-start gap-6" style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2c7a7b 100%)' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 flex-shrink-0" style={{ background: '#ed8936', borderColor: 'rgba(255,255,255,0.3)' }}>
                    {initials}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{displayName}</h2>
                    <p className="text-base mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {currentUser.role === 'doctor' ? 'Verified Clinician' : 'Patient Account'}
                        {currentUser.hospitalName ? ` • ${currentUser.hospitalName}` : ''}
                    </p>
                    <p className="text-xs text-white/80 font-mono mt-1">User ID: {currentUser.userId}</p>
                </div>
            </div>

            {/* Account Details */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-8">
                <h2 className="text-lg font-bold text-foreground mb-4">Account Details</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                        <span className="text-base text-muted-foreground">Full Name</span>
                        <span className="text-base font-semibold text-foreground text-right">{currentUser.fullName ?? displayName}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-start justify-between gap-4">
                        <span className="text-base text-muted-foreground">Username</span>
                        <span className="text-base font-semibold text-foreground text-right">{currentUser.username}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-start justify-between gap-4">
                        <span className="text-base text-muted-foreground">Email</span>
                        <span className="text-base font-semibold text-foreground text-right">{currentUser.email ?? 'Not set'}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-start justify-between gap-4">
                        <span className="text-base text-muted-foreground">Phone</span>
                        <span className="text-base font-semibold text-foreground text-right">{currentUser.phone ?? 'Not set'}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-start justify-between gap-4">
                        <span className="text-base text-muted-foreground">Age</span>
                        <span className="text-base font-semibold text-foreground text-right">{currentUser.age ?? 'Not set'}</span>
                    </div>
                </div>
            </div>

            {/* Health Summary */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-8">
                <h2 className="text-lg font-bold text-foreground mb-4">Health Summary</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                        <span className="text-base text-muted-foreground">Current Risk Tier</span>
                        <RiskBadge tier={currentUser.riskTier} size="lg" />
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-start justify-between gap-4">
                        <span className="text-base text-muted-foreground">Total Assessments Completed</span>
                        <span className="text-lg font-bold text-foreground">{currentUser.totalAssessments}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-start justify-between gap-4">
                        <span className="text-base text-muted-foreground">Last Assessment Date</span>
                        <span className="text-base font-semibold text-foreground">{currentUser.lastAssessmentDate}</span>
                    </div>
                </div>
            </div>

            {/* Care Team Display (Read-Only) */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#ebf8ff' }}>
                        <svg className="w-5 h-5" style={{ color: '#2b6cb0' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Attending Doctor & Care Team</h2>
                        <p className="text-sm text-muted-foreground font-medium">Assigned by clinical administrators and attending physicians</p>
                    </div>
                </div>

                {(currentUser.doctorName || currentUser.doctorEmail) ? (
                    <div className="rounded-xl p-5 border" style={{ background: '#f0fff4', borderColor: '#c6f6d5' }}>
                        <p className="text-xs font-bold uppercase tracking-wider mb-1 text-emerald-800">Connected Physician:</p>
                        {currentUser.doctorName && <p className="text-lg text-foreground font-bold">{currentUser.doctorName}</p>}
                        {currentUser.doctorEmail && <p className="text-sm text-teal-700 font-medium">{currentUser.doctorEmail}</p>}
                        {currentUser.hospitalName && <p className="text-xs text-slate-500 font-medium mt-1">Institution: {currentUser.hospitalName}</p>}
                    </div>
                ) : (
                    <div className="rounded-xl p-5 border border-slate-200 bg-slate-50">
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                            No attending doctor assigned yet. Your attending clinician or hospital administrator can assign you to their clinical roster.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
