'use client';
import { useState } from 'react';

export default function LandingScreen({ onStart }) {
    const [exiting, setExiting] = useState(false);

    const handleStart = () => {
        setExiting(true);
        setTimeout(() => {
            onStart();
        }, 500); // match transition animation duration
    };

    return (
        <div className={`min-h-screen w-full flex flex-col items-center justify-center text-center px-6 transition-all duration-700 ease-in-out ${exiting ? 'opacity-0 translate-y-[-10px]' : 'opacity-100 translate-y-0'}`}
             style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2c7a7b 100%)' }}>
            
            <div className="max-w-2xl bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8 sm:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Brand Icon */}
                <div className="mx-auto w-24 h-24 rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-lg"
                     style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                </div>

                {/* App Title styled with Gloock font */}
                <h1 className="text-5xl sm:text-6xl font-heading text-white tracking-wide mb-6" 
                    style={{ fontFamily: 'var(--font-heading), serif' }}>
                    Dement<span style={{ color: '#ed8936' }}>(AI)</span>
                </h1>

                <div>
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4">
                        Cognitive Health Monitoring
                    </span>
                    <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-lg mx-auto">
                        An intelligent cognitive screening platform designed to assess speech patterns, memory recall, and executive function.
                    </p>
                </div>

                {/* Motivational Quote Card */}
                <div className="my-8 p-5 rounded-2xl border border-white/10 bg-white/5 max-w-md mx-auto text-center italic">
                    <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                        "The human mind is a beautiful landscape; caring for it is our greatest privilege."
                    </p>
                </div>

                {/* Enter Application CTA */}
                <button onClick={handleStart}
                        className="w-full sm:w-auto px-10 py-4.5 rounded-xl font-bold text-lg text-white transition-all active:scale-[0.97] hover:shadow-lg flex items-center justify-center gap-2 mx-auto"
                        style={{
                            background: 'linear-gradient(135deg, #ed8936, #c97925)',
                            boxShadow: '0 6px 20px rgba(237,137,54,0.4)',
                        }}>
                    <span>Get Started</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
