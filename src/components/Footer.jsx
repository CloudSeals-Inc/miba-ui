import { Link } from 'react-router-dom';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer style={{ background: 'var(--white)', color: 'var(--gray-800)', borderTop: '1px solid var(--gray-200)' }}>
            {/* Main footer */}
            <div className="container" style={{ padding: '4rem 1rem 3rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '3rem', marginBottom: '3rem' }}>

                    {/* Brand */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>
                                MIBA<span style={{ color: 'var(--secondary)' }}>.</span>
                            </span>
                        </Link>
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: '240px' }}>
                            AI-powered waste management platform turning India's waste crisis into an economic opportunity.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {[
                                { icon: 'fa-brands fa-twitter',  href: '#' },
                                { icon: 'fa-brands fa-linkedin', href: '#' },
                                { icon: 'fa-brands fa-github',   href: '#' },
                            ].map(s => (
                                <a key={s.icon} href={s.href} style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--gray-100)', border: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-500)'; e.currentTarget.style.borderColor = 'var(--gray-200)'; }}>
                                    <i className={s.icon} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Platform</p>
                        {[
                            { to: '/report',       label: 'Report Waste' },
                            { to: '/dashboard',    label: 'Citizen Dashboard' },
                            { to: '/collector',    label: 'Collector Portal' },
                            { to: '/ai-insights',  label: 'AI Insights' },
                            { to: '/how-it-works', label: 'How It Works' },
                        ].map(l => (
                            <Link key={l.to} to={l.to} style={{ display: 'block', fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-600)'}>
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Company */}
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Company</p>
                        {[
                            { to: '/about',   label: 'About MIBA' },
                            { to: '/contact', label: 'Contact Us' },
                        ].map(l => (
                            <Link key={l.to} to={l.to} style={{ display: 'block', fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-600)'}>
                                {l.label}
                            </Link>
                        ))}
                    </div>

                </div>

                {/* Bottom bar */}
                <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>
                        © {year} Make India Beautiful Again · MIBAKI IP · Project Swachh-AI · Built for Bharat 🇮🇳
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['Privacy Policy', 'Terms of Use'].map(t => (
                            <span key={t} style={{ fontSize: '0.78rem', color: 'var(--gray-400)', cursor: 'default' }}>{t}</span>
                        ))}
                        <span style={{ fontSize: '0.78rem', color: 'var(--gray-300)', fontFamily: 'monospace' }}>
                            v{import.meta.env.VITE_APP_VERSION || '1.3.0'}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
