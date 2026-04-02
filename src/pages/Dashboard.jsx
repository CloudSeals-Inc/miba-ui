import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserSession, getReports, API_BASE_URL } from '../utils/storage';


export default function Dashboard() {
    const [reports, setReports] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [ratingId, setRatingId] = useState(null);

    const fetchReports = async () => {
        setIsLoading(true);
        const data = await getReports();
        setReports(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const submitRating = async (id, rating) => {
        try {
            await fetch(`${API_BASE_URL}/reports/${id}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comment: "Great job!" })
            });
            alert("Thank you for rating!");
            setRatingId(null);
            fetchReports();
        } catch (err) {
            alert("Rating failed");
        }
    };

    const filteredReports = (reports || []).filter(r => {
        const status = r.status?.toLowerCase() || 'pending';
        return filter === 'all' || status === filter.toLowerCase();
    });

    const stats = {
        total: (reports || []).length,
        pending: (reports || []).filter(r => (r.status?.toLowerCase() || 'pending') === 'pending').length,
        assigned: (reports || []).filter(r => r.status?.toLowerCase() === 'assigned').length,
        cleaned: (reports || []).filter(r => r.status?.toLowerCase() === 'cleaned').length,
    };

    return (
        <div className="page-container animate-fade">
            <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>Citizen Dashboard</h1>
                    <p style={{ color: 'var(--gray-600)' }}>Track your reports and their environmental impact</p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 grid-cols-4" style={{ marginBottom: 'var(--space-8)' }}>
                    <div className="card" style={{ padding: 'var(--space-4)' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Total</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: '800' }}>{stats.total}</p>
                    </div>
                    <div className="card" style={{ padding: 'var(--space-4)', borderLeft: '3px solid var(--warning)' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase' }}>New</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--warning)' }}>{stats.pending}</p>
                    </div>
                    <div className="card" style={{ padding: 'var(--space-4)', borderLeft: '3px solid var(--info)' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Assigned</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--info)' }}>{stats.assigned}</p>
                    </div>
                    <div className="card" style={{ padding: 'var(--space-4)', borderLeft: '3px solid var(--success)' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Cleaned</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--success)' }}>{stats.cleaned}</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-6)', overflowX: 'auto', paddingBottom: '5px' }}>
                    {['all', 'pending', 'assigned', 'cleaned'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.4rem 1.2rem', textTransform: 'capitalize', fontSize: '0.8rem', height: '40px', minHeight: '40px' }}>
                            {f}
                        </button>
                    ))}
                </div>

                {/* Reports List */}
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--gray-500)' }}>
                        No reports found for this category.
                    </div>
                ) : (
                    <div className="grid grid-cols-1">
                        {filteredReports.map(report => (
                            <div key={report.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ position: 'relative', width: '120px' }}>
                                        <img src={report.imageUrl} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.6rem', textAlign: 'center', padding: '2px' }}>BEFORE</span>
                                    </div>
                                    {report.status.toLowerCase() === 'cleaned' && report.afterImageUrl && (
                                        <div style={{ position: 'relative', width: '120px', borderLeft: '1px solid #fff' }}>
                                            <img src={report.afterImageUrl} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--success)', color: 'white', fontSize: '0.6rem', textAlign: 'center', padding: '2px' }}>AFTER ✓</span>
                                        </div>
                                    )}
                                    <div style={{ flex: 1, padding: 'var(--space-4)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div>
                                                <span className={`stat-pill ${(report.status?.toLowerCase() || 'pending') === 'pending' ? 'pill-warning' : report.status?.toLowerCase() === 'assigned' ? 'pill-info' : 'pill-success'}`} style={{ fontSize: '0.6rem' }}>
                                                    {report.status || 'Pending'}
                                                </span>
                                                <h4 style={{ fontSize: '1rem', marginTop: '5px' }}>{report.location}</h4>
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{report.workOrderId}</span>
                                        </div>
                                        
                                        <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginBottom: '10px' }}>{report.description || 'No description provided.'}</p>

                                        {report.status.toLowerCase() === 'cleaned' && !report.rating && (
                                            <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '10px', marginTop: '10px' }}>
                                               {ratingId === report.id ? (
                                                   <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                       <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>Rate Service:</span>
                                                       {[1,2,3,4,5].map(star => (
                                                           <button key={star} onClick={() => submitRating(report.id, star)} style={{ background: 'none', border: 'none', color: '#fbbf24', fontSize: '1.2rem', cursor: 'pointer' }}>
                                                               <i className="fa-regular fa-star"></i>
                                                           </button>
                                                       ))}
                                                   </div>
                                               ) : (
                                                   <button onClick={() => setRatingId(report.id)} className="btn btn-primary" style={{ height: '32px', minHeight: '32px', fontSize: '0.7rem', padding: '0 15px' }}>
                                                       RATE COLLECTOR
                                                   </button>
                                               )}
                                            </div>
                                        )}
                                        {report.rating && (
                                            <div style={{ color: '#fbbf24', fontSize: '0.8rem' }}>
                                                {[...Array(report.rating)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                                                <span style={{ color: 'var(--gray-500)', marginLeft: '10px' }}>Rating submitted</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <style>{`
                 .stat-pill {
                    padding: 0.2rem 0.6rem;
                    border-radius: 99px;
                    font-weight: 800;
                    text-transform: uppercase;
                }
                .pill-info { background: #dbeafe; color: #1e40af; }
            `}</style>
        </div>
    );
}
