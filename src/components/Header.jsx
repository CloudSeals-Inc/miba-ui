import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUserSession, logoutUser, getReports, calculateUserStats, isMobileDevice } from '../utils/storage';
import { useState, useEffect } from 'react';

export default function Header() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const [user, setUser]         = useState(null);
    const [stats, setStats]       = useState({ reportsCompiled: 0, credits: 0 });
    const [isMenuOpen, setMenuOpen]     = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const checkSession = async () => {
        const session = getUserSession();
        setUser(session);
        if (session) {
            const r = await getReports();
            setStats(calculateUserStats(session.phone, r));
        }
    };

    useEffect(() => {
        checkSession();
        window.addEventListener('miba_state_change', checkSession);
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        const onClickOutside = (e) => { if (!e.target.closest('.profile-trigger')) setProfileOpen(false); };
        document.addEventListener('mousedown', onClickOutside);
        return () => {
            window.removeEventListener('miba_state_change', checkSession);
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('mousedown', onClickOutside);
        };
    }, []);

    // Close menu on route change
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const handleLogout = () => {
        logoutUser();
        setUser(null);
        window.dispatchEvent(new Event('miba_state_change'));
        navigate('/');
    };

    const navLinks = [
        { to: '/',            label: 'Home' },
        { to: '/about',       label: 'About' },
        { to: '/how-it-works',label: 'How It Works' },
        { to: '/ai-insights', label: 'AI Insights' },
        { to: '/contact',     label: 'Contact' },
    ];

    const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

    return (
        <>
            <header style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                height: '68px',
                background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid rgba(226,232,240,0.6)',
                transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
                boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.07)' : 'none',
            }}>
                <div className="container" style={{ height: '100%' }}>
                    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>

                        {/* Logo */}
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.4rem', fontWeight: '900', color: '#065f46', letterSpacing: '-0.02em' }}>
                                MIBA
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="desk-nav" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            {navLinks.map(l => (
                                <Link key={l.to} to={l.to} style={{
                                    padding: '6px 13px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: isActive(l.to) ? '700' : '500',
                                    color: isActive(l.to) ? '#065f46' : '#475569',
                                    background: isActive(l.to) ? '#d1fae5' : 'transparent',
                                    textDecoration: 'none', transition: 'all 0.15s',
                                }}
                                    onMouseEnter={e => { if (!isActive(l.to)) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; } }}
                                    onMouseLeave={e => { if (!isActive(l.to)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; } }}>
                                    {l.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right — CTA + Profile */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isMobileDevice() && (
                                <Link to="/report" className="desk-nav" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    background: 'linear-gradient(135deg,#10b981,#059669)',
                                    color: '#fff', fontWeight: '700', fontSize: '0.82rem',
                                    padding: '8px 16px', borderRadius: '9px',
                                    boxShadow: '0 4px 12px rgba(16,185,129,0.35)',
                                    textDecoration: 'none', transition: 'transform 0.15s, box-shadow 0.15s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(16,185,129,0.45)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.35)'; }}>
                                    <i className="fa-solid fa-camera" /> Report
                                </Link>
                            )}

                            {user ? (
                                <div className="profile-trigger" style={{ position: 'relative' }}>
                                    <button onClick={() => setProfileOpen(!isProfileOpen)} style={{
                                        display: 'flex', alignItems: 'center', gap: '7px',
                                        background: '#f1f5f9', border: '1px solid #e2e8f0',
                                        borderRadius: '99px', padding: '4px 12px 4px 4px',
                                        cursor: 'pointer', transition: 'background 0.15s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#065f46)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0 }}>
                                            {(user?.name?.[0] || '?')}{user?.name?.split(' ')[1]?.[0] || ''}
                                        </div>
                                        <span className="desk-nav" style={{ fontSize: '0.82rem', fontWeight: '600', color: '#374151' }}>
                                            {user?.name?.split(' ')[0] || 'User'}
                                        </span>
                                        <i className={`fa-solid fa-chevron-${isProfileOpen ? 'up' : 'down'}`} style={{ fontSize: '0.6rem', color: '#94a3b8' }} />
                                    </button>

                                    {isProfileOpen && (
                                        <div style={{
                                            position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                                            width: '270px', background: '#fff',
                                            borderRadius: '18px', border: '1px solid #e2e8f0',
                                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                            overflow: 'hidden', zIndex: 1001,
                                            animation: 'fadeDropIn 0.18s ease-out',
                                        }}>
                                            {/* Profile card */}
                                            <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg,#ecfdf5,#fff)', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                                                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#065f46)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '800', margin: '0 auto 8px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                                                    {(user?.name?.[0] || '?')}{user?.name?.split(' ')[1]?.[0] || ''}
                                                </div>
                                                <p style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a', marginBottom: '2px' }}>{user?.name || 'User'}</p>
                                                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{user?.phone || ''}</p>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '12px' }}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <p style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Reports</p>
                                                        <p style={{ fontWeight: '900', color: '#10b981', fontSize: '1.1rem' }}>{stats.reportsCompiled}</p>
                                                    </div>
                                                    <div style={{ width: '1px', background: '#e2e8f0' }} />
                                                    <div style={{ textAlign: 'center' }}>
                                                        <p style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Credits</p>
                                                        <p style={{ fontWeight: '900', color: '#f59e0b', fontSize: '1.1rem' }}>{stats.credits}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Links */}
                                            <div style={{ padding: '8px' }}>
                                                {[
                                                    { to: '/dashboard', icon: 'fa-gauge',       color: '#10b981', label: 'My Dashboard' },
                                                    { to: '/collector', icon: 'fa-truck-pickup', color: '#059669', label: 'Collector Portal' },
                                                    { to: '/report',    icon: 'fa-camera',       color: '#f59e0b', label: 'Report Waste' },
                                                ].filter(l => l.to !== '/report' || isMobileDevice()).map(l => (
                                                    <Link key={l.to} to={l.to} onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', color: '#374151', textDecoration: 'none', transition: 'background 0.12s' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                        <i className={`fa-solid ${l.icon}`} style={{ color: l.color, width: '18px', textAlign: 'center' }} />
                                                        {l.label}
                                                    </Link>
                                                ))}
                                            </div>
                                            <div style={{ padding: '8px', borderTop: '1px solid #f1f5f9' }}>
                                                <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.12s' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    <i className="fa-solid fa-right-from-bracket" style={{ width: '18px', textAlign: 'center' }} /> Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="desk-nav" style={{ display: 'flex', gap: '6px' }}>
                                    <Link to="/login" style={{ padding: '8px 14px', borderRadius: '9px', fontSize: '0.82rem', fontWeight: '600', color: '#374151', border: '1px solid #e2e8f0', textDecoration: 'none', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Login</Link>
                                    <Link to="/register" style={{ padding: '8px 14px', borderRadius: '9px', fontSize: '0.82rem', fontWeight: '700', color: '#fff', background: '#0f172a', textDecoration: 'none', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}>Get Started</Link>
                                </div>
                            )}

                            {/* Hamburger */}
                            <button className="mob-menu" onClick={() => setMenuOpen(!isMenuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', color: '#374151', fontSize: '1.1rem', display: 'none' }}>
                                <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`} />
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div style={{ position: 'fixed', top: '68px', left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 999, padding: '1.5rem', overflowY: 'auto', animation: 'fadeIn 0.2s ease-out' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1.5rem' }}>
                        {navLinks.map(l => (
                            <Link key={l.to} to={l.to} style={{ padding: '14px 16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600', color: isActive(l.to) ? '#065f46' : '#374151', background: isActive(l.to) ? '#d1fae5' : 'transparent', textDecoration: 'none' }}>
                                {l.label}
                            </Link>
                        ))}
                        <Link to="/report" style={{ padding: '14px 16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '700', color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-camera" /> Report Waste
                        </Link>
                    </div>
                    {user ? (
                        <div>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '14px', marginBottom: '8px' }}>
                                <p style={{ fontWeight: '700', color: '#0f172a' }}>{user.name}</p>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{user.phone}</p>
                            </div>
                            <Link to="/dashboard" style={{ display: 'block', padding: '14px 16px', fontSize: '1rem', fontWeight: '600', color: '#374151', textDecoration: 'none' }}>My Dashboard</Link>
                            <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '14px 16px', fontSize: '1rem', fontWeight: '700', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Sign Out</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                            <Link to="/login" style={{ padding: '14px', borderRadius: '12px', fontWeight: '600', color: '#374151', border: '1px solid #e2e8f0', textAlign: 'center', textDecoration: 'none' }}>Login</Link>
                            <Link to="/register" style={{ padding: '14px', borderRadius: '12px', fontWeight: '700', color: '#fff', background: 'linear-gradient(135deg,#10b981,#059669)', textAlign: 'center', textDecoration: 'none' }}>Get Started Free</Link>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @media (max-width: 900px) {
                    .desk-nav { display: none !important; }
                    .mob-menu { display: flex !important; }
                }
                @keyframes fadeDropIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}
