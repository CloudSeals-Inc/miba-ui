import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveUserSession, getUserSession, API_BASE_URL } from '../utils/storage';

export default function Login() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (getUserSession()) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (phone.length === 10) {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    saveUserSession(data);
                    window.dispatchEvent(new Event('miba_state_change'));
                    navigate('/dashboard');
                } else {
                    // User not found! Redirect to register with phone pre-filled
                    setError(data.detail || 'User not found. Please register.');
                    if (response.status === 404) {
                        setTimeout(() => {
                            navigate(`/register?phone=${phone}`);
                        }, 2000);
                    }
                }
            } catch (err) {
                console.error("Login check failed:", err);
                setError('Something went wrong. Please check your connection.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setError('Please enter a valid 10-digit phone number.');
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
                        <p style={{ color: 'var(--gray-600)' }}>Welcome back to MIBA</p>
                    </div>

                    {error && (
                        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.875rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input 
                                type="tel" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                placeholder="10 Digit Number" 
                                pattern="[0-9]{10}" 
                                required 
                                autoFocus
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: 'var(--space-6)' }}>
                            {isLoading ? 'Checking...' : 'Continue'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>Register Now</Link>
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
