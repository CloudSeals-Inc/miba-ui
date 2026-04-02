import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveUserSession, getUserSession, API_BASE_URL } from '../utils/storage';

export default function Register() {
    const navigate = useNavigate();
    const [name, setName]   = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole]   = useState('citizen');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (getUserSession()) navigate('/dashboard');
        const params = new URLSearchParams(window.location.search);
        const pre = params.get('phone');
        if (pre) setPhone(pre);
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (!name || !phone || !email) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, email, role }),
            });
            const data = await response.json();
            if (response.ok) {
                saveUserSession(data);
                window.dispatchEvent(new Event('miba_state_change'));
                setTimeout(() => navigate(role === 'collector' ? '/collector' : '/report'), 800);
            } else {
                setError(data.detail || 'Registration failed');
            }
        } catch {
            setError('Network error. Check if backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const roles = [
        { id: 'citizen',   icon: 'fa-user',        label: 'Citizen',   desc: 'Report waste & earn tokens' },
        { id: 'collector', icon: 'fa-truck-pickup', label: 'Collector', desc: 'Accept pickups & verify waste' },
    ];

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)',
            position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
                <div style={{
                    width: '100%', maxWidth: '440px',
                    background: 'rgba(255,255,255,0.97)',
                    borderRadius: '24px', padding: '2.5rem 2rem',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: '900', color: '#065f46', letterSpacing: '-0.02em' }}>
                                MIBA<span style={{ color: '#f59e0b' }}>.</span>
                            </div>
                        </Link>
                        <p style={{ color: '#64748b', marginTop: '6px', fontSize: '0.95rem' }}>Join the movement — create your account</p>
                    </div>

                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 14px', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-circle-exclamation" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        {/* Role picker */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#374151', marginBottom: '8px' }}>I am a</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {roles.map(r => (
                                    <button key={r.id} type="button" onClick={() => setRole(r.id)} style={{
                                        padding: '12px 10px', borderRadius: '12px', cursor: 'pointer',
                                        border: role === r.id ? '2px solid #10b981' : '1.5px solid #e2e8f0',
                                        background: role === r.id ? '#ecfdf5' : '#f8fafc',
                                        transition: 'all 0.15s', textAlign: 'center',
                                    }}>
                                        <i className={`fa-solid ${r.icon}`} style={{ color: role === r.id ? '#10b981' : '#94a3b8', fontSize: '1.2rem', display: 'block', marginBottom: '4px' }} />
                                        <div style={{ fontWeight: '700', fontSize: '0.85rem', color: role === r.id ? '#065f46' : '#374151' }}>{r.label}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{r.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Fields */}
                        {[
                            { label: 'Full Name',    icon: 'fa-user',         type: 'text',  val: name,  set: setName,  placeholder: 'Rajesh Kumar' },
                            { label: 'Phone Number', icon: 'fa-phone',        type: 'tel',   val: phone, set: v => setPhone(v.replace(/\D/g,'').slice(0,10)), placeholder: '98XXXXXXXX' },
                            { label: 'Email ID',     icon: 'fa-envelope',     type: 'email', val: email, set: setEmail, placeholder: 'rajesh@gmail.com' },
                        ].map(f => (
                            <div key={f.label} style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#374151', marginBottom: '6px' }}>
                                    <i className={`fa-solid ${f.icon}`} style={{ color: '#10b981', marginRight: '6px' }} />{f.label}
                                </label>
                                <input
                                    type={f.type}
                                    value={f.val}
                                    onChange={e => f.set(e.target.value)}
                                    placeholder={f.placeholder}
                                    required
                                    style={{ width: '100%', padding: '13px 14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', background: '#f8fafc', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                                    onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                                background: isLoading ? '#6ee7b7' : 'linear-gradient(135deg, #10b981, #059669)',
                                color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: isLoading ? 'not-allowed' : 'pointer',
                                boxShadow: isLoading ? 'none' : '0 6px 20px rgba(16,185,129,0.35)',
                                marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(16,185,129,0.45)'; } }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = isLoading ? 'none' : '0 6px 20px rgba(16,185,129,0.35)'; }}>
                            {isLoading ? <><i className="fa-solid fa-spinner fa-spin" /> Creating Account...</> : <><i className="fa-solid fa-user-plus" /> Create Account</>}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: '#10b981', fontWeight: '700', textDecoration: 'none' }}>Login</Link>
                        </p>
                    </div>

                    <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1rem', color: '#94a3b8', fontSize: '0.82rem', textDecoration: 'none' }}>
                        <i className="fa-solid fa-arrow-left" /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
