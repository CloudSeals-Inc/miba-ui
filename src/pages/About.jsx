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


                {/* Vision Box - Clean Light Style */}
                <div className="card" style={{ textAlign: 'center', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-12)', boxShadow: 'var(--shadow-lg)' }}>
                    <h2 style={{ color: 'var(--dark)', marginBottom: 'var(--space-4)' }}>Our Vision</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto var(--space-8) auto', color: 'var(--gray-600)', lineHeight: 1.75 }}>
                        We envision an India where every street, park, and public space is free from litter, where every citizen feels a deep sense of ownership.
                    </p>
                    <Link to="/register" className="btn btn-primary" style={{ boxShadow: '0 8px 24px rgba(16,185,129,0.2)' }}>Get Involved</Link>
                </div>
            </section>
        </div>
    );
}
