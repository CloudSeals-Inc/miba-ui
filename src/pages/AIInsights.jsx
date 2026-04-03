import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../utils/storage';

// ─── SVG Sparkline Chart ──────────────────────────────────────────────────────
function SparklineChart({ data }) {
    const W = 600, H = 120, PAD = 20;
    if (!data || data.length === 0) return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
            <i className="fa-solid fa-chart-line" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
            <p style={{ fontSize: '0.8rem', fontWeight: '600' }}>Awaiting first reports</p>
        </div>
    );
    const counts = data.map(d => d.count);
    const maxV = Math.max(...counts, 1);
    const points = data.map((d, i) => {
        const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
        const y = H - PAD - (d.count / maxV) * (H - PAD * 2);
        return `${x},${y}`;
    });
    const areaPoints = `${PAD},${H - PAD} ${points.join(' ')} ${W - PAD},${H - PAD}`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={areaPoints} fill="url(#sparkGrad)" />
            <polyline points={points.join(' ')} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {data.map((d, i) => {
                const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
                const y = H - PAD - (d.count / maxV) * (H - PAD * 2);
                return d.count > 0 ? <circle key={i} cx={x} cy={y} r="4" fill="#10b981" stroke="#fff" strokeWidth="2" /> : null;
            })}
            {/* X-axis labels every 3 days */}
            {data.filter((_, i) => i % 3 === 0).map((d, idx) => {
                const i = idx * 3;
                const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
                return <text key={i} x={x} y={H} fontSize="8" fill="#94a3b8" textAnchor="middle">{d.date.slice(5)}</text>;
            })}
        </svg>
    );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ data, colors }) {
    const SIZE = 160, CX = 80, CY = 80, R = 60, STROKE = 22;
    const circ = 2 * Math.PI * R;
    const total = Object.values(data).reduce((s, v) => s + v, 0) || 1;
    let offset = 0;

    const segments = Object.entries(data).map(([label, count], i) => {
        const pct = count / total;
        const dash = pct * circ;
        const seg = { label, count, pct, dash, offset, color: colors[i % colors.length] };
        offset += dash;
        return seg;
    });

    return (
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: '100%', height: '100%' }}>
            {segments.map((s, i) => (
                <circle key={i} cx={CX} cy={CY} r={R}
                    fill="none" stroke={s.color} strokeWidth={STROKE}
                    strokeDasharray={`${s.dash} ${circ - s.dash}`}
                    strokeDashoffset={-s.offset + circ / 4}
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
            ))}
            <text x={CX} y={CY - 6} textAnchor="middle" fontSize="22" fontWeight="900" fill="#1e293b">{total}</text>
            <text x={CX} y={CY + 12} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="700">REPORTS</text>
        </svg>
    );
}

