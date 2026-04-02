import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{ background: 'var(--dark)', color: 'var(--white)', padding: 'var(--space-12) 0 var(--space-6)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <div className="logo" style={{ color: 'var(--white)', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                        MIBA
                    </div>
                    <p style={{ opacity: 0.6, maxWidth: '500px', margin: '0 auto var(--space-6)', fontSize: '0.9375rem' }}>
                        Empowering citizens to build a cleaner, greener, and more vibrant nation through community action and AI technology.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {['Home', 'About', 'Report', 'Dashboard', 'Register'].map(link => (
                            <Link key={link} to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.875rem', fontWeight: '500', opacity: 0.8 }}>
                                {link}
                            </Link>
                        ))}
                    </div>
                </div>
                <div style={{ borderTop: '1px solid var(--gray-800)', paddingTop: 'var(--space-6)', opacity: 0.4, fontSize: '0.75rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <span>&copy; 2026 Make India Beautiful Again. Built with ❤️ for Bharat.</span>
                    <span style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '15px' }}>v{import.meta.env.VITE_APP_VERSION || '1.0.0'}</span>
                </div>
            </div>
        </footer>
    );
}
