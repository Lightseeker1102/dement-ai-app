'use client';
import { useState } from 'react';
import { useApp } from '../context';

export default function LoginScreen() {
    const { login, getSecurityQuestion, resetPassword, showToast, navigate } = useApp();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Password recovery state
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotUsername, setForgotUsername] = useState('');
    const [fetchedQuestion, setFetchedQuestion] = useState(null);
    const [securityAnswerInput, setSecurityAnswerInput] = useState('');
    const [newPasswordInput, setNewPasswordInput] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username.trim()) {
            setError('Please enter a username or email address.');
            return;
        }
        setLoading(true);
        const res = await login(username.trim(), password);
        setLoading(false);
        if (res && res.ok) {
            showToast(`Welcome back, ${username === 'admin' ? 'Admin' : username}!`, 'success');
        } else {
            setError(res?.message || 'Invalid credentials. Please try again.');
        }
    };

    const handleQuickDemo = (user, pass) => {
        setUsername(user);
        setPassword(pass);
        login(user, pass).then(res => {
            if (res && res.ok) showToast(`Signed in as ${user}`, 'success');
        });
    };

    const handleFetchQuestion = async (e) => {
        e.preventDefault();
        setForgotError('');
        if (!forgotUsername.trim()) {
            setForgotError('Please enter your username or email.');
            return;
        }
        setForgotLoading(true);
        const res = await getSecurityQuestion(forgotUsername.trim());
        setForgotLoading(false);
        if (res.ok && res.question) {
            setFetchedQuestion(res.question);
        } else {
            setForgotError(res.message || 'Could not find a registered account with that username.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setForgotError('');
        if (!securityAnswerInput.trim()) {
            setForgotError('Please enter your secret answer.');
            return;
        }
        if (newPasswordInput.length < 6) {
            setForgotError('New password must be at least 6 characters.');
            return;
        }
        setForgotLoading(true);
        const res = await resetPassword(forgotUsername.trim(), securityAnswerInput.trim(), newPasswordInput);
        setForgotLoading(false);
        if (res.ok) {
            showToast('Password reset successfully! Please sign in with your new password.', 'success');
            setShowForgotModal(false);
            setUsername(forgotUsername.trim());
            setPassword('');
            setForgotUsername('');
            setFetchedQuestion(null);
            setSecurityAnswerInput('');
            setNewPasswordInput('');
        } else {
            setForgotError(res.message || 'Incorrect security answer.');
        }
    };

    const inputClass = 'w-full pl-12 pr-4 py-4 rounded-xl border border-border/50 bg-slate-50/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]/50 focus:bg-white text-lg transition-all duration-200';

    return (
        <div className="min-h-screen w-full flex bg-background animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Forgot Password Security Question Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Recover Password</h2>
                                <p className="text-sm text-slate-500 mt-0.5">Answer your security question to reset.</p>
                            </div>
                            <button onClick={() => { setShowForgotModal(false); setFetchedQuestion(null); setForgotError(''); }} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">✕</button>
                        </div>

                        {!fetchedQuestion ? (
                            <form onSubmit={handleFetchQuestion} className="flex flex-col gap-4">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Username or Email</label>
                                    <input value={forgotUsername} onChange={e => setForgotUsername(e.target.value)} placeholder="Enter your registered username" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                                {forgotError && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm font-semibold border border-red-200">{forgotError}</div>}
                                <button type="submit" disabled={forgotLoading} className="w-full py-3.5 rounded-xl font-bold text-white bg-[linear-gradient(135deg,#2c7a7b,#1a5e5e)] hover:shadow-lg transition-all">{forgotLoading ? 'Searching account...' : 'Continue'}</button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-1">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Security Question</p>
                                    <p className="text-base font-bold text-slate-800 leading-snug">{fetchedQuestion}</p>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Your Secret Answer</label>
                                    <input value={securityAnswerInput} onChange={e => setSecurityAnswerInput(e.target.value)} placeholder="Type your answer" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">New Password</label>
                                    <input type="password" value={newPasswordInput} onChange={e => setNewPasswordInput(e.target.value)} placeholder="Enter new password (min 6 chars)" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2c7a7b]" />
                                </div>
                                {forgotError && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm font-semibold border border-red-200">{forgotError}</div>}
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setFetchedQuestion(null)} className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">Back</button>
                                    <button type="submit" disabled={forgotLoading} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[linear-gradient(135deg,#2c7a7b,#1a5e5e)] hover:shadow-lg transition-all">{forgotLoading ? 'Resetting...' : 'Reset Password'}</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Left Branding Hero */}
            <div className="hidden lg:flex flex-col justify-center px-16 w-[45%]" style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2c7a7b 100%)' }}>
                <div className="max-w-md animate-in fade-in slide-in-from-left-8 duration-500 delay-150 fill-mode-both">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-xl" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-bold text-white leading-tight mb-4 tracking-tight">Dement<span style={{ color: '#ed8936' }}>(AI)</span></h1>
                    <p className="text-xl leading-relaxed font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>A compassionate tool for early cognitive health screening. Simple, private, and healthcare-integrated.</p>
                    <div className="mt-12 flex flex-col gap-5">
                        {[
                            {
                                text: 'Gentle, voice-based cognitive assessments',
                                icon: (
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                )
                            },
                            {
                                text: 'Doctor portal with secret code hospital onboarding',
                                icon: (
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                )
                            },
                            {
                                text: 'Longitudinal clinical telemetry & risk analytics',
                                icon: (
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                )
                            },
                        ].map(item => (
                            <div key={item.text} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(5px)' }}>{item.icon}</div>
                                <p className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Login Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-10 relative z-10 animate-in fade-in slide-in-from-right-8 duration-500 delay-150 fill-mode-both">
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{ background: '#2c7a7b' }}>
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-slate-800 tracking-tight">Dement<span style={{ color: '#ed8936' }}>(AI)</span></span>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Welcome back</h2>
                    <p className="text-base font-medium text-slate-500 mb-8">Please sign in to access your portal.</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Username or Email</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                </span>
                                <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username or email" className={inputClass} autoComplete="username" autoCapitalize="none" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Password</label>
                                <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs font-bold text-[#2c7a7b] hover:underline">Forgot password?</button>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                </span>
                                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className={`${inputClass} pr-12`} autoComplete="current-password" />
                                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? (
                                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 animate-in slide-in-from-top-1 duration-200">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                <p className="text-base font-semibold text-red-700">{error}</p>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all active:scale-[0.98] mt-1 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-md hover:shadow-lg" style={{
                            background: loading ? '#9db8b9' : 'linear-gradient(135deg, #2c7a7b, #1a5e5e)',
                            boxShadow: loading ? 'none' : '0 4px 20px rgba(44,122,123,0.4)',
                        }}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <button type="button" onClick={() => navigate('register')} className="mt-6 w-full text-center text-sm font-bold transition-colors hover:text-[#1a5e5e] p-2" style={{ color: '#2c7a7b' }}>
                        Create an Account / Register as Doctor ←
                    </button>
                </div>
            </div>
        </div>
    );
}