// ─── Agent Card ─────────────────────────────────────────────────────────────
function AgentCard({ icon, title, color, content, isLoading }) {
    const bullets = (content || '').split('•').filter(Boolean);
    return (
        <div style={{
            background: '#fff', borderRadius: '20px', padding: '24px',
            border: `1px solid ${color}30`, boxShadow: `0 4px 24px ${color}10`,
            position: 'relative', overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    <i className={`fa-solid ${icon}`}></i>
                </div>
                <div>
                    <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>AI AGENT</p>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b' }}>{title}</h4>
                </div>
                <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: isLoading ? '#f59e0b' : '#10b981', boxShadow: `0 0 8px ${isLoading ? '#f59e0b' : '#10b981'}` }} />
            </div>
            {isLoading ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Running analysis...
                </div>
            ) : bullets.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {bullets.map((b, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', lineHeight: '1.5', color: '#374151' }}>
                            <span style={{ color, fontWeight: '900', flexShrink: 0, marginTop: '2px' }}>•</span>
                            <span>{b.trim()}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{content}</p>
            )}
        </div>
    );
}

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({ icon, label, value, sub, color, trend }) {
    return (
        <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${color}12`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                    <i className={`fa-solid ${icon}`}></i>
                </div>
                {trend !== undefined && (
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: trend >= 0 ? '#10b981' : '#ef4444', background: trend >= 0 ? '#f0fdf4' : '#fef2f2', padding: '3px 8px', borderRadius: '99px' }}>
                        {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <p style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', margin: '12px 0 4px' }}>{value}</p>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
            {sub && <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>{sub}</p>}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AIInsights() {
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [chatMessages, setChatMessages] = useState([
        { role: 'ai', text: "👋 Hi! I'm MIBA's AI assistant. Ask me anything about the waste data — e.g. *'Which city has the most critical waste?'* or *'What % of plastic reports are cleaned?'*" }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    const DONUT_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
    const SEV_COLORS = { 'Critical Action Required': '#ef4444', 'High Impact': '#f97316', 'Medium Impact': '#f59e0b', 'Low Impact': '#10b981', 'Clean': '#06b6d4', 'Unknown': '#94a3b8' };

    const fetchAnalytics = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/ai/analytics`);
            const data = await res.json();
            setAnalytics(data);
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    const sendChat = async () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput.trim();
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/ai/analytics/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMsg })
            });
            const data = await res.json();
            setChatMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
        } catch {
            setChatMessages(prev => [...prev, { role: 'ai', text: 'Connection error. Is the backend running?' }]);
        }
        setChatLoading(false);
    };

    useEffect(() => { fetchAnalytics(); }, []);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

    if (isLoading) return (
        <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 24px' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #d1fae5', borderTopColor: '#10b981', animation: 'spin 1s linear infinite' }} />
                    <i className="fa-solid fa-brain" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#10b981' }}></i>
                </div>
                <p style={{ fontWeight: '800', color: '#374151', marginBottom: '8px' }}>Multi-Agent Analysis Running</p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Trend · Severity · City Intelligence · Synthesis</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const { summary = {}, agentReports = {}, aiInsights = '' } = analytics || {};

    const cityEntries = Object.entries(summary.cities || {}).sort((a, b) => b[1] - a[1]);
    const sevEntries = Object.entries(summary.severities || {});
    const totalSev = sevEntries.reduce((s, [, v]) => s + v, 0) || 1;

    const TABS = [
        { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
        { id: 'agents', label: 'AI Agents', icon: 'fa-microchip' },
        { id: 'chat', label: 'Ask AI', icon: 'fa-comments' },
    ];

    return (
        <div className="page-container" style={{ background: '#f8fafc', minHeight: '100vh' }}>
            {/* ── Hero ─────────────────────────────────────────────────── */}
            <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-200)', padding: '48px 24px 80px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.06) 0%,transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: '-40px', left: '5%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 70%)' }} />
                <div className="container" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-light)', color: 'var(--primary-dark)', border: '1px solid rgba(16,185,129,0.1)', padding: '6px 14px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px', marginBottom: '16px' }}>
                                <i className="fa-solid fa-circle" style={{ fontSize: '0.5rem' }}></i> LIVE · MULTI-AGENT INTELLIGENCE
                            </div>
                            <h1 style={{ color: 'var(--dark)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: '900', marginBottom: '12px' }}>
                                Environmental <span style={{ color: 'var(--primary)' }}>Analytics</span>
                            </h1>
                            <p style={{ color: 'var(--gray-600)', fontSize: '1rem', maxWidth: '500px', lineHeight: 1.6 }}>
                                WasteKI Multi-Agent Intelligence · 6 specialist agents analyzing {summary.total || 0} waste reports in real-time to generate strategic environmental intelligence.
                            </p>
                        </div>
                        <button onClick={fetchAnalytics} style={{ background: 'var(--gray-100)', border: '1px solid var(--gray-200)', color: 'var(--dark)', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.85rem', flexShrink: 0 }}>
                            <i className="fa-solid fa-arrows-rotate"></i> Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Tabs ─────────────────────────────────────────────────── */}
            <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: '70px', zIndex: 100 }}>
                <div className="container" style={{ display: 'flex', gap: '4px', padding: '0 16px' }}>
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                            padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer',
                            fontWeight: '700', fontSize: '0.85rem', color: activeTab === t.id ? '#10b981' : '#64748b',
                            borderBottom: activeTab === t.id ? '2px solid #10b981' : '2px solid transparent',
                            display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                        }}>
                            <i className={`fa-solid ${t.icon}`}></i> {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container" style={{ padding: '32px 16px 64px', marginTop: '-40px' }}>
                {/* ── Metric Row ─────────────────────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    <MetricCard icon="fa-file-lines" label="Total Reports" value={summary.total || 0} sub="All-time submissions" color="#10b981" />
                    <MetricCard icon="fa-trash-arrow-up" label="Waste Logged" value={`${summary.totalWeight || 0}kg`} sub="Estimated total" color="#3b82f6" />
                    <MetricCard icon="fa-check-double" label="Cleaned" value={`${summary.cleanedPercentage || 0}%`} sub={`${summary.cleanedCount || 0} of ${summary.total || 0} cleared`} color="#22c55e" />
                    <MetricCard icon="fa-fire-flame-curved" label="Critical" value={summary.severities?.['Critical Action Required'] || 0} sub="Urgent attention needed" color="#ef4444" />
                    <MetricCard icon="fa-leaf" label="CO₂ Offset Est." value={`${summary.totalCo2 || 0}kg`} sub="Potential carbon saved" color="#0ea5e9" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    <MetricCard icon="fa-users" label="Collectors Active" value={summary.collectorsActive || 0} sub="Registered Green Champions" color="#8b5cf6" />
                    <MetricCard icon="fa-coins" label="Tokens Issued" value={summary.tokensIssued || 0} sub="MIBA tokens minted" color="#f59e0b" />
                    <MetricCard icon="fa-cloud" label="Carbon Credits" value={`${summary.totalCo2 || 0}kg`} sub="CO₂e logged" color="#06b6d4" />
                    <MetricCard icon="fa-indian-rupee-sign" label="Total UPI Payouts" value={`₹${summary.totalPayouts || 0}`} sub="Collector earnings" color="#10b981" />
                </div>

                {/* ── OVERVIEW TAB ────────────────────────────────────────── */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Trend Chart */}
                        <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>14-Day Report Trend</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Reports submitted per day</p>
                                </div>
                                <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 12px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: '800' }}>LIVE DATA</span>
                            </div>
                            <div style={{ height: '120px' }}>
                                <SparklineChart data={summary.timeline || []} />
                            </div>
                        </div>

                        {/* Donut + Category + Severity side by side */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            {/* Donut */}
                            <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>Waste Breakdown</h3>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>By detected category</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                    <div style={{ width: '160px', height: '160px', flexShrink: 0 }}>
                                        <DonutChart data={summary.categories || {}} colors={DONUT_COLORS} />
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '100px' }}>
                                        {Object.entries(summary.categories || {}).map(([cat, count], i) => (
                                            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                                                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0 }} />
                                                <span style={{ color: '#374151', fontWeight: '600', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat}</span>
                                                <span style={{ color: '#94a3b8', fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Severity */}
                            <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>Severity Levels</h3>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '20px' }}>Environmental risk distribution</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {sevEntries.sort((a, b) => b[1] - a[1]).map(([sev, count]) => {
                                        const pct = Math.round((count / totalSev) * 100);
                                        const col = SEV_COLORS[sev] || '#94a3b8';
                                        return (
                                            <div key={sev}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col, display: 'inline-block' }} />
                                                        {sev}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: col }}>{pct}%</span>
                                                </div>
                                                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: '99px', transition: 'width 1s ease' }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* City Leaderboard */}
                            <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>City Hotspots</h3>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '20px' }}>Top cities by report volume</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {cityEntries.slice(0, 6).map(([city, count], i) => {
                                        const maxCity = cityEntries[0]?.[1] || 1;
                                        const pct = Math.round((count / maxCity) * 100);
                                        const medals = ['🥇', '🥈', '🥉'];
                                        return (
                                            <div key={city}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <span>{medals[i] || `#${i + 1}`}</span> {city}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#3b82f6' }}>{count} reports</span>
                                                </div>
                                                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${pct}%`, background: `hsl(${220 - i * 20}, 80%, 60%)`, borderRadius: '99px', transition: 'width 1s ease' }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {cityEntries.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>No city data yet.</p>}
                                </div>
                            </div>
                        </div>

                        {/* Synthesis Insight - Clean Light Style */}
                        <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.04) 0%,transparent 70%)' }} />
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-light)', border: '1px solid rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>🧠</div>
                                <div>
                                    <p style={{ color: 'var(--primary-dark)', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>Synthesis Agent · Strategic Outlook</p>
                                    <p style={{ color: 'var(--gray-800)', fontSize: '1.1rem', lineHeight: '1.7', fontStyle: 'italic', fontWeight: '500' }}>{aiInsights || 'Submit more waste reports to generate AI insights on environmental patterns.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── AGENTS TAB ──────────────────────────────────────────── */}
                {activeTab === 'agents' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>Multi-Agent System</h3>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>6 specialist agents run in parallel via <code style={{ background: '#f0fdf4', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>asyncio.gather()</code></p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['Collector Agent', 'Waste Quality Agent', 'Traceability Agent', 'Valuation Agent', 'Carbon Accounting Agent', 'Tokenization Agent'].map(a => (
                                    <span key={a} style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.65rem', fontWeight: '800', padding: '4px 10px', borderRadius: '99px', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} /> {a}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            <AgentCard icon="fa-chart-line" title="Trend Analyst" color="#3b82f6" content={agentReports.trend} />
                            <AgentCard icon="fa-biohazard" title="Severity & Impact" color="#ef4444" content={agentReports.severity} />
                            <AgentCard icon="fa-city" title="City Intelligence" color="#8b5cf6" content={agentReports.city} />
                        </div>

                        {/* Architecture diagram */}
                        <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>Agent Architecture</h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', fontWeight: '700' }}>
                                {[
                                    { label: 'Live DB', color: '#94a3b8', icon: '🗄️' },
                                    { label: '→', color: 'transparent' },
                                    { label: 'Aggregator', color: '#0ea5e9', icon: '⚙️' },
                                    { label: '→', color: 'transparent' },
                                    { label: 'asyncio.gather()', color: '#8b5cf6', icon: '⚡' },
                                    { label: '→', color: 'transparent' },
                                    { label: 'Synthesis', color: '#10b981', icon: '🧠' },
                                    { label: '→', color: 'transparent' },
                                    { label: 'UI', color: '#f59e0b', icon: '🖥️' },
                                ].map((n, i) => n.color === 'transparent'
                                    ? <span key={i} style={{ color: '#cbd5e1' }}>→</span>
                                    : <div key={i} style={{ background: `${n.color}15`, border: `1px solid ${n.color}40`, color: n.color, padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>{n.icon}</span> {n.label}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── CHAT TAB ────────────────────────────────────────────── */}
                {activeTab === 'chat' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🧠</div>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>MIBA Data Chat</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>RAG-powered Q&A over your live report data</p>
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: '700', color: '#16a34a' }}>
                                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 6px #16a34a' }} /> Live Data
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', height: '420px', overflowY: 'auto' }}>
                                {chatMessages.map((msg, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '10px', alignItems: 'flex-start' }}>
                                        {msg.role === 'ai' && (
                                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>🧠</div>
                                        )}
                                        <div style={{
                                            maxWidth: '75%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                            background: msg.role === 'user' ? '#10b981' : '#f8fafc',
                                            color: msg.role === 'user' ? '#fff' : '#374151',
                                            fontSize: '0.875rem', lineHeight: '1.6', fontWeight: '500',
                                            border: msg.role === 'ai' ? '1px solid #f1f5f9' : 'none',
                                        }}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🧠</div>
                                        <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '18px 18px 18px 4px', padding: '14px 20px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                                            {[0, 1, 2].map(d => <span key={d} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', animation: `bounce 1.2s ${d * 0.2}s infinite` }} />)}
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Suggestions */}
                            <div style={{ padding: '0 24px 12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['Which city has the most reports?', 'What is the cleanup rate?', 'Most common waste type?'].map(q => (
                                    <button key={q} onClick={() => { setChatInput(q); }} style={{ background: '#f0fdf4', border: '1px solid #d1fae5', color: '#166534', fontSize: '0.7rem', fontWeight: '700', padding: '5px 12px', borderRadius: '99px', cursor: 'pointer' }}>
                                        {q}
                                    </button>
                                ))}
                            </div>

                            <div style={{ padding: '12px 24px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                                <input
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()}
                                    placeholder="Ask anything about the waste data..."
                                    style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', fontSize: '0.875rem', outline: 'none', background: '#f8fafc' }}
                                />
                                <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{ background: '#10b981', border: 'none', color: '#fff', width: '48px', height: '48px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0, opacity: chatInput.trim() ? 1 : 0.5 }}>
                                    <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                    40% { transform: translateY(-6px); opacity: 1; }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
