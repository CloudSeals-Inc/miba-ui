import { Link } from 'react-router-dom';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer style={{ background: '#020d07', color: '#fff' }}>
            {/* Main footer */}
            <div className="container" style={{ padding: '4rem 1rem 3rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '3rem', marginBottom: '3rem' }}>

                    {/* Brand */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'linear-gradient(135deg,#10b981,#065f46)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <i className="fa-solid fa-leaf" style={{ color: '#fff', fontSize: '0.9rem' }} />
                            </div>
                            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' }}>
                                MIBA<span style={{ color: '#f59e0b' }}>.</span>
                            </span>
                        </Link>
                        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: '240px' }}>
                            AI-powered waste management platform turning India's waste crisis into an economic opportunity.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {[
                                { icon: 'fa-brands fa-twitter',  href: '#' },
                                { icon: 'fa-brands fa-linkedin', href: '#' },
                                { icon: 'fa-brands fa-github',   href: '#' },
                            ].map(s => (
                                <a key={s.icon} href={s.href} style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textDecoration: 'none', transition: 'background 0.15s, color 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.2)'; e.currentTarget.style.color = '#34d399'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
                                    <i className={s.icon} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Platform</p>
                        {[
                            { to: '/report',       label: 'Report Waste' },
                            { to: '/dashboard',    label: 'Citizen Dashboard' },
                            { to: '/collector',    label: 'Collector Portal' },
                            { to: '/ai-insights',  label: 'AI Insights' },
                            { to: '/how-it-works', label: 'How It Works' },
                        ].map(l => (
                            <Link key={l.to} to={l.to} style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Company */}
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Company</p>
                        {[
                            { to: '/about',   label: 'About MIBA' },
                            { to: '/contact', label: 'Contact Us' },
                        ].map(l => (
                            <Link key={l.to} to={l.to} style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Tech stack */}
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Technology</p>
                        {['YOLOv9 Detection', 'EfficientNet-B3', 'Gemini 1.5 Flash', 'Vertex AI', 'Google Cloud Run', 'MongoDB Atlas', 'IndicWaste Taxonomy'].map(t => (
                            <p key={t} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.38)', marginBottom: '8px', lineHeight: 1.4 }}>
                                <i className="fa-solid fa-microchip" style={{ color: '#34d399', marginRight: '7px', fontSize: '0.7rem' }} />{t}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
                        © {year} Make India Beautiful Again · MIBAKI IP · Project Swachh-AI · Built for Bharat 🇮🇳
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['Privacy Policy', 'Terms of Use'].map(t => (
                            <span key={t} style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)', cursor: 'default' }}>{t}</span>
                        ))}
                        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
                            v{import.meta.env.VITE_APP_VERSION || '1.3.0'}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
