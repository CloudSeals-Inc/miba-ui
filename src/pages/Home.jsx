import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="page-container animate-fade">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge animate-slide-up">
                            <i className="fa-solid fa-sparkles"></i> 
                            Nationwide Initiative
                        </div>
                        
                        <h1 className="hero-title animate-slide-up">
                            Make India <br />
                            <span>Beautiful</span> Again
                        </h1>
                        
                        <p className="hero-text animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Spot waste, report it, and watch us take action. Join 2,000+ citizens who are already building a cleaner, greener India.
                        </p>
                        
                        <div className="hero-actions animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link to="/report" className="btn btn-primary">
                                <i className="fa-solid fa-camera"></i> Report Now
                            </Link>
                            <Link to="/about" className="btn btn-outline">
                                Learn More
                            </Link>
                        </div>

                        <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem', animationDelay: '0.3s' }} className="animate-slide-up">
                            <div style={{ display: 'flex' }}>
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&w=40&h=40&fit=crop" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid white', objectFit: 'cover' }} alt="User" />
                                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&w=40&h=40&fit=crop" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid white', objectFit: 'cover', marginLeft: '-15px' }} alt="User" />
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid white', background: 'var(--white)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', marginLeft: '-15px' }}>+2k</div>
                            </div>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-700)', margin: 0 }}>
                                Join the active movement
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: 'var(--space-16) 0', background: 'var(--white)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>How it Works</h2>
                        <p style={{ color: 'var(--gray-600)', maxWidth: '600px', margin: '0 auto' }}>
                            Reporting cleanliness issues in your city is now easier than ever with our AI-powered platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 grid-cols-3">
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-xl)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto var(--space-6) auto' }}>
                                <i className="fa-solid fa-camera"></i>
                            </div>
                            <h3 style={{ marginBottom: 'var(--space-3)' }}>1. Spot It</h3>
                            <p style={{ fontSize: '0.9375rem', color: 'var(--gray-600)' }}>
                                See waste or a garbage pile? Just point yours camera and take a quick photo.
                            </p>
                        </div>

                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-xl)', background: '#fff3e0', color: '#ff9800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto var(--space-6) auto' }}>
                                <i className="fa-solid fa-robot"></i>
                            </div>
                            <h3 style={{ marginBottom: 'var(--space-3)' }}>2. AI Detection</h3>
                            <p style={{ fontSize: '0.9375rem', color: 'var(--gray-600)' }}>
                                Our AI automatically identifies the waste type, severity, and ecological impact.
                            </p>
                        </div>

                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-xl)', background: '#e0f2f1', color: '#009688', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto var(--space-6) auto' }}>
                                <i className="fa-solid fa-award"></i>
                            </div>
                            <h3 style={{ marginBottom: 'var(--space-3)' }}>3. Earn Credits</h3>
                            <p style={{ fontSize: '0.9375rem', color: 'var(--gray-600)' }}>
                                Earn MIBA credits for every report. Be recognized for your contribution to the nation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: 'var(--space-16) 0', background: 'var(--primary-dark)', color: 'var(--white)', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ color: 'var(--white)', marginBottom: 'var(--space-6)' }}>Ready to Clean India?</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto var(--space-8) auto', opacity: 0.8 }}>
                        Join the thousand of others who are already making a difference in their local neighborhoods.
                    </p>
                    <Link to="/register" className="btn btn-secondary" style={{ padding: '1rem 3rem' }}>
                        Join Free Now
                    </Link>
                </div>
            </section>
        </div>
    );
}

// Inline constant for the style object since we can't use variables in string template
const varName = (name) => `var(--${name})`;
