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
                <div className="grid grid-cols-1 grid-cols-2" style={{ alignItems: 'center', marginBottom: 'var(--space-16)', gap: '4rem' }}>
                    <div style={{ order: 2 }}>
                        <div style={{ position: 'relative' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Cleanup Mission" 
                                style={{ borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)', width: '100%' }}
                            />
                            {/* AI Detection Preview */}
                            <div style={{ position: 'absolute', bottom: '20px', left: '-20px', background: '#fff', padding: '15px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #eef2f3', width: '220px' }}>
                                <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#10b981', marginBottom: '8px', textTransform: 'uppercase' }}>WasteKI Analysis</p>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>W02 Rigid Plastic</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.7rem', color: '#94a3b8' }}>
                                    <span>Severity: 8</span>
                                    <span>Value: ₹13/kg</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ order: 1 }}>
                        <span className="pill-success" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>Proprietary Tech</span>
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>Powered by <span style={{ color: 'var(--primary)' }}>WasteKI</span></h2>
                        <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-6)', lineHeight: '1.7' }}>
                            Powered by <b>WasteKI</b> computer vision. Our <b>YOLOv9</b> detection engine identifies waste objects in real time. <b>EfficientNet-B3</b> classifies into 16 IndicWaste categories. <b>MiDaS</b> depth estimation calculates volume and weight instantly from a single photo.
                        </p>
                        <div className="grid grid-cols-2" style={{ gap: '20px' }}>
                            <div>
                                <i className="fa-solid fa-microchip" style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}></i>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '800' }}>16 Waste Types</h4>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Plastic, metal, organic, e-waste, and more.</p>
                            </div>
                            <div>
                                <i className="fa-solid fa-bolt" style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: 'var(--space-2)' }}></i>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '800' }}>Instant Value</h4>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Severity score and ₹ value shown instantly.</p>
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
