import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../utils/storage';

function useCountUp(target, duration = 1800) {
    const [count, setCount] = useState(0);
    const started = useRef(false);
    useEffect(() => {
        if (!target || started.current) return;
        started.current = true;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) { setCount(target); clearInterval(interval); }
            else setCount(Math.floor(current));
        }, duration / steps);
        return () => clearInterval(interval);
    }, [target, duration]);
    return count;
}

export default function Home() {
    const [stats, setStats] = useState({ user_count: 0, report_count: 0 });
    const [visible, setVisible] = useState(false);
    const statsRef = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/stats`)
            .then(r => r.json())
            .then(d => setStats({ user_count: d.user_count || 0, report_count: d.report_count || 0 }))
            .catch(() => {});
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
        if (statsRef.current) obs.observe(statsRef.current);
        return () => obs.disconnect();
    }, []);

    const users   = useCountUp(visible ? stats.user_count : 0);
    const reports = useCountUp(visible ? stats.report_count : 0);
    const cities  = useCountUp(visible ? 24 : 0, 1200);

    return (
        <div className="page-container" style={{ background: '#f8fafc' }}>

            {/* ── HERO ───────────────────────────────────────────── */}
            <section style={{
                background: 'linear-gradient(135deg, #022c22 0%, #064e3b 45%, #065f46 100%)',
                padding: '5rem 0 4rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative blobs */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div className="container" style={{ position: 'relative' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }}>

                        {/* Left — copy */}
                        <div style={{ maxWidth: '640px' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.4)',
                                borderRadius: '99px', padding: '6px 16px', fontSize: '0.8rem',
                                fontWeight: '700', color: '#6ee7b7', marginBottom: '1.5rem',
                                letterSpacing: '0.04em', textTransform: 'uppercase',
                            }}>
                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399', display: 'inline-block' }} />
                                AI-Powered · Nationwide Initiative
                            </div>

                            <h1 style={{
                                fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', fontWeight: '900', lineHeight: 1.1,
                                color: '#ffffff', marginBottom: '1.25rem', fontFamily: "'Outfit', sans-serif",
                            }}>
                                Make India<br />
                                <span style={{
                                    background: 'linear-gradient(90deg, #34d399, #fbbf24)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                }}>Beautiful</span> Again
                            </h1>

                            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '520px' }}>
                                Spot waste, photograph it, and our AI instantly analyses the type, severity &amp; economic value. Join {stats.user_count > 0 ? `${stats.user_count}+` : 'thousands of'} citizens building a cleaner, greener India.
                            </p>

                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <Link to="/report" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: '#fff', fontWeight: '700', fontSize: '1rem',
                                    padding: '14px 28px', borderRadius: '12px',
                                    boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    textDecoration: 'none',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(16,185,129,0.5)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.4)'; }}>
                                    <i className="fa-solid fa-camera" /> Report Waste
                                </Link>
                                <Link to="/how-it-works" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
                                    color: '#fff', fontWeight: '600', fontSize: '1rem',
                                    padding: '14px 28px', borderRadius: '12px',
                                    backdropFilter: 'blur(8px)', transition: 'background 0.2s',
                                    textDecoration: 'none',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                                    How It Works <i className="fa-solid fa-arrow-right" />
                                </Link>
                            </div>
                        </div>

                        {/* Right — floating AI result mock card */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '20px', padding: '20px', width: '100%', maxWidth: '340px',
                                backdropFilter: 'blur(16px)',
                                boxShadow: '0 32px 64px rgba(0,0,0,0.3)',
                            }}>
                                <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '14px', height: '170px', background: 'linear-gradient(135deg, #1a3a2a, #0d2b1e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
                                        <i className="fa-solid fa-camera" style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'block' }} />
                                        <span style={{ fontSize: '0.8rem' }}>Your photo goes here</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <i className="fa-solid fa-robot" style={{ color: '#fff', fontSize: '0.95rem' }} />
                                    </div>
                                    <div>
                                        <div style={{ color: '#fff', fontWeight: '700', fontSize: '0.9rem' }}>AI Detection</div>
                                        <div style={{ color: '#34d399', fontSize: '0.75rem' }}>W02 · Rigid Plastic · 94% confidence</div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                    {[
                                        { label: 'Weight', value: '2.3 kg', icon: '⚖️' },
                                        { label: 'CO₂e', value: '4.3 kg', icon: '🌿' },
                                        { label: 'Value', value: '₹29.90', icon: '💰' },
                                    ].map(s => (
                                        <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 8px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '1rem', marginBottom: '4px' }}>{s.icon}</div>
                                            <div style={{ color: '#fff', fontWeight: '700', fontSize: '0.8rem' }}>{s.value}</div>
                                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── LIVE STATS BAR ─────────────────────────────────── */}
            <div ref={statsRef} style={{
                background: '#fff',
                borderBottom: '1px solid #e2e8f0',
                padding: '2rem 0',
            }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                        {[
                            { value: users,   suffix: '+', label: 'Citizens Joined',   color: '#10b981', icon: 'fa-users' },
                            { value: reports, suffix: '+', label: 'Waste Reports',     color: '#f59e0b', icon: 'fa-flag' },
                            { value: cities,  suffix: '',  label: 'Cities Active',     color: '#3b82f6', icon: 'fa-city' },
                        ].map(s => (
                            <div key={s.label} style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: '1rem' }} />
                                    <span style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: '900', fontFamily: "'Outfit', sans-serif", color: '#0f172a' }}>
                                        {s.value.toLocaleString()}{s.suffix}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── HOW IT WORKS ───────────────────────────────────── */}
            <section style={{ padding: '5rem 0', background: '#f8fafc' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <span style={{ background: '#d1fae5', color: '#065f46', fontWeight: '700', fontSize: '0.78rem', padding: '5px 14px', borderRadius: '99px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Simple 4-Step Process</span>
                        <h2 style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>How MIBA Works</h2>
                        <p style={{ color: '#64748b', maxWidth: '520px', margin: '0 auto' }}>From spotting waste to earning credits — our AI handles the heavy lifting.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { step: '01', icon: 'fa-camera',    color: '#10b981', bg: '#d1fae5', title: 'Spot & Shoot',    desc: 'See waste anywhere? Open the app, point your camera, take a photo.' },
                            { step: '02', icon: 'fa-robot',     color: '#f59e0b', bg: '#fef3c7', title: 'AI Identifies',   desc: 'Our model detects waste type, severity, weight & CO₂e in seconds.' },
                            { step: '03', icon: 'fa-award',     color: '#8b5cf6', bg: '#ede9fe', title: 'Earn Credits',    desc: 'Receive MIBA tokens instantly for every verified waste report.' },
                            { step: '04', icon: 'fa-leaf',      color: '#059669', bg: '#ecfdf5', title: 'Track Impact',    desc: 'See real ₹ value, carbon saved & leaderboard rank on your dashboard.' },
                        ].map(s => (
                            <div key={s.step} style={{
                                background: '#fff', borderRadius: '20px', padding: '2rem 1.5rem',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'default',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: '1.3rem' }} />
                                    </div>
                                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: '900', color: '#e2e8f0' }}>{s.step}</span>
                                </div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0f172a' }}>{s.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── IMPACT STRIP ───────────────────────────────────── */}
            <section style={{ padding: '5rem 0', background: '#fff' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { icon: 'fa-recycle',      color: '#10b981', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', title: 'Recyclable Detection',  desc: 'Plastic, metal, paper & e-waste automatically routed to the right facility.' },
                            { icon: 'fa-rupee-sign',   color: '#f59e0b', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', title: 'Real ₹ Value Shown',    desc: 'Scrap market rates + token credits + carbon ₹ — displayed right after scan.' },
                            { icon: 'fa-shield-halved',color: '#3b82f6', bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', title: 'Verified & Transparent', desc: 'Every report logged on-chain. Municipal teams assigned via supervisor AI.' },
                        ].map(c => (
                            <div key={c.title} style={{ borderRadius: '20px', padding: '2rem', background: c.bg }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <i className={`fa-solid ${c.icon}`} style={{ color: c.color, fontSize: '1.2rem' }} />
                                </div>
                                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: '#0f172a' }}>{c.title}</h3>
                                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────── */}
            <section style={{
                background: 'linear-gradient(135deg, #022c22 0%, #064e3b 60%, #065f46 100%)',
                padding: '5rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div className="container" style={{ position: 'relative' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '99px', padding: '6px 16px', fontSize: '0.78rem', fontWeight: '700', color: '#6ee7b7', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                        <i className="fa-solid fa-sparkles" /> Free to Join
                    </div>
                    <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>India ki safai — aapke haath mein.</h2>
                    <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '500px', margin: '0 auto 2.5rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
                        Join the movement. Every photo you take moves us closer to a cleaner nation.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: '#fff', fontWeight: '700', fontSize: '1rem',
                            padding: '14px 32px', borderRadius: '12px',
                            boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
                            textDecoration: 'none',
                        }}>
                            <i className="fa-solid fa-user-plus" /> Register Free
                        </Link>
                        <Link to="/report" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
                            color: '#fff', fontWeight: '600', fontSize: '1rem',
                            padding: '14px 32px', borderRadius: '12px',
                            backdropFilter: 'blur(8px)', textDecoration: 'none',
                        }}>
                            <i className="fa-solid fa-camera" /> Report Now
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
