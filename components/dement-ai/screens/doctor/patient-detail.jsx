'use client';
import { useState, useEffect } from 'react';
import { useApp, getRiskColor, getAssessmentLabel } from '../../context';
import RiskBadge from '../../components/risk-badge';
import EmptyState from '../../components/empty-state';

export default function DoctorPatientDetail() {
    const { patients, selectedPatientId, fetchClinicalNotes, addClinicalNote, showToast, navigate } = useApp();
    const patient = patients.find(p => p.id === selectedPatientId) || patients[0];

    const [notes, setNotes] = useState([]);
    const [noteContent, setNoteContent] = useState('');
    const [noteType, setNoteType] = useState('SOAP_PROGRESS');
    const [submittingNote, setSubmittingNote] = useState(false);

    useEffect(() => {
        if (patient) {
            fetchClinicalNotes(patient.id).then(data => {
                if (Array.isArray(data)) setNotes(data);
            });
        }
    }, [patient, fetchClinicalNotes]);

    if (!patient) {
        return (
            <div className="p-8 text-center">
                <p className="text-muted-foreground font-semibold">No patient selected.</p>
                <button onClick={() => navigate('doctor-patients')} className="mt-4 px-4 py-2 bg-[#2c7a7b] text-white rounded-xl text-sm font-bold">
                    Return to Patient Roster
                </button>
            </div>
        );
    }

    const history = patient.history || [];
    const avgScore = history.length > 0
        ? Math.round(history.reduce((sum, item) => sum + (item.score || 0), 0) / history.length)
        : 72;

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!noteContent.trim()) {
            showToast('Note content cannot be empty', 'error');
            return;
        }
        setSubmittingNote(true);
        const res = await addClinicalNote(patient.id, noteContent.trim(), noteType);
        setSubmittingNote(false);
        if (res.ok && res.note) {
            showToast('Clinical progress note saved to patient record', 'success');
            setNotes(prev => [res.note, ...prev]);
            setNoteContent('');
        } else {
            showToast(res.message || 'Failed to save note', 'error');
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Navigation back */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('doctor-patients')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2c7a7b] hover:underline"
                >
                    ← Back to Patient Roster
                </button>
            </div>

            {/* Header Banner */}
            <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-sm border border-border mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-md flex-shrink-0" style={{ background: getRiskColor(patient.riskTier) }}>
                            {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{patient.name}</h1>
                                <RiskBadge tier={patient.riskTier} size="lg" />
                            </div>
                            <p className="text-sm text-muted-foreground font-medium mt-1">
                                Patient ID: <span className="font-mono text-foreground font-bold">{patient.id}</span> • Age: {patient.age || 'N/A'} • Last Assessment: {patient.lastAssessmentDate}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Overview Grid */}
            <div className="grid gap-4 mb-8 sm:grid-cols-3 sm:gap-6">
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Average Battery Score</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{avgScore} / 100</p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">Cognitive Battery Index</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Completed Assessments</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{history.length || patient.totalAssessments || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">Recorded Sessions</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Attending Clinician</p>
                    <p className="text-xl font-bold text-[#2c7a7b] truncate mt-2">{patient.assignedDoctorName || 'Dr. Amira Patel'}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{patient.assignedDoctorEmail || 'amira.patel@hospital.org'}</p>
                </div>
            </div>

            {/* Main Content Grid: Left Assessment History, Right SOAP Notes */}
            <div className="grid gap-8 lg:grid-cols-12">
                {/* Left Column: Battery Performance */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
                        <h2 className="text-xl font-bold text-foreground tracking-tight mb-4">Assessment Session Logs & AI Metrics</h2>
                        {history.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {history.map((asm, idx) => (
                                    <div key={asm.id || idx} className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-base font-bold text-foreground">{getAssessmentLabel(asm.type)}</h4>
                                                <p className="text-xs text-muted-foreground font-medium">{asm.date} • Duration: {asm.durationSeconds || 120}s</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold text-foreground">{asm.score} pts</span>
                                                <RiskBadge tier={asm.riskTier} size="sm" />
                                            </div>
                                        </div>

                                        {asm.transcriptText && (
                                            <div className="mt-2 p-3 rounded-xl bg-card border border-border text-xs text-muted-foreground italic font-medium">
                                                "{asm.transcriptText}"
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-muted-foreground text-sm font-medium">
                                No assessment history logged for this patient yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Timestamped Clinical SOAP Notes */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
                        <h2 className="text-xl font-bold text-foreground tracking-tight mb-4">SOAP Clinical Progress Notes</h2>

                        {/* Note Entry Form */}
                        <form onSubmit={handleAddNote} className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Note Category</label>
                                <select
                                    value={noteType}
                                    onChange={e => setNoteType(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-bold focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none"
                                >
                                    <option value="SOAP_PROGRESS">SOAP Progress Note</option>
                                    <option value="DIAGNOSTIC">Diagnostic Assessment</option>
                                    <option value="RECOMMENDATION">Physician Recommendation</option>
                                    <option value="EMERGENCY">Emergency Escalation Note</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Clinical Observations & Plan</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Enter clinical observations, MSE findings, or treatment plan..."
                                    value={noteContent}
                                    onChange={e => setNoteContent(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-medium focus:ring-2 focus:ring-[#2c7a7b] focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submittingNote}
                                    className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98]"
                                    style={{ background: 'linear-gradient(135deg, #1a365d, #2c7a7b)' }}
                                >
                                    {submittingNote ? 'Saving Note...' : 'Save Note to Record'}
                                </button>
                            </div>
                        </form>

                        {/* Existing Notes Timeline */}
                        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
                            {notes.map(n => (
                                <div key={n.noteId} className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-[#2c7a7b] px-2.5 py-0.5 rounded-full bg-[#2c7a7b]/10 border border-[#2c7a7b]/20">
                                            {n.noteType || 'SOAP Note'}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-foreground leading-relaxed font-medium mt-1 whitespace-pre-wrap">{n.noteContent}</p>
                                    <p className="text-[11px] font-semibold text-muted-foreground text-right mt-1">— {n.doctorName || 'Attending Physician'}</p>
                                </div>
                            ))}

                            {notes.length === 0 && (
                                <p className="text-xs text-center text-muted-foreground font-medium py-6">
                                    No clinical progress notes added yet for this patient.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
