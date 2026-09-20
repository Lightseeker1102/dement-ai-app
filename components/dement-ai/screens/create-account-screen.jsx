'use client';
import { useState } from 'react';
import { useApp } from '../context';

const PREFIX_RULES = {
    '+91': { name: 'India (+91)', requiredDigits: 10 },
    '+1': { name: 'USA/Canada (+1)', requiredDigits: 10 },
    '+44': { name: 'UK (+44)', requiredDigits: 10 },
    '+61': { name: 'Australia (+61)', requiredDigits: 9 },
    '+other': { name: 'Other', minDigits: 7, maxDigits: 15 },
};

const SECURITY_QUESTIONS = [
    "What is the name of your first pet or dog?",
    "What city were you born in?",
    "What was the name of your primary school?",
    "What is your mother's maiden name?",
    "What is your primary clinic or hospital name?",
];

export default function CreateAccountScreen() {
    const { registerPatient, registerDoctor, navigate, showToast } = useApp();

    const [registrationType, setRegistrationType] = useState('patient'); // 'patient' or 'doctor'

    // Common fields
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phonePrefix, setPhonePrefix] = useState('+91');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
    const [securityAnswer, setSecurityAnswer] = useState('');

    // Doctor specific fields
    const [secretCode, setSecretCode] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [medicalSpecialization, setMedicalSpecialization] = useState('Cognitive Neurology');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const digitsOnly = phone.replace(/\D/g, '');
    const currentRule = PREFIX_RULES[phonePrefix] || PREFIX_RULES['+91'];

    let badgeColor = 'bg-amber-50 text-amber-800 border-amber-300';
    let badgeText = `${digitsOnly.length} digits`;

    if (phonePrefix !== '+other') {
        badgeText = `${digitsOnly.length} / ${currentRule.requiredDigits} digits`;
        if (digitsOnly.length === currentRule.requiredDigits) {
            badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
            badgeText = `✓ ${badgeText}`;
        } else if (digitsOnly.length > currentRule.requiredDigits) {
            badgeColor = 'bg-red-50 text-red-800 border-red-300 font-bold';
            badgeText = `Too long (${digitsOnly.length} / ${currentRule.requiredDigits})`;
        }
    } else {
        badgeText = `${digitsOnly.length} digits`;
        if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
            badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
            badgeText = `✓ ${badgeText}`;
        }
    }

    const inputClass = 'w-full rounded-xl border border-border/50 bg-slate-50/50 px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]/50 focus:bg-white transition-all duration-200';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim() || !securityAnswer.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (registrationType === 'doctor') {
            if (!secretCode.trim()) {
                setError('Doctor registration requires a valid Secret Hospital Access Code provided by your hospital admin.');
                return;
            }
            setLoading(true);
            const result = await registerDoctor({
                fullName,
                username,
                email,
                phone: `${phonePrefix} ${digitsOnly}`,
                secretCode: secretCode.trim(),
                licenseNumber,
                medicalSpecialization,
                password,
                securityQuestion,
                securityAnswer,
            });
            setLoading(false);
            if (!result.ok) {
                setError(result.message);
                return;
            }
            showToast('Doctor Account registered successfully! Welcome to DementAI.', 'success');
            return;
        }

        // Regular Patient Registration
        const ageValue = Number(age);
        if (!Number.isInteger(ageValue) || ageValue < 5 || ageValue > 120) {
            setError('Please enter a valid age between 5 and 120.');
            return;
        }

        setLoading(true);
        const result = await registerPatient({
            fullName,
            username,
            email,
            phone: `${phonePrefix} ${digitsOnly}`,
            age: ageValue,
            password,
            securityQuestion,
            securityAnswer: securityAnswer.trim(),
        });
        setLoading(false);
        if (!result.ok) {
            setError(result.message);
            return;
        }
        showToast('Patient account created. You can sign in now.', 'success');
        navigate('login');
    };

    return (
        <div className="min-h-screen w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ background: 'linear-gradient(135deg, #f7fafc 0%, #edf7f4 45%, #e6fffa 100%)' }}>
            <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                {/* Left Hero Card */}
                <div className="rounded-[2.5rem] border border-border bg-[linear-gradient(180deg,rgba(26,54,93,0.98),rgba(44,122,123,0.96))] p-10 text-left text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] animate-in fade-in slide-in-from-left-8 duration-500 delay-150 fill-mode-both">
                    <button type="button" onClick={() => navigate('login')} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Back to sign in
                    </button>
                    <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: 'rgba(255,255,255,0.65)' }}>Healthcare Onboarding</p>
                    <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl tracking-tight">
                        {registrationType === 'doctor' ? 'Clinical Doctor Verification Portal' : 'Create your patient account.'}
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        {registrationType === 'doctor'
                            ? 'Attending doctors must enter a valid Secret Hospital Access Code issued by their institution admin.'
                            : 'Sign up to monitor your cognitive health, take assessment batteries, and connect with your doctor.'}
                    </p>
                    <div className="mt-12 grid gap-4 sm:grid-cols-3">
                        {[
                            registrationType === 'doctor' ? 'Secret Code Verification' : 'Personal Profile',
                            registrationType === 'doctor' ? 'Clinical Telemetry' : 'Cognitive Battery',
                            registrationType === 'doctor' ? 'SOAP Progress Notes' : 'Doctor Connection',
                        ].map(item => (
                            <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur-sm">
                                <p className="text-sm font-semibold text-white">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Form Card */}
                <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] sm:p-10 relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500 delay-150 fill-mode-both">
                    {/* Role Selector Tabs */}
                    <div className="flex p-1.5 rounded-2xl bg-slate-100 mb-8">
                        <button
                            type="button"
                            onClick={() => { setRegistrationType('patient'); setError(''); }}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                registrationType === 'patient'
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Patient Registration
                        </button>
                        <button
                            type="button"
                            onClick={() => { setRegistrationType('doctor'); setError(''); }}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                registrationType === 'doctor'
                                    ? 'bg-[#1a365d] text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Doctor Registration
                        </button>
                    </div>

                    <div className="mb-6 text-left">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                            {registrationType === 'doctor' ? 'Doctor / Clinician Verification' : 'Create Patient Account'}
                        </h2>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                            {registrationType === 'doctor'
                                ? 'Requires a Secret Hospital Access Code from your institutional administrator.'
                                : 'Fill in your details to create a patient profile.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left relative z-10">
                        {/* Doctor Secret Code Input Banner */}
                        {registrationType === 'doctor' && (
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                    Secret Hospital Access Code *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter secret access code"
                                    value={secretCode}
                                    onChange={e => setSecretCode(e.target.value.toUpperCase())}
                                    className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-white text-amber-950 font-mono font-bold text-base focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                />
                            </div>
                        )}

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-700">Full Name *</label>
                            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder={registrationType === 'doctor' ? 'e.g. Dr. Amira Patel' : 'e.g. Maya Thompson'} className={inputClass} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-700">Username *</label>
                                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose username" className={inputClass} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-700">Email Address *</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@domain.com" className={inputClass} />
                            </div>
                        </div>

                        {registrationType === 'doctor' ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-700">Medical License #</label>
                                    <input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="e.g. MD-984501" className={inputClass} />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-700">Specialization</label>
                                    <input value={medicalSpecialization} onChange={e => setMedicalSpecialization(e.target.value)} placeholder="e.g. Cognitive Neurology" className={inputClass} />
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-700">Age *</label>
                                    <input type="number" min={5} max={120} value={age} onChange={e => setAge(e.target.value)} placeholder="65" className={inputClass} />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-700">Phone Number</label>
                                    <div className="flex gap-2">
                                        <select value={phonePrefix} onChange={e => setPhonePrefix(e.target.value)} className="rounded-xl border border-border/50 bg-slate-50/50 px-2 py-3 text-xs font-bold text-slate-700">
                                            {Object.keys(PREFIX_RULES).map(code => <option key={code} value={code}>{code}</option>)}
                                        </select>
                                        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="98450 12345" className={inputClass} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-700">Password *</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" className={inputClass} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-700">Confirm Password *</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className={inputClass} />
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
                            <div>
                                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-700">Security Question (Recovery)</label>
                                <select value={securityQuestion} onChange={e => setSecurityQuestion(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800">
                                    {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-700">Secret Answer *</label>
                                <input value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} placeholder="Secret answer" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800" />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 animate-in slide-in-from-top-1 duration-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-base font-bold text-white transition-all active:scale-[0.98] shadow-md hover:shadow-lg"
                            style={{ background: loading ? '#9db8b9' : 'linear-gradient(135deg, #1a365d 0%, #2c7a7b 100%)' }}
                        >
                            {loading ? 'Processing Registration...' : (registrationType === 'doctor' ? 'Register Verified Doctor' : 'Create Patient Account')}
                        </button>

                        <button type="button" onClick={() => navigate('login')} className="mt-2 w-full text-center text-sm font-bold transition-colors hover:text-[#1a5e5e] p-1" style={{ color: '#2c7a7b' }}>
                            ← Already registered? Sign in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
