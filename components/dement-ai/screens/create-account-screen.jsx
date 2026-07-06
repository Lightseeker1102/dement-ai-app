'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useApp } from '../context';
export default function CreateAccountScreen() {
    const { registerPatient, navigate, showToast } = useApp();
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputClass = 'w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2c7a7b] transition-all';
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!fullName.trim() || !username.trim() || !email.trim() || !phone.trim() || !age.trim() || !password.trim()) {
            setError('Please fill in all required fields.');
            return;
        }
        const ageValue = Number(age);
        if (!Number.isInteger(ageValue) || ageValue < 18 || ageValue > 120) {
            setError('Please enter a valid age between 18 and 120.');
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
        setLoading(true);
        const result = registerPatient({
            fullName,
            username,
            email,
            phone,
            age: ageValue,
            password,
        });
        setLoading(false);
        if (!result.ok) {
            setError(result.message);
            return;
        }
        showToast('Account created. You can sign in now.', 'success');
        navigate('login');
    };
    return (_jsx("div", { className: "min-h-screen w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10", style: { background: 'linear-gradient(135deg, #f7fafc 0%, #edf7f4 45%, #e6fffa 100%)' }, children: _jsxs("div", { className: "mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]", children: [_jsxs("div", { className: "rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(26,54,93,0.98),rgba(44,122,123,0.96))] p-8 text-left text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]", children: [_jsxs("button", { type: "button", onClick: () => navigate('login'), className: "inline-flex items-center gap-2 text-sm font-semibold", style: { color: 'rgba(255,255,255,0.8)' }, children: [_jsx("svg", { className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", clipRule: "evenodd" }) }), "Back to sign in"] }), _jsx("p", { className: "mt-8 text-sm font-semibold uppercase tracking-[0.22em]", style: { color: 'rgba(255,255,255,0.65)' }, children: "Patient onboarding" }), _jsx("h1", { className: "mt-3 text-4xl font-bold leading-tight sm:text-5xl", children: "Create your account and keep your assessments organized." }), _jsx("p", { className: "mt-4 text-base leading-relaxed", style: { color: 'rgba(255,255,255,0.78)' }, children: "Add your basic details once, then sign in with your username or email and password whenever you return." }), _jsx("div", { className: "mt-10 grid gap-4 sm:grid-cols-3", children: [
                                'Personal profile',
                                'Password protected sign in',
                                'Ready for assessments',
                            ].map(item => (_jsx("div", { className: "rounded-2xl border border-white/10 bg-white/8 p-4", children: _jsx("p", { className: "text-sm font-semibold text-white", children: item }) }, item))) })] }), _jsxs("div", { className: "rounded-[2rem] border border-border bg-card p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-8", children: [_jsxs("div", { className: "mb-6 text-left", children: [_jsx("h2", { className: "text-3xl font-bold text-foreground", children: "Create patient account" }), _jsx("p", { className: "mt-2 text-base text-muted-foreground", children: "Fill in your details to create a frontend-only demo account." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-5 text-left", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "full-name", className: "mb-2 block text-base font-semibold text-foreground", children: "Full name" }), _jsx("input", { id: "full-name", value: fullName, onChange: e => setFullName(e.target.value), placeholder: "e.g. Maya Thompson", className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "username", className: "mb-2 block text-base font-semibold text-foreground", children: "Username" }), _jsx("input", { id: "username", value: username, onChange: e => setUsername(e.target.value), placeholder: "Choose a login username", className: inputClass, autoComplete: "username" })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "mb-2 block text-base font-semibold text-foreground", children: "Email address" }), _jsx("input", { id: "email", type: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "you@example.com", className: inputClass, autoComplete: "email" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "phone", className: "mb-2 block text-base font-semibold text-foreground", children: "Phone number" }), _jsx("input", { id: "phone", value: phone, onChange: e => setPhone(e.target.value), placeholder: "+91 99999 99999", className: inputClass, autoComplete: "tel" })] })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "age", className: "mb-2 block text-base font-semibold text-foreground", children: "Age" }), _jsx("input", { id: "age", type: "number", min: 18, max: 120, value: age, onChange: e => setAge(e.target.value), placeholder: "65", className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "mb-2 block text-base font-semibold text-foreground", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: e => setPassword(e.target.value), placeholder: "Create a password", className: inputClass, autoComplete: "new-password" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirm-password", className: "mb-2 block text-base font-semibold text-foreground", children: "Confirm password" }), _jsx("input", { id: "confirm-password", type: "password", value: confirmPassword, onChange: e => setConfirmPassword(e.target.value), placeholder: "Re-enter your password", className: inputClass, autoComplete: "new-password" })] }), error && (_jsx("div", { className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-700", children: error })), _jsx("button", { type: "submit", disabled: loading, className: "mt-1 inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-lg font-bold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70", style: { background: loading ? '#9db8b9' : 'linear-gradient(135deg, #2c7a7b 0%, #1a5e5e 100%)' }, children: loading ? 'Creating account...' : 'Create Account' }), _jsx("button", { type: "button", onClick: () => navigate('login'), className: "text-left text-sm font-semibold transition-colors", style: { color: '#2c7a7b' }, children: "Already have an account? Sign in" })] })] })] }) }));
}
