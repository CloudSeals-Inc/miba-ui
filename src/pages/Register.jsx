import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveUserSession, getUserSession, API_BASE_URL } from '../utils/storage';

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('citizen'); // 'citizen' or 'collector'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (getUserSession()) {
            navigate('/dashboard');
        }
        
        const params = new URLSearchParams(window.location.search);
        const prefilledPhone = params.get('phone');
        if (prefilledPhone) {
            setPhone(prefilledPhone);
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (name && phone && email) {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, email, role })
                });
                const data = await response.json();
                if (response.ok) {
                    saveUserSession(data);
                    window.dispatchEvent(new Event('miba_state_change'));
                    setTimeout(() => {
                        navigate(role === 'collector' ? '/collector' : '/report');
                    }, 800);
                } else {
                    setError(data.detail || 'Registration failed');
                }
            } catch (err) {
                setError('Network error. Check if backend is running.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="page-container animate-fade" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh', background: 'var(--gray-100)' }}>
            <div className="container" style={{ maxWidth: '450px' }}>
                <div className="card">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                        <Link to="/" className="logo" style={{ marginBottom: 'var(--space-2)', display: 'inline-flex' }}>
                            MIBA
                        </Link>
                        <p style={{ color: 'var(--gray-600)' }}>Join the movement to beautify India</p>
                    </div>

                    {error && (
                        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.875rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="grid grid-cols-1">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10 Digit Number" pattern="[0-9]{10}" required />
                        </div>

                        <div className="form-group">
                            <label>Email ID</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                <button type="button" onClick={() => setRole('citizen')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: role === 'citizen' ? '2px solid var(--primary)' : '1px solid #ddd', background: role === 'citizen' ? 'var(--primary-light)' : 'white', fontWeight: 'bold' }}>
                                    Citizen
                                </button>
                                <button type="button" onClick={() => setRole('collector')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: role === 'collector' ? '2px solid var(--primary)' : '1px solid #ddd', background: role === 'collector' ? 'var(--primary-light)' : 'white', fontWeight: 'bold' }}>
                                    Collector
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: 'var(--space-6)' }}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Login</Link>
                        </p>
                    </div>
                </div>
                
                <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                    <i className="fa-solid fa-arrow-left"></i> Back to Home
                </Link>
            </div>
        </div>
    );
}
