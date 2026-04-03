import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveUserSession, getUserSession, API_BASE_URL } from '../utils/storage';

export default function Login() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (getUserSession()) navigate('/dashboard');
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (phone.length !== 10) { setError('Please enter a valid 10-digit phone number.'); return; }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });
            const data = await response.json();
            if (response.ok) {
                saveUserSession(data);
                window.dispatchEvent(new Event('miba_state_change'));
                navigate('/dashboard');
            } else {
                setError(data.detail || 'User not found. Please register.');
                if (response.status === 404) setTimeout(() => navigate(`/register?phone=${phone}`), 2000);
            }
        } catch {
            setError('Something went wrong. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* bg blobs */}
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
                <div style={{
                    width: '100%', maxWidth: '420px',
                    background: 'rgba(255,255,255,0.97)',
                    borderRadius: '24px', padding: '2.5rem 2rem',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
                }}>
                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: '900', color: '#065f46', letterSpacing: '-0.02em' }}>
                                MIBA
                            </div>
                        </Link>
                        <p style={{ color: '#64748b', marginTop: '6px', fontSize: '0.95rem' }}>Welcome back — log in to continue</p>
                    </div>

                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 14px', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-circle-exclamation" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#374151', marginBottom: '6px' }}>
                                <i className="fa-solid fa-phone" style={{ color: '#10b981', marginRight: '6px' }} />Phone Number
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>+91</span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="98XXXXXXXX"
                                    required
                                    autoFocus
                                    style={{ width: '100%', padding: '13px 14px 13px 48px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', background: '#f8fafc' }}
                                    onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                                background: isLoading ? '#6ee7b7' : 'linear-gradient(135deg, #10b981, #059669)',
                                color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: isLoading ? 'not-allowed' : 'pointer',
                                boxShadow: isLoading ? 'none' : '0 6px 20px rgba(16,185,129,0.35)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}
                            onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(16,185,129,0.45)'; } }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = isLoading ? 'none' : '0 6px 20px rgba(16,185,129,0.35)'; }}>
                            {isLoading ? <><i className="fa-solid fa-spinner fa-spin" /> Checking...</> : <><i className="fa-solid fa-arrow-right-to-bracket" /> Continue</>}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                            New to MIBA?{' '}
                            <Link to="/register" style={{ color: '#10b981', fontWeight: '700', textDecoration: 'none' }}>Create Account</Link>
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
