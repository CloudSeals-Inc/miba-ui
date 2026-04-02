import { Link, useNavigate } from 'react-router-dom';
import { getUserSession, logoutUser, getReports, calculateUserStats } from '../utils/storage';
import { useState, useEffect } from 'react';

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ reportsCompiled: 0, credits: 0 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const checkSession = async () => {
        const session = getUserSession();
        setUser(session);
        if (session) {
            const currentReports = await getReports();
            setStats(calculateUserStats(session.phone, currentReports));
        }
    };

    useEffect(() => {
        checkSession();
        window.addEventListener('miba_state_change', checkSession);

        const handleClickOutside = (event) => {
            if (isProfileOpen && !event.target.closest('.profile-trigger')) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('miba_state_change', checkSession);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileOpen]);

    const handleLogout = () => {
        logoutUser();
        setUser(null);
        window.dispatchEvent(new Event('miba_state_change'));
        setIsMenuOpen(false);
        navigate('/');
    };

    return (
        <header style={{ height: '70px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
            <div className="container" style={{ height: '100%' }}>
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', gap: '10px' }}>
                    <Link to="/" className="logo" style={{ fontSize: '1.25rem', minWidth: 'fit-content' }}>
                        MIBA
                    </Link>

                    {/* Navigation - Visible even on smaller screens if they fit, or hidden behind menu */}
                    <div className="desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {/* Essential Links */}
                        <div className="hidden-mobile" style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', fontWeight: '500' }}>
                            <Link to="/">Home</Link>
                            <Link to="/about">About</Link>
                            <Link to="/ai-insights" style={{ color: 'var(--dark)', fontWeight: '500' }}><i className="fa-solid fa-sparkles"></i> AI Insights</Link>
                            <Link to="/how-it-works">How It Works</Link>
                            <Link to="/contact">Contact</Link>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {user ? (
                                <div className="profile-trigger" style={{ position: 'relative' }}>
                                    <button 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--gray-50)', padding: '4px 10px', borderRadius: '30px', border: '1px solid #eee', cursor: 'pointer' }}
                                    >
                                        <div style={{ width: '28px', height: '28px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800' }}>
                                            {user?.name?.[0] || '?'}{user?.name?.split(' ')[1]?.[0] || user?.name?.[1]?.toUpperCase() || ''}
                                        </div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-700)' }} className="hidden-mobile">
                                            {user?.name?.split(' ')[0] || 'User'} <i className={`fa-solid fa-chevron-${isProfileOpen ? 'up' : 'down'}`} style={{ fontSize: '0.6rem', marginLeft: '2px' }}></i>
                                        </span>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="card animate-fade" style={{ 
                                            position: 'absolute', 
                                            top: '100%', 
                                            right: 0, 
                                            marginTop: '12px', 
                                            minWidth: '260px', 
                                            zIndex: 1000, 
                                            boxShadow: 'var(--shadow-lg)', 
                                            padding: '0', 
                                            border: '1px solid #eee',
                                            overflow: 'hidden',
                                            borderRadius: '16px'
                                        }}>
                                            {/* Profile Header Block */}
                                            <div style={{ 
                                                padding: 'var(--space-5) var(--space-4)', 
                                                background: 'linear-gradient(135deg, var(--primary-light), #fff)',
                                                borderBottom: '1px solid #f0f0f0',
                                                textAlign: 'center'
                                            }}>
                                                <div style={{ 
                                                    width: '50px', 
                                                    height: '50px', 
                                                    background: 'var(--primary)', 
                                                    color: 'white', 
                                                    borderRadius: '50%', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    fontSize: '1.2rem', 
                                                    fontWeight: '800',
                                                    margin: '0 auto var(--space-2) auto',
                                                    boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
                                                }}>
                                                    {user?.name?.[0] || '?'}{user?.name?.split(' ')[1]?.[0] || user?.name?.[1]?.toUpperCase() || ''}
                                                </div>
                                                <p style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--gray-900)', marginBottom: '4px' }}>{user?.name || 'User'}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: '500' }}>{user?.phone || ''}</p>
                                                
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Reports</p>
                                                        <p style={{ fontWeight: '800', color: 'var(--primary)' }}>{stats.reportsCompiled}</p>
                                                    </div>
                                                    <div style={{ width: '1px', background: '#e0e0e0', height: '20px', alignSelf: 'center' }}></div>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Credits</p>
                                                        <p style={{ fontWeight: '800', color: '#b45309' }}>{stats.credits}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Links */}
                                            <div style={{ padding: 'var(--space-2)' }}>
                                                <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', padding: '12px var(--space-3)', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-700)' }} className="btn-hover-gray">
                                                    <i className="fa-solid fa-gauge" style={{ width: '24px', marginRight: '8px', color: 'var(--primary)', opacity: 0.8 }}></i> Citizen Dashboard
                                                </Link>
                                                <Link to="/collector" onClick={() => setIsProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', padding: '12px var(--space-3)', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-700)' }} className="btn-hover-gray">
                                                    <i className="fa-solid fa-truck-pickup" style={{ width: '24px', marginRight: '8px', color: '#059669', opacity: 0.8 }}></i> Collector Portal
                                                </Link>
                                                <Link to="/report" onClick={() => setIsProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', padding: '12px var(--space-3)', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-700)' }} className="btn-hover-gray">
                                                    <i className="fa-solid fa-plus-circle" style={{ width: '24px', marginRight: '8px', color: '#d97706', opacity: 0.8 }}></i> Report New Issue
                                                </Link>
                                            </div>

                                            {/* Logout Section - Distinct at the bottom */}
                                            <div style={{ padding: 'var(--space-2)', borderTop: '1px solid #f5f5f5', background: '#fafafa' }}>
                                                <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '12px var(--space-3)', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700', color: '#dc2626', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }} className="btn-hover-red">
                                                    <i className="fa-solid fa-right-from-bracket" style={{ width: '24px', marginRight: '8px', opacity: 0.9 }}></i> Logout Account
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-outline" style={{ height: '36px', minHeight: '36px', padding: '0 15px', fontSize: '0.8rem', marginRight: '5px' }}>LOGIN</Link>
                                    <Link to="/register" className="btn btn-primary" style={{ height: '36px', minHeight: '36px', padding: '0 15px', fontSize: '0.8rem' }}>JOIN NOW</Link>
                                </>
                            )}
                        </div>
                        
                        {/* Hamburger for the rest of mobile experience */}
                        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ padding: '5px' }}>
                             <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`} style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}></i>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Nav Overlay */}
            {isMenuOpen && (
                <div className="animate-fade" style={{ position: 'fixed', top: '70px', left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.98)', zIndex: 2000, padding: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
                        <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: '700' }}>Home</Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: '700' }}>About</Link>
                        <Link to="/how-it-works" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: '700' }}>How It Works</Link>
                        <Link to="/report" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>Report Issue</Link>
                        {user && (
                            <>
                                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: '700' }}>Citizen Dashboard</Link>
                                <Link to="/collector" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: '700' }}>Collector Dashboard</Link>
                                <button onClick={handleLogout} className="btn btn-outline" style={{ marginTop: '20px' }}>Logout</button>
                            </>
                        )}
                    </div>
                </div>
            )}
            
            <style>{`
                @media (max-width: 900px) {
                    .hidden-mobile { display: none !important; }
                }
                @media (min-width: 901px) {
                    .menu-toggle { display: none !important; }
                }
            `}</style>
        </header>
    );
}
