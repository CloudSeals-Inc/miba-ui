import { Link } from 'react-router-dom';

export default function HowItWorks() {
    return (
        <div className="page-container animate-fade">
            <section className="container" style={{ padding: 'var(--space-12) var(--space-4)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>How It Works</h1>
                    <p style={{ color: 'var(--gray-600)', maxWidth: '600px', margin: '0 auto' }}>A simple 4-step process to beautify India while earning rewards.</p>
                </div>

                <div className="grid grid-cols-1 grid-cols-3" style={{ marginBottom: 'var(--space-12)' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto var(--space-6)' }}>
                            <i className="fa-solid fa-camera"></i>
                        </div>
                        <h3>1. Spot & Report</h3>
                        <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem' }}>
                            Snapshot any cleanliness issue. Your report is shared with our cleanup task force.
                        </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--secondary)' }}>
                        <div style={{ width: '64px', height: '64px', background: '#fff3e0', color: 'var(--secondary)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto var(--space-6)' }}>
                            <i className="fa-solid fa-truck-fast"></i>
                        </div>
                        <h3>2. Collector Dispatch</h3>
                        <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem' }}>
                            WasteKI assigns the nearest registered Green Champion collector. They receive the GPS location, photo evidence, and estimated waste value before arriving.
                        </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto var(--space-6)' }}>
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                        <h3>3. Earn & Verify</h3>
                        <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem' }}>
                            The collector clears the waste. WasteKI Supervisor verifies GPS track and photo evidence. Tokens are issued to the collector. You get notified: your report is cleared.
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', background: '#e8f5e9', color: '#2e7d32', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto var(--space-6)' }}>
                            <i className="fa-solid fa-coins"></i>
                        </div>
                        <h3>4. Carbon Impact</h3>
                        <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem' }}>
                            Every verified pickup is logged as CO₂e avoided. MIBA tokens convert to INR via UPI. The planet wins and collectors earn.
                        </p>
                    </div>
                </div>

                <div className="card" style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>Why Participate?</h2>
                    <div className="grid grid-cols-1 grid-cols-3">
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <i className="fa-solid fa-star" style={{ color: 'var(--secondary)', fontSize: '1.25rem' }}></i>
                            <div>
                                <h4 style={{ marginBottom: '5px' }}>Earn Credits</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>MIBA tokens redeemable as INR via UPI instantly. Scrap value ranges ₹0.50/kg (organic) to ₹140/kg (aluminium).</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <i className="fa-solid fa-shield-heart" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}></i>
                            <div>
                                <h4 style={{ marginBottom: '5px' }}>National Pride</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Take ownership of your neighborhood environment.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <i className="fa-solid fa-chart-line" style={{ color: 'var(--info)', fontSize: '1.25rem' }}></i>
                            <div>
                                <h4 style={{ marginBottom: '5px' }}>Track Impact</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>See real-time stats of overall cleanup efforts.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
                        <Link to="/report" className="btn btn-primary">Start Reporting Now</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
