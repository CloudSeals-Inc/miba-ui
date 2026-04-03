import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../utils/storage';

function useCountUp(target, duration = 1800) {
    const [count, setCount] = useState(0);
    const started = useRef(false);
    useEffect(() => {
        if (!target || started.current) return;
        started.current = true;
        const steps = 60;
        const inc = target / steps;
        let cur = 0;
        const iv = setInterval(() => {
            cur += inc;
            if (cur >= target) { setCount(target); clearInterval(iv); }
            else setCount(Math.floor(cur));
        }, duration / steps);
        return () => clearInterval(iv);
    }, [target, duration]);
    return count;
}

export default function Home() {
    const [stats, setStats] = useState({ user_count: 0, report_count: 0 });
    const [visible, setVisible] = useState(false);
    const statsRef = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/stats`)
            .then(r => r.json())
            .then(d => setStats({ user_count: d.user_count || 0, report_count: d.report_count || 0 }))
            .catch(() => {});
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
        if (statsRef.current) obs.observe(statsRef.current);
        return () => obs.disconnect();
    }, []);

    const users   = useCountUp(visible ? stats.user_count : 0);
    const reports = useCountUp(visible ? stats.report_count : 0);
    const cities  = useCountUp(visible ? 24 : 0, 1200);
    const co2     = useCountUp(visible ? 18 : 0, 1400);

    return (
        <div style={{ background: '#fff' }}>

            {/* ══════════════════════════════════════════════════
                HERO — above the fold, investor-first message
            ══════════════════════════════════════════════════ */}
            <section style={{
                background: 'linear-gradient(145deg, #020d07 0%, #032e18 40%, #064e3b 75%, #065f46 100%)',
                minHeight: '92vh', display: 'flex', alignItems: 'center',
                padding: '7rem 0 5rem', position: 'relative', overflow: 'hidden',
            }}>
                {/* Glow blobs */}
                <div style={{ position:'absolute', top:'-120px', right:'-80px', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.14) 0%,transparent 65%)', pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'450px', height:'450px', borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.09) 0%,transparent 65%)', pointerEvents:'none' }} />
                <div style={{ position:'absolute', top:'40%', left:'30%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />

                <div className="container" style={{ position:'relative', zIndex:1 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }}>

                        {/* LEFT — copy */}
                        <div>
                            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'99px', padding:'5px 14px', fontSize:'0.72rem', fontWeight:'700', color:'#6ee7b7', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'1.75rem' }}>
                                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#34d399', boxShadow:'0 0 8px #34d399', display:'inline-block', animation:'pulse 2s infinite' }} />
                                Smart Sustainability Platform
                            </div>

                            <h1 style={{ fontSize:'clamp(2.6rem,5vw,4.2rem)', fontWeight:'900', lineHeight:1.05, color:'#fff', fontFamily:"'Outfit',sans-serif", marginBottom:'1.5rem', letterSpacing:'-0.02em' }}>
                                India's Waste Crisis<br />
                                <span style={{ background:'linear-gradient(90deg,#34d399 0%,#6ee7b7 50%,#fbbf24 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                                    is an Opportunity.
                                </span>
                            </h1>

                            <p style={{ fontSize:'1.1rem', color:'rgba(255,255,255,0.65)', lineHeight:1.75, marginBottom:'2.5rem', maxWidth:'500px' }}>
                                MIBA turns every piece of unprocessed waste into a structured data event — with AI-verified category, weight, ₹ scrap value, carbon credit, and a municipal work order. All in under 3 seconds.
                            </p>

                            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'3rem' }}>
                                <Link to="/report" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff', fontWeight:'700', fontSize:'0.95rem', padding:'14px 26px', borderRadius:'12px', boxShadow:'0 8px 28px rgba(16,185,129,0.4)', textDecoration:'none', transition:'transform 0.2s,box-shadow 0.2s' }}
                                    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 14px 36px rgba(16,185,129,0.5)'}}
                                    onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 8px 28px rgba(16,185,129,0.4)'}}>
                                    <i className="fa-solid fa-camera" /> Try Live Demo
                                </Link>
                                <Link to="/about" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', fontWeight:'600', fontSize:'0.95rem', padding:'14px 26px', borderRadius:'12px', backdropFilter:'blur(8px)', textDecoration:'none', transition:'background 0.2s' }}
                                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.14)'}
                                    onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}>
                                    Our Mission <i className="fa-solid fa-arrow-right" />
                                </Link>
                            </div>

                        </div>

                        {/* RIGHT — live AI result card */}
                        <div style={{ display:'flex', justifyContent:'center' }}>
                            <div style={{ width:'100%', maxWidth:'360px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'24px', padding:'20px', backdropFilter:'blur(20px)', boxShadow:'0 40px 80px rgba(0,0,0,0.4)' }}>
                                {/* Header */}
                                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#34d399', boxShadow:'0 0 8px #34d399' }} />
                                    <span style={{ fontSize:'0.75rem', color:'#6ee7b7', fontWeight:'700', letterSpacing:'0.05em' }}>MIBA AI · LIVE SCAN</span>
                                </div>

                                {/* Image placeholder */}
                                <div style={{ borderRadius:'14px', height:'160px', background:'linear-gradient(135deg,rgba(6,78,59,0.8),rgba(2,13,7,0.9))', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', marginBottom:'16px', border:'1px dashed rgba(52,211,153,0.2)', gap:'8px' }}>
                                    <i className="fa-solid fa-camera-retro" style={{ fontSize:'2rem', color:'rgba(52,211,153,0.5)' }} />
                                    <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.3)' }}>Point camera at waste</span>
                                </div>

                                {/* Detection result */}
                                <div style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'12px', padding:'12px 14px', marginBottom:'14px' }}>
                                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                                        <span style={{ fontWeight:'700', color:'#fff', fontSize:'0.9rem' }}>W02 · Rigid Plastic (PET)</span>
                                        <span style={{ background:'#34d399', color:'#022c22', fontSize:'0.65rem', fontWeight:'800', padding:'2px 8px', borderRadius:'99px' }}>94%</span>
                                    </div>
                                    <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)' }}>Recyclable · SCRAP route · High severity</div>
                                </div>

                                {/* Metrics grid */}
                                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'14px' }}>
                                    {[
                                        { icon:'⚖️', v:'2.3 kg',   l:'Weight' },
                                        { icon:'🌿', v:'4.3 kg',   l:'CO₂e Saved' },
                                        { icon:'💰', v:'₹29.90',  l:'Est. Value' },
                                    ].map(m=>(
                                        <div key={m.l} style={{ background:'rgba(255,255,255,0.05)', borderRadius:'10px', padding:'10px 6px', textAlign:'center' }}>
                                            <div style={{ fontSize:'1.1rem', marginBottom:'4px' }}>{m.icon}</div>
                                            <div style={{ color:'#fff', fontWeight:'800', fontSize:'0.82rem' }}>{m.v}</div>
                                            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.62rem', marginTop:'2px' }}>{m.l}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Work order */}
                                <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'10px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px' }}>
                                    <i className="fa-solid fa-truck-pickup" style={{ color:'#fbbf24', fontSize:'0.9rem' }} />
                                    <div>
                                        <div style={{ color:'#fbbf24', fontWeight:'700', fontSize:'0.78rem' }}>Work Order Created</div>
                                        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.68rem' }}>Collector assigned · ETA 2 hrs</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                PROBLEM — the market context
            ══════════════════════════════════════════════════ */}
            <section style={{ padding:'6rem 0', background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                <div className="container">
                    <div style={{ textAlign:'center', maxWidth:'720px', margin:'0 auto 4rem' }}>
                        <span style={{ background:'#fee2e2', color:'#991b1b', fontWeight:'700', fontSize:'0.72rem', padding:'4px 12px', borderRadius:'99px', letterSpacing:'0.07em', textTransform:'uppercase' }}>The Problem</span>
                        <h2 style={{ marginTop:'1rem', marginBottom:'1rem', fontSize:'clamp(1.8rem,4vw,2.6rem)', lineHeight:1.2 }}>
                            India generates <span style={{ color:'#dc2626' }}>62 million tonnes</span> of solid waste every year.
                        </h2>
                        <p style={{ color:'#64748b', fontSize:'1.05rem', lineHeight:1.75 }}>
                            Less than 22% is scientifically processed. The rest ends up in open dumps, drains, and landfills — destroying public health and the environment. Municipal systems lack data. Citizens lack tools. The market lacks infrastructure.
                        </p>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.5rem', maxWidth:'900px', margin:'0 auto' }}>
                        {[
                            { stat:'62 MT',   sub:'Waste generated annually',      color:'#dc2626', bg:'#fef2f2', icon:'fa-trash' },
                            { stat:'< 22%',   sub:'Scientifically processed',       color:'#d97706', bg:'#fffbeb', icon:'fa-recycle' },
                            { stat:'₹1.4 T',  sub:'Untapped economic value',        color:'#7c3aed', bg:'#f5f3ff', icon:'fa-rupee-sign' },
                            { stat:'4,800+',  sub:'Urban local bodies underserved', color:'#0369a1', bg:'#eff6ff', icon:'fa-city' },
                        ].map(s=>(
                            <div key={s.stat} style={{ background:s.bg, borderRadius:'18px', padding:'1.75rem 1.5rem', textAlign:'center' }}>
                                <div style={{ width:'46px', height:'46px', borderRadius:'12px', background:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
                                    <i className={`fa-solid ${s.icon}`} style={{ color:s.color, fontSize:'1.15rem' }} />
                                </div>
                                <div style={{ fontSize:'2rem', fontWeight:'900', color:s.color, fontFamily:"'Outfit',sans-serif", lineHeight:1 }}>{s.stat}</div>
                                <div style={{ fontSize:'0.82rem', color:'#334155', marginTop:'6px', fontWeight:'500', lineHeight:1.4 }}>{s.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                SOLUTION — the three pillars
            ══════════════════════════════════════════════════ */}
            <section style={{ padding:'6rem 0', background:'#fff' }}>
                <div className="container">
                    <div style={{ textAlign:'center', marginBottom:'4rem' }}>
                        <span style={{ background:'#d1fae5', color:'#065f46', fontWeight:'700', fontSize:'0.72rem', padding:'4px 12px', borderRadius:'99px', letterSpacing:'0.07em', textTransform:'uppercase' }}>The Solution</span>
                        <h2 style={{ marginTop:'1rem', marginBottom:'0.75rem', fontSize:'clamp(1.8rem,4vw,2.4rem)' }}>One platform. Three engines.</h2>
                        <p style={{ color:'#64748b', maxWidth:'540px', margin:'0 auto', fontSize:'1rem', lineHeight:1.7 }}>MIBA connects citizens, AI, and municipal bodies into a closed-loop waste management system.</p>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'2rem' }}>
                        {[
                            {
                                icon:'fa-eye', color:'#10b981', bg:'linear-gradient(135deg,#d1fae5,#a7f3d0)',
                                num:'01',
                                title:'AI Vision Engine',
                                sub:'Proprietary Image Intelligence',
                                points:['Automated waste category detection','Weight, volume & CO₂e estimated per object','Scrap ₹ value + token credit calculated instantly','AI generates human-readable report narrative'],
                            },
                            {
                                icon:'fa-coins', color:'#f59e0b', bg:'linear-gradient(135deg,#fef3c7,#fde68a)',
                                num:'02',
                                title:'Token Economy',
                                sub:'₹-denominated MIBA credits on-ledger',
                                points:['Citizens earn tokens per verified report','Scrap market rates + carbon ₹1/kg built-in','Collector incentives drive pickup SLA','Transparent ledger — no black-box rewards'],
                            },
                            {
                                icon:'fa-network-wired', color:'#6366f1', bg:'linear-gradient(135deg,#ede9fe,#c7d2fe)',
                                num:'03',
                                title:'Municipal Integration',
                                sub:'Supervisor AI · Work order routing',
                                points:['Auto-creates work orders from every report','Routes to nearest available collector','Tracks pickup SLA and before/after evidence','Dashboard for ULBs — no new software needed'],
                            },
                        ].map(p=>(
                            <div key={p.num} style={{ borderRadius:'22px', overflow:'hidden', border:'1px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', transition:'transform 0.25s,box-shadow 0.25s' }}
                                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.boxShadow='0 20px 48px rgba(0,0,0,0.12)'}}
                                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.06)'}}>
                                <div style={{ background:p.bg, padding:'2rem 2rem 1.5rem' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'1rem' }}>
                                        <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:'rgba(255,255,255,0.6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                            <i className={`fa-solid ${p.icon}`} style={{ color:p.color, fontSize:'1.2rem' }} />
                                        </div>
                                        <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:'2.5rem', fontWeight:'900', color:'rgba(0,0,0,0.08)', lineHeight:1 }}>{p.num}</span>
                                    </div>
                                    <h3 style={{ fontSize:'1.15rem', marginBottom:'4px', color:'#0f172a' }}>{p.title}</h3>
                                    <p style={{ fontSize:'0.78rem', color:'#64748b', fontWeight:'500', margin:0 }}>{p.sub}</p>
                                </div>
                                <div style={{ padding:'1.5rem 2rem', background:'#fff' }}>
                                    {p.points.map(pt=>(
                                        <div key={pt} style={{ display:'flex', gap:'10px', marginBottom:'10px', alignItems:'flex-start' }}>
                                            <i className="fa-solid fa-check-circle" style={{ color:p.color, fontSize:'0.85rem', marginTop:'3px', flexShrink:0 }} />
                                            <span style={{ fontSize:'0.875rem', color:'#475569', lineHeight:1.5 }}>{pt}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                TRACTION — live numbers
            ══════════════════════════════════════════════════ */}
            <section ref={statsRef} style={{ padding:'6rem 0', background:'linear-gradient(135deg,#022c22 0%,#064e3b 60%,#065f46 100%)', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'800px', height:'800px', borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 60%)', pointerEvents:'none' }} />
                <div className="container" style={{ position:'relative' }}>
                    <div style={{ textAlign:'center', marginBottom:'4rem' }}>
                        <span style={{ background:'rgba(16,185,129,0.18)', border:'1px solid rgba(16,185,129,0.3)', color:'#6ee7b7', fontWeight:'700', fontSize:'0.72rem', padding:'4px 14px', borderRadius:'99px', letterSpacing:'0.08em', textTransform:'uppercase' }}>
                            <i className="fa-solid fa-signal" style={{ marginRight:'6px' }} />Live Traction
                        </span>
                        <h2 style={{ color:'#fff', marginTop:'1rem', marginBottom:'0.5rem', fontSize:'clamp(1.8rem,4vw,2.4rem)' }}>Real numbers. Real impact.</h2>
                        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'1rem' }}>Updated live from our production database.</p>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1.5rem', maxWidth:'900px', margin:'0 auto' }}>
                        {[
                            { v:users,   suf:'+', label:'Citizens Registered',  sub:'Across all roles',         color:'#34d399', icon:'fa-users' },
                            { v:reports, suf:'+', label:'Waste Reports Filed',   sub:'AI-verified events',       color:'#fbbf24', icon:'fa-flag' },
                            { v:cities,  suf:'',  label:'Cities Active',         sub:'And growing fast',         color:'#60a5fa', icon:'fa-city' },
                            { v:co2,     suf:' T',label:'CO₂e Avoided (est.)',   sub:'Tonnes this quarter',      color:'#a78bfa', icon:'fa-leaf' },
                        ].map(s=>(
                            <div key={s.label} style={{ textAlign:'center', padding:'2rem 1rem' }}>
                                <div style={{ width:'52px', height:'52px', borderRadius:'16px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
                                    <i className={`fa-solid ${s.icon}`} style={{ color:s.color, fontSize:'1.2rem' }} />
                                </div>
                                <div style={{ fontSize:'clamp(2rem,5vw,3rem)', fontWeight:'900', color:s.color, fontFamily:"'Outfit',sans-serif", lineHeight:1 }}>
                                    {s.v.toLocaleString()}{s.suf}
                                </div>
                                <div style={{ color:'#fff', fontWeight:'700', fontSize:'0.9rem', marginTop:'8px' }}>{s.label}</div>
                                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.75rem', marginTop:'3px' }}>{s.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                HOW IT WORKS — timeline view
            ══════════════════════════════════════════════════ */}
            <section style={{ padding:'6rem 0', background:'#f8fafc' }}>
                <div className="container">
                    <div style={{ textAlign:'center', marginBottom:'4rem' }}>
                        <span style={{ background:'#dbeafe', color:'#1d4ed8', fontWeight:'700', fontSize:'0.72rem', padding:'4px 12px', borderRadius:'99px', letterSpacing:'0.07em', textTransform:'uppercase' }}>For Citizens</span>
                        <h2 style={{ marginTop:'1rem', marginBottom:'0.75rem', fontSize:'clamp(1.8rem,4vw,2.4rem)' }}>Report waste in 30 seconds</h2>
                        <p style={{ color:'#64748b', maxWidth:'480px', margin:'0 auto', fontSize:'1rem' }}>No training. No forms. Just open the app, shoot, and let the AI do the rest.</p>
                    </div>

                    <div style={{ maxWidth:'720px', margin:'0 auto' }}>
                        {[
                            { n:'1', icon:'fa-camera',   color:'#10b981', title:'Photograph the Waste',    desc:'Open MIBA, point your camera at any waste pile, and tap Report. Works on any smartphone.' },
                            { n:'2', icon:'fa-robot',    color:'#f59e0b', title:'AI Analyses in < 3s',     desc:'Advanced vision models detect the waste, classify it, and write a report — all automatically.' },
                            { n:'3', icon:'fa-rupee-sign',color:'#8b5cf6', title:'See ₹ Value Instantly',   desc:'Scrap market rate, carbon credit, and MIBA token value shown right after scan.' },
                            { n:'4', icon:'fa-truck',    color:'#3b82f6', title:'Collector Dispatched',     desc:'Supervisor AI assigns the nearest collector. You can track pickup status live.' },
                        ].map((s,i)=>(
                            <div key={s.n} style={{ display:'flex', gap:'1.5rem', marginBottom: i < 3 ? '0' : '0' }}>
                                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                                    <div style={{ width:'52px', height:'52px', borderRadius:'14px', background: i===0?'#d1fae5':i===1?'#fef3c7':i===2?'#ede9fe':'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                        <i className={`fa-solid ${s.icon}`} style={{ color:s.color, fontSize:'1.1rem' }} />
                                    </div>
                                    {i < 3 && <div style={{ width:'2px', flex:1, background:'#e2e8f0', margin:'8px 0', minHeight:'40px' }} />}
                                </div>
                                <div style={{ paddingBottom: i < 3 ? '2rem' : 0 }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                                        <span style={{ fontSize:'0.7rem', fontWeight:'800', color:s.color, textTransform:'uppercase', letterSpacing:'0.07em' }}>Step {s.n}</span>
                                    </div>
                                    <h3 style={{ fontSize:'1.05rem', marginBottom:'6px', color:'#0f172a' }}>{s.title}</h3>
                                    <p style={{ fontSize:'0.9rem', color:'#64748b', lineHeight:1.6, margin:0 }}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                CTA
            ══════════════════════════════════════════════════ */}
            <section style={{ background:'#fff', padding:'6rem 0', borderTop:'1px solid #f1f5f9' }}>
                <div className="container" style={{ maxWidth:'760px', textAlign:'center' }}>
                    <div style={{ background:'linear-gradient(135deg,#022c22,#064e3b)', borderRadius:'28px', padding:'4rem 3rem', position:'relative', overflow:'hidden' }}>
                        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.15) 0%,transparent 70%)', pointerEvents:'none' }} />
                        <div style={{ position:'relative' }}>
                            <span style={{ background:'rgba(16,185,129,0.18)', border:'1px solid rgba(16,185,129,0.3)', color:'#6ee7b7', fontWeight:'700', fontSize:'0.72rem', padding:'4px 14px', borderRadius:'99px', letterSpacing:'0.08em', textTransform:'uppercase' }}>
                                <i className="fa-solid fa-sparkles" style={{ marginRight:'6px' }} />Free to Start
                            </span>
                            <h2 style={{ color:'#fff', marginTop:'1.25rem', marginBottom:'1rem', fontSize:'clamp(1.8rem,4vw,2.6rem)', lineHeight:1.15 }}>
                                Join the mission.<br />Report India's first waste.
                            </h2>
                            <p style={{ color:'rgba(255,255,255,0.6)', marginBottom:'2.5rem', fontSize:'1rem', lineHeight:1.7 }}>
                                Every photo you take feeds the AI, builds the data layer, and pushes a work order to a collector. This is civic tech that actually works.
                            </p>
                            <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
                                <Link to="/register" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff', fontWeight:'700', fontSize:'0.95rem', padding:'14px 28px', borderRadius:'12px', boxShadow:'0 8px 24px rgba(16,185,129,0.4)', textDecoration:'none' }}>
                                    <i className="fa-solid fa-user-plus" /> Create Free Account
                                </Link>
                                <Link to="/ai-insights" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.09)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', fontWeight:'600', fontSize:'0.95rem', padding:'14px 28px', borderRadius:'12px', textDecoration:'none' }}>
                                    <i className="fa-solid fa-chart-line" /> View AI Insights
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @media (max-width: 768px) {
                    .hero-grid { grid-template-columns: 1fr !important; }
                    .hero-grid > div:last-child { display: none; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
}
