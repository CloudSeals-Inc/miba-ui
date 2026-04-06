import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserSession, getReports, API_BASE_URL, isMobileDevice } from '../utils/storage';


export default function CollectorDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [assignedReports, setAssignedReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTask, setActiveTask] = useState(null);
    const [afterImage, setAfterImage] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [completedTask, setCompletedTask] = useState(null);

    useEffect(() => {
        const session = getUserSession();
        if (!session) {
            navigate('/register');
        } else {
            if (session.role === 'citizen') {
                navigate('/dashboard');
                return;
            }
            setUser(session);
            loadTasks(session);
            // Auto refresh every 30 seconds
            const interval = setInterval(() => loadTasks(session), 30000);
            return () => clearInterval(interval);
        }
    }, [navigate]);

    const loadTasks = async (currentUser) => {
        setIsLoading(true);
        const data = await getReports(currentUser?.phone, currentUser?.role);
        // Case-insensitive status check
        setAssignedReports(data.filter(r =>
            r.status.toLowerCase() === 'pending' ||
            r.status.toLowerCase() === 'assigned'
        ));
        setIsLoading(false);
    };

    const startVerification = (task) => {
        setActiveTask(task);
        setIsScanning(true);
    };

    const handleScanComplete = () => {
        setIsScanning(false);
        setIsVerifying(true);
    };

    const handleAfterPhoto = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => setAfterImage(event.target.result);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const completeWorkOrder = async () => {
        if (!afterImage) return alert("Please capture the After Photo first!");
        setIsLoading(true);
        await proceedWithCompletion();
    };

    const proceedWithCompletion = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/reports/${activeTask.id}/pickup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ afterImageUrl: afterImage, collector_id: user?.phone || 'anonymous' })
            });
            if (res.ok) {
                setCompletedTask(activeTask);
                setActiveTask(null);
                setAfterImage('');
                setIsVerifying(false);
                loadTasks();
            } else {
                const errorData = await res.json();
                alert(errorData.detail || "Submission failed. Please ensure the 'After' photo matches the 'Before' location.");
            }
        } catch (err) { alert("Network error. Please check your connection."); }
        finally { setIsLoading(false); }
    };

    const openInMaps = (location) => {
        // Extract numbers from "Lat: 17.53, Lng: 78.50"
        const coords = location.match(/(-?\d+\.\d+)/g);
        const query = coords ? coords.join(',') : location;
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
    };

    if (!user) return null;

    return (
        <div className="page-container animate-fade" style={{ background: '#0e1117', color: '#e6edf3', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '600px', padding: 'var(--space-8) var(--space-4)' }}>
                {/* Header Stats */}
                <div className="flex-col-mob" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: '#161b22', padding: '20px', borderRadius: '20px', border: '1px solid #30363d', gap: '15px' }}>
                    <div>
                        <p style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', fontWeight: '800' }}>My Earnings</p>
                        <h2 style={{ color: 'var(--primary)', fontSize: '2rem' }}>₹{user.wallet || 0}</h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <button onClick={loadTasks} className="btn" style={{ background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '5px 15px', borderRadius: '15px', fontSize: '0.7rem' }}>
                            <i className={`fa-solid fa-arrows-rotate ${isLoading ? 'fa-spin' : ''}`}></i> Refresh
                        </button>
                    </div>
                </div>

                {isScanning ? (
                    <div className="card animate-slide-up" style={{ background: '#161b22', border: '1px solid #30363d', textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <i className="fa-solid fa-clipboard-check" style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
                            <h3 style={{ color: 'white' }}>Verify Work Order</h3>
                        </div>

                        <div style={{ background: '#0d1117', padding: '25px', borderRadius: '15px', border: '1px solid #30363d', marginBottom: '2rem' }}>
                            <p style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '10px' }}>CITIZEN WORK ORDER ID</p>
                            <h2 style={{ color: 'var(--primary)', letterSpacing: '2px' }}>{activeTask?.workOrderId}</h2>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#8b949e', marginBottom: '2rem' }}>Please confirm the ID matches the citizen's report before proceeding.</p>
                        <button onClick={handleScanComplete} className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }}>ID MATCHES - CONTINUE</button>
                    </div>
                ) : isVerifying ? (
                    <div className="card animate-slide-up" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                        <div className="flex-col-mob" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.65rem', fontWeight: '800', opacity: 0.5, marginBottom: '5px' }}>BEFORE</p>
                                <img src={activeTask.imageUrl} onError={e => e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image'} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px' }} alt="Before" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '5px' }}>AFTER (UPLOAD)</p>
                                {!isMobileDevice() ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '120px', width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: '10px', color: '#8b949e', padding: '10px' }}>
                                        <i className="fa-solid fa-mobile-screen-button" style={{ fontSize: '1.5rem', marginBottom: '8px' }}></i>
                                        <p style={{ fontSize: '0.65rem', textAlign: 'center', fontWeight: '700' }}>Verification required on mobile device</p>
                                    </div>
                                ) : !afterImage ? (
                                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', width: '100%', background: '#0d1117', border: '2px dashed #30363d', borderRadius: '10px', cursor: 'pointer' }}>
                                        <i className="fa-solid fa-camera"></i>
                                        <input type="file" accept="image/*" onChange={handleAfterPhoto} style={{ display: 'none' }} />
                                    </label>
                                ) : (
                                    <img src={afterImage} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px' }} alt="After" />
                                )}
                            </div>
                        </div>

                        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Verify Cleanup</h3>
                        <p style={{ fontSize: '0.85rem', color: '#8b949e', marginBottom: '1.5rem' }}>
                            {!isMobileDevice() ? 'Please open the MIBA app on your phone to capture the "After" photo and complete this task.' : "Submit the 'After' photo to complete this work order."}
                        </p>

                        <button onClick={completeWorkOrder} className="btn btn-primary" disabled={isLoading || !isMobileDevice()} style={{ width: '100%', padding: '1.25rem' }}>
                            {!isMobileDevice() ? 'SWITCH TO MOBILE TO COMPLETE' : (isLoading ? 'VERIFYING LOCATION...' : 'COMPLETE & COLLECT YOUR SHARE')}
                        </button>
                    </div>
                ) : completedTask ? (
                    <div className="card animate-slide-up" style={{ background: '#161b22', border: '1px solid #30363d', textAlign: 'center', padding: '40px 24px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(56, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' }}>
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                        <h2 style={{ color: 'white', marginBottom: '8px' }}>Pickup Verified!</h2>
                        <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '2rem' }}>Earnings distributed as per the MIBA economics model.</p>

                        {/* Waste detection summary */}
                        {completedTask.aiCategory && (
                            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', textAlign: 'left' }}>
                                <p style={{ fontSize: '0.65rem', color: '#6ee7b7', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>AI Detection</p>
                                <p style={{ color: 'white', fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>
                                    {completedTask.aiCategoryCode && <span style={{ color: '#6ee7b7', marginRight: '6px' }}>{completedTask.aiCategoryCode}</span>}
                                    {completedTask.aiCategory}
                                    {completedTask.totalWeightKg > 0 && <span style={{ color: '#8b949e', fontWeight: '500' }}> · {completedTask.totalWeightKg.toFixed(2)} kg</span>}
                                    {completedTask.severityLabel && <span style={{ color: '#8b949e', fontWeight: '500' }}> · {completedTask.severityLabel}</span>}
                                </p>
                                {completedTask.grandTotalInr > 0 && (
                                    <p style={{ fontSize: '0.8rem', color: '#8b949e', marginTop: '4px' }}>
                                        Est. value ₹{completedTask.grandTotalInr.toFixed(2)}
                                        {completedTask.scrapInrMin > 0 && <span> (Scrap ₹{((completedTask.scrapInrMin + completedTask.scrapInrMax) / 2).toFixed(2)}</span>}
                                        {completedTask.tokenInr > 0 && <span> + Tokens ₹{completedTask.tokenInr.toFixed(2)}</span>}
                                        {completedTask.carbonInr > 0 && <span> + Carbon ₹{completedTask.carbonInr.toFixed(2)})</span>}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Earnings breakdown */}
                        <div style={{ background: '#0d1117', borderRadius: '15px', border: '1px solid #30363d', padding: '24px', marginBottom: '2rem', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #30363d', marginBottom: '16px' }}>
                                <span style={{ color: '#8b949e', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase' }}>Total Work Value</span>
                                <span style={{ color: 'white', fontWeight: '900', fontSize: '1.25rem' }}>₹{(completedTask.grandTotalInr || 0).toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.85rem' }}>Your share (60%)</span>
                                        <span style={{ color: '#3fb950', fontSize: '0.65rem' }}>Credited to UPI</span>
                                    </div>
                                    <span style={{ color: 'var(--primary)', fontWeight: '900' }}>₹{((completedTask.grandTotalInr || 0) * 0.60).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>Platform fee (25%)</span>
                                    <span style={{ color: '#8b949e', fontWeight: '700' }}>₹{((completedTask.grandTotalInr || 0) * 0.25).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>Municipal share (15%)</span>
                                    <span style={{ color: '#8b949e', fontWeight: '700' }}>₹{((completedTask.grandTotalInr || 0) * 0.15).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => setCompletedTask(null)} className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }}>BACK TO DASHBOARD</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-map-location-dot" style={{ color: 'var(--primary)' }}></i> Nearby Open Tasks ({assignedReports.length})
                        </h3>
                        {assignedReports.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.4 }}>
                                <i className="fa-solid fa-box-open" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                                <p>No tasks found. Try refreshing.</p>
                            </div>
                        ) : assignedReports.map(task => (
                            <div key={task.id} className="card" style={{ background: '#161b22', border: '1px solid #30363d', color: 'white', padding: 0, overflow: 'hidden' }}>
                                <div className="flex-col-mob" style={{ display: 'flex' }}>
                                    <img className="w-full-mob" src={task.imageUrl} onError={e => e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image'} style={{ width: '140px', height: '160px', objectFit: 'cover' }} alt="Waste" />
                                    <div style={{ flex: 1, padding: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.75rem' }}>{task.workOrderId || 'WO-PENDING'}</span>
                                            <span style={{ fontSize: '0.6rem', color: task.severity?.includes('Critical') ? '#f85149' : '#3fb950', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '10px' }}>{task.severity}</span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '5px' }}><i className="fa-solid fa-location-dot" style={{ color: 'red', fontSize: '0.7rem' }}></i> {task.location}</p>
                                        <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '15px' }}>{task.city}</p>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => openInMaps(task.location)} className="btn btn-outline" style={{ flex: 1, borderColor: '#30363d', color: 'white', fontSize: '0.65rem', height: '32px', minHeight: '32px' }}>
                                                MAPS
                                            </button>
                                            <button onClick={() => startVerification(task)} className="btn btn-primary" style={{ flex: 2, fontSize: '0.65rem', height: '32px', minHeight: '32px' }}>
                                                COLLECT NOW
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes scanMove {
                    0% { top: 20%; }
                    50% { top: 80%; }
                    100% { top: 20%; }
                }
            `}</style>
        </div>
    );
}
