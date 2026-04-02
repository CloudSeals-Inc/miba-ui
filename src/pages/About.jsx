import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="page-container animate-fade">
            <section className="container" style={{ padding: 'var(--space-12) var(--space-4)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>About MIBA</h1>
                    <p style={{ color: 'var(--gray-600)', maxWidth: '600px', margin: '0 auto' }}>Restoring India's Natural Beauty, One Street At A Time.</p>
                </div>

                {/* Section 1: Empowering Citizens */}
                <div className="grid grid-cols-1 grid-cols-2" style={{ alignItems: 'center', marginBottom: 'var(--space-16)' }}>
                    <div style={{ order: 2 }}>
                        <img 
                            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                            alt="Cleanup Mission" 
                            style={{ borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)' }}
                        />
                    </div>
                    <div style={{ order: 1 }}>
                        <span className="pill-success" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>Who We Are</span>
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>Empowering Citizens. <br /><span style={{ color: 'var(--primary)' }}>Cleaning India.</span></h2>
                        <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-6)' }}>
                            <strong>Make India Beautiful Again (MIBA)</strong> is a national grassroots organization dedicated to eliminating illegal dumping and littering across all communities.
                        </p>
                        <div className="grid grid-cols-2">
                            <div>
                                <i className="fa-solid fa-handshake-angle" style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: 'var(--space-2)' }}></i>
                                <h4 style={{ fontSize: '0.875rem' }}>Community Driven</h4>
                            </div>
                            <div>
                                <i className="fa-solid fa-leaf" style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}></i>
                                <h4 style={{ fontSize: '0.875rem' }}>Sustainable Focus</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Technology */}
                <div className="grid grid-cols-1 grid-cols-2" style={{ alignItems: 'center', marginBottom: 'var(--space-16)' }}>
                    <div>
                        <span className="pill-warning" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>Innovation</span>
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>Powered by <span style={{ color: 'var(--secondary)' }}>Vision AI</span></h2>
                        <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-6)' }}>
                            We leverage state-of-the-art **Gemini 2.0 Flash** to automatically screen every report. Our system identifies waste—from plastic to hazardous debris—instantly.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <i className="fa-solid fa-check" style={{ color: 'var(--success)' }}></i> 
                                <span style={{ fontSize: '0.9375rem' }}>Instant Categorization</span>
                            </li>
                            <li style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <i className="fa-solid fa-check" style={{ color: 'var(--success)' }}></i> 
                                <span style={{ fontSize: '0.9375rem' }}>Priority Action Flagging</span>
                            </li>
                        </ul>
                    </div>
                    <div className="card" style={{ background: 'var(--dark)', color: 'var(--white)', padding: 'var(--space-8)' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            <p style={{ color: 'var(--info)' }}>{'>'} Initializing Vision API...</p>
                            <p style={{ color: 'var(--success)' }}>[OK] Detection Active</p>
                            <p style={{ marginTop: '20px' }}>Analyzing image data...</p>
                            <div style={{ border: '1px solid var(--gray-700)', padding: '10px', marginTop: '10px' }}>
                                <p>Detected: Plastic Waste</p>
                                <p>Severity: High</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vision Box */}
                <div className="card" style={{ textAlign: 'center', background: 'var(--primary-dark)', color: 'var(--white)', padding: 'var(--space-12)' }}>
                    <h2 style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>Our Vision</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto var(--space-8) auto', opacity: 0.8 }}>
                        We envision an India where every street, park, and public space is free from litter, where every citizen feels a deep sense of ownership.
                    </p>
                    <Link to="/register" className="btn btn-secondary">Get Involved</Link>
                </div>
            </section>
        </div>
    );
}
