import { useState } from 'react';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="page-container animate-fade">
            <section className="container" style={{ padding: 'var(--space-12) var(--space-4)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>Contact MIBA</h1>
                    <p style={{ color: 'var(--gray-600)', maxWidth: '600px', margin: '0 auto' }}>Have a question or want to partner with us? Reach out and we'll get back to you shortly.</p>
                </div>

                <div className="grid grid-cols-1 grid-cols-2" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {/* Contact Info */}
                    <div className="card" style={{ background: 'var(--gray-50)', border: 'none' }}>
                        <h2 style={{ marginBottom: 'var(--space-8)' }}>Get in Touch</h2>

                        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                            <div style={{ color: 'var(--primary)', fontSize: '1.25rem' }}><i className="fa-solid fa-building-circle-check"></i></div>
                            <div>
                                <h4 style={{ marginBottom: '4px' }}>Presence</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>India & UK operations</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                            <div style={{ color: 'var(--primary)', fontSize: '1.25rem' }}><i className="fa-solid fa-envelope"></i></div>
                            <div>
                                <h4 style={{ marginBottom: '4px' }}>Email Us</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>support@miba.in</p>
                            </div>
                        </div>

                        <div style={{ marginTop: 'var(--space-12)' }}>
                            <h4 style={{ marginBottom: 'var(--space-4)' }}>Follow Our Impact</h4>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                {['facebook-f', 'twitter', 'instagram'].map(icon => (
                                    <a key={icon} href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)', boxShadow: 'var(--shadow-sm)' }}>
                                        <i className={`fa-brands fa-${icon}`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="card">
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
                                <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: 'var(--space-4)' }}></i>
                                <h3>Received!</h3>
                                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="grid grid-cols-1">
                                <div className="form-group">
                                    <label>Your Name</label>
                                    <input type="text" required />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" required />
                                </div>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea required rows="4"></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
