import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserSession, saveReport, getReports, API_BASE_URL } from '../utils/storage';


export default function Report() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [location, setLocation] = useState('');
    const [city, setCity] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    useEffect(() => {
        const session = getUserSession();
        if (!session) {
            navigate('/register');
        } else {
            setUser(session);
        }
    }, [navigate]);

    const processImage = async (base64) => {
        setImageUrl(base64);
        setIsSubmitting(true);
        setAiAnalysis(null);
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: base64 })
            });
            
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            
            const data = await response.json();
            setAiAnalysis(data);
        } catch (err) {
            console.error("Live detection failed:", err);
            setError("AI Analysis failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => processImage(event.target.result);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setCameraStream(stream);
            setIsCameraOpen(true);
        } catch (err) {
            setError("Could not access camera. Please check permissions.");
        }
    };

    const closeCamera = () => {
        if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        const video = document.getElementById('camera-preview');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        processImage(canvas.toDataURL('image/jpeg'));
        closeCamera();
    };

    const getRealLocation = () => {
        if (!navigator.geolocation) return setError("Geolocation not supported");
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation(`Lat: ${pos.coords.latitude.toFixed(6)}, Lng: ${pos.coords.longitude.toFixed(6)}`);
                setCity("Detected via GPS");
                setIsGettingLocation(false);
            },
            () => {
                setError("Location access denied");
                setIsGettingLocation(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageUrl) return alert("Photo required");
        setIsSubmitting(true);

        const newReport = {
            id: 'rep_' + Date.now(),
            reporterName: user.name,
            reporterPhone: user.phone,
            reporterEmail: user.email,
            location,
            city,
            description,
            imageUrl,
            status: 'pending',
            date: new Date().toISOString(),
            aiCategory: aiAnalysis?.category || 'General Waste'
        };

        try {
            const data = await saveReport(newReport);
            setAiAnalysis(prev => ({ ...prev, workOrderId: data.workOrderId }));
            setIsSubmitted(true);
            window.dispatchEvent(new Event('miba_state_change'));
        } catch (error) {
            alert("Submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setLocation('');
        setCity('');
        setDescription('');
        setImageUrl('');
        setAiAnalysis(null);
        setIsSubmitted(false);
        setError(null);
    };

    if (!user) return null;

    return (
        <div className="page-container animate-fade" style={{ background: 'var(--gray-100)', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '600px', padding: 'var(--space-6) var(--space-4)' }}>
                <div className="card" style={{ padding: 'var(--space-6)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)', fontWeight: '800' }}>Report an Issue</h2>
                    
                    {!isSubmitted && (
                        <div style={{ marginBottom: 'var(--space-8)' }}>
                            {isCameraOpen ? (
                                <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: '#000' }}>
                                    <video id="camera-preview" autoPlay playsInline ref={(el) => { if (el && cameraStream) el.srcObject = cameraStream; }} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '20px' }}>
                                        <button onClick={capturePhoto} style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'white', border: 'none', boxShadow: '0 0 20px rgba(0,0,0,0.3)' }}></button>
                                        <button onClick={closeCamera} className="btn" style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}>Cancel</button>
                                    </div>
                                </div>
                            ) : imageUrl ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={imageUrl} alt="Captured" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)' }} />
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                                        <button onClick={() => processImage(imageUrl)} style={{ background: 'rgba(16, 185, 129, 0.9)', color: 'white', border: 'none', borderRadius: '20px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                            <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: '5px' }}></i> Analyze
                                        </button>
                                        <button onClick={() => { setImageUrl(''); setAiAnalysis(null); }} style={{ background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>×</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                    <button onClick={openCamera} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-10)' }}>
                                        <i className="fa-solid fa-camera" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
                                        <span style={{ fontWeight: '800', fontSize: '0.875rem' }}>Camera</span>
                                    </button>
                                    <label className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-10)', cursor: 'pointer' }}>
                                        <i className="fa-solid fa-image" style={{ fontSize: '2rem', color: 'var(--secondary)' }}></i>
                                        <span style={{ fontWeight: '800', fontSize: '0.875rem' }}>Gallery</span>
                                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            )}
                        </div>
                    )}

                    {(isSubmitting || aiAnalysis || error) && (
                        <div style={{ background: '#fff', borderRadius: '20px', border: error ? '2px solid #ef4444' : '1px solid #e0e0e0', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
                            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ color: error ? '#ef4444' : 'var(--primary)', fontSize: '0.9rem', letterSpacing: '1px', fontWeight: '800', textTransform: 'uppercase' }}>
                                    {error ? 'ANALYSIS ERROR' : 'AI ANALYSIS RESULT'}
                                </h3>
                            </div>

                            <div style={{ background: error ? '#fef2f2' : '#f8fafc', borderRadius: '12px', padding: '1.25rem' }}>
                                {isSubmitting ? (
                                    <p style={{ color: '#0ea5e9', fontFamily: 'monospace' }}>{"> "} Analyzing image...</p>
                                ) : error ? (
                                    <p style={{ color: '#ef4444', fontFamily: 'monospace' }}>{"> "} Error: {error}</p>
                                ) : aiAnalysis ? (
                                    <>
                                        <p style={{ color: '#0ea5e9', marginBottom: '8px', fontFamily: 'monospace' }}>{"> "} Analysis complete.</p>
                                        <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px', fontFamily: 'monospace' }}>[DETECTION SUCCESS]</div>
                                        {aiAnalysis.grand_total_value_inr > 0 && (
                                            <div style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', borderRadius: '12px', padding: '14px 18px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div>
                                                    <p style={{ color: '#6ee7b7', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px', margin: 0 }}>ESTIMATED VALUE</p>
                                                    <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '900', margin: '2px 0 0' }}>₹{aiAnalysis.grand_total_value_inr.toFixed(2)}</p>
                                                </div>
                                                <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#a7f3d0' }}>
                                                    <p style={{ margin: 0 }}>Scrap ₹{((aiAnalysis.total_scrap_value_inr_min + aiAnalysis.total_scrap_value_inr_max) / 2).toFixed(2)}</p>
                                                    <p style={{ margin: 0 }}>Tokens ₹{aiAnalysis.total_token_value_inr?.toFixed(2)}</p>
                                                    <p style={{ margin: 0 }}>Carbon ₹{aiAnalysis.total_carbon_credit_inr?.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div style={{ background: '#fff', borderRadius: '15px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {/* AI Overview Section */}
                                            {aiAnalysis.ai_narrative && (
                                                <div style={{ background: '#f0f9ff', border: '1px solid #e0f2fe', borderRadius: '12px', padding: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                                                        <i className="fa-solid fa-sparkles"></i> AI Overview
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: '1.6' }}>
                                                        {aiAnalysis.ai_narrative.split('\n').map((line, i) => {
                                                            const renderInline = (text) => {
                                                                const parts = text.split(/\*\*(.*?)\*\*/g);
                                                                if (parts.length === 1) return text;
                                                                return parts.map((part, j) =>
                                                                    j % 2 === 1
                                                                        ? <strong key={j} style={{ fontWeight: '700', color: '#0f172a' }}>{part}</strong>
                                                                        : <span key={j}>{part}</span>
                                                                );
                                                            };

                                                            if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
                                                                const text = line.replace(/^#+\s*/, '');
                                                                return <p key={i} style={{ fontWeight: '800', color: '#0369a1', marginBottom: '6px', marginTop: i > 0 ? '12px' : '0' }}>{text}</p>;
                                                            }
                                                            if (line.startsWith('- ') || line.startsWith('* ')) {
                                                                return (
                                                                    <div key={i} style={{ marginBottom: '6px', paddingLeft: '8px', display: 'flex', gap: '6px' }}>
                                                                        <span style={{ color: '#0369a1', fontWeight: '800', flexShrink: 0 }}>•</span>
                                                                        <span style={{ color: '#475569' }}>{renderInline(line.substring(2))}</span>
                                                                    </div>
                                                                );
                                                            }
                                                            if (!line.trim()) return <div key={i} style={{ height: '6px' }} />;
                                                            return <p key={i} style={{ marginBottom: '6px' }}>{renderInline(line)}</p>;
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            <div style={{ height: '1px', background: '#f1f5f9' }} />
                                        </div>
                                        <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '16px', textAlign: 'center' }}>
                                            Simplified for Phase 1. Environmental details hidden.
                                        </p>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    )}

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1">
                            <div className="form-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5px' }}>
                                    <label>Location</label>
                                    <button type="button" onClick={getRealLocation} style={{ fontSize: '0.75rem', color: 'var(--primary)', border: 'none', background: 'transparent', fontWeight: '800' }}>
                                        <i className="fa-solid fa-location-crosshairs"></i> {isGettingLocation ? 'Locating...' : 'Real Location'}
                                    </button>
                                </div>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Street name or landmark" required />
                            </div>
                            <div className="form-group">
                                <label>City / Area</label>
                                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai, etc." required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details..." rows="2" />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: '1rem', padding: '1.25rem' }}>
                                {isSubmitting ? 'Processing...' : 'Submit Report'}
                            </button>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <div className="pill-success" style={{ padding: '1.25rem', borderRadius: '15px', marginBottom: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <i className="fa-solid fa-circle-check" style={{ fontSize: '1.5rem' }}></i> Report Submitted!
                            </div>
                            <div style={{ background: 'var(--gray-50)', padding: '30px 20px', borderRadius: '20px', marginBottom: '20px', border: '1px solid var(--gray-200)' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '10px' }}>WORK ORDER ID</p>
                                <h1 style={{ color: 'var(--primary-dark)', letterSpacing: '2px', fontSize: '2.5rem' }}>{aiAnalysis?.workOrderId || 'WO-MIBA'}</h1>
                            </div>
                            <div className="grid grid-cols-1" style={{ gap: '12px' }}>
                                <button onClick={resetForm} className="btn btn-primary" style={{ width: '100%' }}>SUBMIT ANOTHER</button>
                                <Link to="/dashboard" className="btn btn-outline" style={{ width: '100%' }}>VIEW DASHBOARD</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
