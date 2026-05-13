import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = (email) => `skillswap_profile_${email}`;
function loadProfile(email) {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY(email))); } catch { return null; }
}
function saveProfile(email, data) {
  localStorage.setItem(STORAGE_KEY(email), JSON.stringify(data));
}

const ALL_SKILLS = ['💻 Coding','🎨 Graphic Design','📚 Tutoring','✍️ Content Writing','🎬 Video Editing','📱 Digital Marketing','📊 Data Analysis'];
const TAG_OPTIONS = ['Graphic Design','Coding','Content Writing','Data Analysis','Tutoring','Video Editing','Digital Marketing','Other'];
const EMOJI_OPTIONS = ['🎨','💻','✍️','📊','📚','🎬','📱','🌸','⭐','🚀','💡','🎯','🔥','💎','🌟'];
const COLOR_OPTIONS = ['#ffd6e7','#e8f4fd','#f3e5f5','#e8f5e9','#fff9c4','#fce4ec','#e3f2fd','#f1f8e9'];

const DEFAULT_PROFILE = (email) => ({
  email, name:'', handle:email.split('@')[0],
  college:'', course:'', location:'',
  responseTime:'Usually within 2 hrs', avgHr:'₹0', bio:'',
  availability:'available', selectedSkills:[], portfolio:[], reviews:[],
  tasksCompleted:0, totalEarned:'₹0', monthEarned:'₹0', pendingEarned:'₹0',
});

function StarRating({ rating, onRate }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} onClick={() => onRate && onRate(i)}
          onMouseEnter={() => onRate && setHovered(i)}
          onMouseLeave={() => onRate && setHovered(0)}
          style={{ color:i<=(hovered||rating)?'#e91e8c':'#ffd6e7', fontSize:onRate?'22px':'14px', cursor:onRate?'pointer':'default' }}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [activeTab, setActiveTab] = useState('about');
  const [saveToast, setSaveToast] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [tmp, setTmp] = useState({});
  const [showAddWork, setShowAddWork] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState(null);
  const [newWork, setNewWork] = useState({ emoji:'🎨', title:'', tag:'Graphic Design', color:'#ffd6e7', link:'' });
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ name:'', rating:5, text:'' });
  const [onboardStep, setOnboardStep] = useState(1);
  const [onboardData, setOnboardData] = useState({ name:'', college:'', course:'', location:'', bio:'', avgHr:'₹0', selectedSkills:[] });

  useEffect(() => {
    setMounted(true);
    setSparkles(Array.from({ length:10 }, (_,i) => ({ id:i, left:Math.random()*100, top:Math.random()*100, delay:Math.random()*3, size:Math.random()*8+5 })));
    const email = localStorage.getItem('skillswap_current_user');
    if (!email) { navigate('/login'); return; }
    setCurrentUser(email);
    const saved = loadProfile(email);
    if (saved && saved.name) { setProfile(saved); setIsNewUser(false); }
    else { setIsNewUser(true); }
  }, [navigate]);

  const updateProfile = (changes) => {
    setProfile(prev => {
      const updated = { ...prev, ...changes };
      saveProfile(currentUser, updated);
      return updated;
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const finishOnboarding = () => {
    if (!onboardData.name.trim()) return;
    const fresh = { ...DEFAULT_PROFILE(currentUser), ...onboardData, handle:onboardData.name.toLowerCase().replace(/\s+/g,'.') };
    saveProfile(currentUser, fresh);
    setProfile(fresh);
    setIsNewUser(false);
  };

  const startEdit = () => { setTmp({ ...profile }); setEditingAbout(true); };
  const saveAbout = () => { updateProfile(tmp); setEditingAbout(false); };

  const openAddWork = () => { setNewWork({ emoji:'🎨', title:'', tag:'Graphic Design', color:'#ffd6e7', link:'' }); setEditingWorkId(null); setShowAddWork(true); };
  const openEditWork = (item) => { setNewWork({ ...item }); setEditingWorkId(item.id); setShowAddWork(true); };
  const saveWork = () => {
    if (!newWork.title.trim()) return;
    const updated = editingWorkId
      ? profile.portfolio.map(p => p.id===editingWorkId?{ ...newWork, id:editingWorkId }:p)
      : [...profile.portfolio, { ...newWork, id:Date.now() }];
    updateProfile({ portfolio:updated });
    setShowAddWork(false);
  };
  const deleteWork = (id) => updateProfile({ portfolio:profile.portfolio.filter(p=>p.id!==id) });
  const toggleSkill = (skill) => {
    const updated = profile.selectedSkills.includes(skill)
      ? profile.selectedSkills.filter(s=>s!==skill)
      : [...profile.selectedSkills, skill];
    updateProfile({ selectedSkills:updated });
  };
  const submitReview = () => {
    if (!newReview.name.trim()||!newReview.text.trim()) return;
    updateProfile({ reviews:[{ ...newReview, id:Date.now(), avatar:'🌟', date:'Just now' }, ...profile.reviews] });
    setNewReview({ name:'', rating:5, text:'' });
    setShowAddReview(false);
  };

  const avgRating = profile?.reviews?.length
    ? (profile.reviews.reduce((s,r)=>s+r.rating,0)/profile.reviews.length).toFixed(1) : '—';

  // ✅ HOME goes to /jobs (the logged-in feed), NOT to / (landing page)
  const goHome = () => navigate('/jobs');
  // ✅ LOGOUT clears session and goes to /login
  const logout = () => { localStorage.removeItem('skillswap_current_user'); navigate('/login'); };

  // ════ ONBOARDING ════
  if (isNewUser) {
    const steps = ['👋 Basic Info','🎓 College Details','🎀 Your Skills'];
    return (
      <div style={S.page}>
        <div style={S.blob1}/><div style={S.blob2}/><div style={S.blob3}/>
        {sparkles.map(s => <div key={s.id} style={{ ...S.sparkle, left:`${s.left}%`, top:`${s.top}%`, width:s.size, height:s.size, animationDelay:`${s.delay}s` }} />)}
        <nav style={S.nav}>
          <div style={S.logo} onClick={goHome}>SkillSwap 🌸</div>
          <button style={S.navBtnPink} onClick={logout}>🚪 Logout</button>
        </nav>
        <div style={{ ...S.container, maxWidth:'520px', opacity:mounted?1:0, transform:mounted?'translateY(0)':'translateY(24px)', transition:'all 0.6s ease' }}>
          <div style={S.onboardBanner}>
            <div style={{ fontSize:'52px', marginBottom:'12px' }}>🌸</div>
            <h1 style={S.onboardTitle}>Welcome to SkillSwap!</h1>
            <p style={S.onboardSub}>Logged in as <strong>{currentUser}</strong><br/>Let's set up your profile in 3 quick steps ✨</p>
          </div>
          <div style={S.stepRow}>
            {steps.map((label,i) => (
              <div key={i} style={S.stepItem}>
                <div style={{ ...S.stepDot, background:onboardStep>i?'#e91e8c':onboardStep===i+1?'linear-gradient(135deg,#e91e8c,#ff6eb4)':'#ffd6e7', color:onboardStep>=i+1?'#fff':'#c2698f' }}>
                  {onboardStep>i?'✓':i+1}
                </div>
                <div style={{ ...S.stepLabel, color:onboardStep===i+1?'#e91e8c':'#c2698f', fontWeight:onboardStep===i+1?'700':'400' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={S.sectionCard}>
            {onboardStep===1 && (
              <div style={S.fadeIn}>
                <h2 style={S.sectionTitle}>👋 Tell us about yourself</h2>
                <p style={{ fontSize:'13px', color:'#c2698f', marginBottom:'1.5rem' }}>This will be displayed on your public profile</p>
                {[
                  { label:'Full Name *', placeholder:'e.g. Sneha Reddy', key:'name' },
                  { label:'Location', placeholder:'e.g. Bengaluru, Karnataka', key:'location' },
                  { label:'Hourly Rate', placeholder:'e.g. ₹250', key:'avgHr' },
                ].map(f => (
                  <div key={f.key} style={S.fieldGroup}>
                    <label style={S.label}>{f.label}</label>
                    <input value={onboardData[f.key]} onChange={e=>setOnboardData(d=>({ ...d,[f.key]:e.target.value }))} placeholder={f.placeholder} style={S.minput} />
                  </div>
                ))}
                <div style={S.fieldGroup}>
                  <label style={S.label}>Bio 🌸</label>
                  <textarea value={onboardData.bio} onChange={e=>setOnboardData(d=>({ ...d,bio:e.target.value }))} rows={3} placeholder="Tell others what you're good at..." style={S.bioTextarea} />
                </div>
                <button style={{ ...S.saveBtn, width:'100%', marginTop:'1rem', opacity:onboardData.name.trim()?1:0.5 }}
                  onClick={() => onboardData.name.trim()&&setOnboardStep(2)}>
                  Next → College Details 🎓
                </button>
              </div>
            )}
            {onboardStep===2 && (
              <div style={S.fadeIn}>
                <h2 style={S.sectionTitle}>🎓 College Details</h2>
                <p style={{ fontSize:'13px', color:'#c2698f', marginBottom:'1.5rem' }}>Help others know which campus you're on</p>
                {[
                  { label:'College / University *', placeholder:'e.g. Amrita Vishwa Vidyapeetham', key:'college' },
                  { label:'Course & Year', placeholder:'e.g. B.Tech CSE — 3rd Year', key:'course' },
                ].map(f => (
                  <div key={f.key} style={S.fieldGroup}>
                    <label style={S.label}>{f.label}</label>
                    <input value={onboardData[f.key]} onChange={e=>setOnboardData(d=>({ ...d,[f.key]:e.target.value }))} placeholder={f.placeholder} style={S.minput} />
                  </div>
                ))}
                <div style={{ display:'flex', gap:'8px', marginTop:'1.5rem' }}>
                  <button style={S.cancelSmBtn} onClick={()=>setOnboardStep(1)}>← Back</button>
                  <button style={{ ...S.saveBtn, flex:1 }} onClick={()=>setOnboardStep(3)}>Next → Pick Skills 🎀</button>
                </div>
              </div>
            )}
            {onboardStep===3 && (
              <div style={S.fadeIn}>
                <h2 style={S.sectionTitle}>🎀 What can you do?</h2>
                <p style={{ fontSize:'13px', color:'#c2698f', marginBottom:'1.5rem' }}>Select all the skills you offer!</p>
                <div style={S.skillsGrid}>
                  {ALL_SKILLS.map((skill,i) => {
                    const active = onboardData.selectedSkills.includes(skill);
                    return (
                      <button key={i}
                        onClick={()=>setOnboardData(d=>({ ...d, selectedSkills:active?d.selectedSkills.filter(s=>s!==skill):[...d.selectedSkills,skill] }))}
                        style={{ ...S.skillChip, background:active?'linear-gradient(135deg,#e91e8c,#ff6eb4)':'#fff0f6', color:active?'#fff':'#9c5a7a', border:active?'none':'1.5px solid #ffd6e7', transform:active?'scale(1.05)':'scale(1)' }}>
                        {skill}{active&&<span style={{ marginLeft:'6px' }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display:'flex', gap:'8px', marginTop:'1.5rem' }}>
                  <button style={S.cancelSmBtn} onClick={()=>setOnboardStep(2)}>← Back</button>
                  <button style={{ ...S.saveBtn, flex:1 }} onClick={finishOnboarding}>🌸 Create My Profile!</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <style>{KEYFRAMES}</style>
      </div>
    );
  }

  if (!profile) return null;

  const tabs = [
    { id:'about', label:'🌸 About' },
    { id:'portfolio', label:'💅 Portfolio' },
    { id:'reviews', label:'⭐ Reviews' },
    { id:'skills', label:'🎀 Skills' },
  ];

  const infoRows = [
    { icon:'👤', label:'Full Name',     key:'name' },
    { icon:'🔗', label:'Username',      key:'handle' },
    { icon:'🎓', label:'College',       key:'college' },
    { icon:'📚', label:'Course',        key:'course' },
    { icon:'📍', label:'Location',      key:'location' },
    { icon:'💌', label:'Email',         val:profile.email, readOnly:true },
    { icon:'⚡', label:'Response Time', key:'responseTime' },
    { icon:'💰', label:'Avg/hr Rate',   key:'avgHr' },
  ];

  return (
    <div style={S.page}>
      <div style={S.blob1}/><div style={S.blob2}/><div style={S.blob3}/>
      {sparkles.map(s => <div key={s.id} style={{ ...S.sparkle, left:`${s.left}%`, top:`${s.top}%`, width:s.size, height:s.size, animationDelay:`${s.delay}s` }} />)}
      {saveToast && <div style={S.globalToast}>✅ Saved!</div>}

      {/* Portfolio Modal */}
      {showAddWork && (
        <div style={S.overlay} onClick={()=>setShowAddWork(false)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <h2 style={S.modalTitle}>{editingWorkId?'✏️ Edit Project':'➕ Add New Project'}</h2>
            <label style={S.mlabel}>Choose an Icon</label>
            <div style={S.emojiGrid}>
              {EMOJI_OPTIONS.map(em => (
                <button key={em} onClick={()=>setNewWork(p=>({ ...p,emoji:em }))}
                  style={{ ...S.emojiBtn, background:newWork.emoji===em?'#e91e8c':'#fff0f6' }}>{em}</button>
              ))}
            </div>
            <label style={S.mlabel}>Project Title *</label>
            <input value={newWork.title} onChange={e=>setNewWork(p=>({ ...p,title:e.target.value }))} placeholder="e.g. Brand Identity Design" style={S.minput} />
            <label style={S.mlabel}>Category</label>
            <select value={newWork.tag} onChange={e=>setNewWork(p=>({ ...p,tag:e.target.value }))} style={S.mselect}>
              {TAG_OPTIONS.map(t=><option key={t}>{t}</option>)}
            </select>
            <label style={S.mlabel}>Card Color</label>
            <div style={S.colorRow}>
              {COLOR_OPTIONS.map(c=>(
                <button key={c} onClick={()=>setNewWork(p=>({ ...p,color:c }))}
                  style={{ ...S.colorDot, background:c, border:newWork.color===c?'3px solid #e91e8c':'2px solid #ffd6e7' }} />
              ))}
            </div>
            <label style={S.mlabel}>Project Link (optional)</label>
            <input value={newWork.link} onChange={e=>setNewWork(p=>({ ...p,link:e.target.value }))} placeholder="https://..." style={S.minput} />
            <label style={S.mlabel}>Preview</label>
            <div style={{ ...S.portfolioCard, background:newWork.color, marginBottom:'1rem' }}>
              <div style={S.portfolioEmoji}>{newWork.emoji}</div>
              <div style={S.portfolioTag}>{newWork.tag.toUpperCase()}</div>
              <div style={S.portfolioTitle}>{newWork.title||'Your Project Title'}</div>
              <div style={S.portfolioView}>View Project →</div>
            </div>
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={saveWork} disabled={!newWork.title.trim()} style={{ ...S.saveBtn, opacity:newWork.title.trim()?1:0.5 }}>
                💾 {editingWorkId?'Save Changes':'Add Project'}
              </button>
              <button onClick={()=>setShowAddWork(false)} style={S.cancelSmBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NAV — Home → /jobs, Logout → /login */}
      <nav style={S.nav}>
        <div style={S.logo} onClick={goHome}>SkillSwap 🌸</div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ fontSize:'12px', color:'#c2698f', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            👤 {profile.email}
          </span>
          <button style={S.navBtn} onClick={goHome}>🏠 Home</button>
          <button style={S.navBtnPink} onClick={logout}>🚪 Logout</button>
        </div>
      </nav>

      <div style={{ ...S.container, opacity:mounted?1:0, transform:mounted?'translateY(0)':'translateY(24px)', transition:'all 0.6s ease' }}>

        {/* Header Card */}
        <div style={S.headerCard}>
          <div style={S.coverStrip}>
            <div style={S.coverPattern}>
              {['🌸','✨','💖','🎀','⭐','🌷','💫','🩷','🌸','✨','💖','🎀'].map((e,i)=>(
                <span key={i} style={{ ...S.coverEmoji, animationDelay:`${i*0.2}s` }}>{e}</span>
              ))}
            </div>
          </div>
          <div style={S.profileRow}>
            <div style={S.avatarWrap}>
              <div style={S.avatar}>🐱</div>
              <div style={S.availDot(profile.availability)} />
            </div>
            <div style={S.profileInfo}>
              <div style={S.nameRow}>
                <h1 style={S.name}>{profile.name} <span style={S.verifiedBadge}>✓ Verified</span></h1>
              </div>
              <p style={S.handleText}>@{profile.handle} · {profile.course} · {profile.college} 🎓</p>
              <div style={S.statsRow}>
                <div style={S.stat}><span style={S.statNum}>{profile.tasksCompleted}</span><span style={S.statLbl}>Tasks Done</span></div>
                <div style={S.statDiv}/>
                <div style={S.stat}><span style={S.statNum}>{avgRating}</span><span style={S.statLbl}>Rating ⭐</span></div>
                <div style={S.statDiv}/>
                <div style={S.stat}><span style={S.statNum}>{profile.reviews?.length||0}</span><span style={S.statLbl}>Reviews</span></div>
                <div style={S.statDiv}/>
                <div style={S.stat}><span style={S.statNum}>{profile.avgHr}</span><span style={S.statLbl}>Avg/hr</span></div>
              </div>
            </div>
            <div style={S.availSection}>
              <p style={S.availLabel}>Availability</p>
              <div style={S.availToggleRow}>
                {['available','busy'].map(a=>(
                  <button key={a} onClick={()=>updateProfile({ availability:a })}
                    style={{ ...S.availBtn, background:profile.availability===a?(a==='available'?'#e91e8c':'#9c5a7a'):'#fff0f6', color:profile.availability===a?'#fff':'#9c5a7a', border:`1.5px solid ${profile.availability===a?'transparent':'#ffd6e7'}` }}>
                    {a==='available'?'🟢 Open':'🔴 Busy'}
                  </button>
                ))}
              </div>
              <button style={S.editProfileBtn} onClick={()=>{ startEdit(); setActiveTab('about'); }}>✏️ Edit Profile</button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={S.tabBar}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              style={{ ...S.tab, background:activeTab===t.id?'#e91e8c':'transparent', color:activeTab===t.id?'#fff':'#c2698f', fontWeight:activeTab===t.id?'700':'500', boxShadow:activeTab===t.id?'0 4px 14px rgba(233,30,140,0.3)':'none' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ABOUT */}
        {activeTab==='about' && (
          <div style={S.fadeIn}>
            <div style={S.sectionCard}>
              <div style={S.sectionHeader}>
                <h2 style={S.sectionTitle}>About Me 🌸</h2>
                {!editingAbout
                  ? <button style={S.smallEditBtn} onClick={startEdit}>✏️ Edit</button>
                  : <div style={{ display:'flex', gap:'8px' }}>
                      <button style={S.saveBtn} onClick={saveAbout}>💾 Save All</button>
                      <button style={S.cancelSmBtn} onClick={()=>setEditingAbout(false)}>Cancel</button>
                    </div>
                }
              </div>
              {editingAbout
                ? <textarea value={tmp.bio||''} onChange={e=>setTmp(p=>({ ...p,bio:e.target.value }))} rows={4} style={S.bioTextarea} placeholder="Tell others about yourself 🌸" />
                : <p style={S.bioText}>{profile.bio||<span style={{ color:'#c2698f', fontStyle:'italic' }}>No bio yet — click Edit to add one 🌸</span>}</p>
              }
            </div>
            <div style={S.infoGrid}>
              {infoRows.map((item,i)=>(
                <div key={i} style={S.infoCard}>
                  <span style={S.infoIcon}>{item.icon}</span>
                  <div style={S.infoTextBlock}>
                    <div style={S.infoLabel}>{item.label}</div>
                    {editingAbout&&!item.readOnly
                      ? <input value={tmp[item.key]||''} onChange={e=>setTmp(p=>({ ...p,[item.key]:e.target.value }))} style={S.inlineInput} />
                      : <div style={S.infoValue}>{item.val||profile[item.key]||<span style={{ color:'#ffd6e7' }}>—</span>}</div>
                    }
                  </div>
                </div>
              ))}
            </div>
            <div style={S.sectionCard}>
              <h2 style={S.sectionTitle}>Active Tasks 🎯</h2>
              <div style={{ textAlign:'center', padding:'1.5rem', color:'#c2698f', fontSize:'14px' }}>
                <div style={{ fontSize:'36px', marginBottom:'8px' }}>🌸</div>
                No active tasks yet —{' '}
                <span style={{ color:'#e91e8c', cursor:'pointer', fontWeight:'600' }} onClick={goHome}>
                  browse jobs
                </span>{' '}to get started!
              </div>
            </div>
          </div>
        )}

        {/* PORTFOLIO */}
        {activeTab==='portfolio' && (
          <div style={S.fadeIn}>
            <div style={S.sectionCard}>
              <div style={S.sectionHeader}>
                <h2 style={S.sectionTitle}>My Portfolio 💅</h2>
                <button style={S.smallEditBtn} onClick={openAddWork}>➕ Add Work</button>
              </div>
              {(!profile.portfolio||profile.portfolio.length===0)&&(
                <div style={S.emptyState}><div style={{ fontSize:'48px' }}>💅</div><p style={{ color:'#c2698f', fontSize:'14px', marginTop:'12px' }}>No projects yet! Click "Add Work" to showcase your first project.</p></div>
              )}
              <div style={S.portfolioGrid}>
                {(profile.portfolio||[]).map(p=>(
                  <div key={p.id}>
                    <div style={{ ...S.portfolioCard, background:p.color }}
                      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-6px) scale(1.02)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(233,30,140,0.18)'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0) scale(1)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.06)'; }}>
                      <div style={S.portfolioEmoji}>{p.emoji}</div>
                      <div style={S.portfolioTag}>{p.tag.toUpperCase()}</div>
                      <div style={S.portfolioTitle}>{p.title}</div>
                      {p.link
                        ? <a href={p.link} target="_blank" rel="noreferrer" style={{ ...S.portfolioView, textDecoration:'none' }}>View Project →</a>
                        : <div style={S.portfolioView}>View Project →</div>
                      }
                    </div>
                    <div style={S.cardActions}>
                      <button style={S.cardActionBtn} onClick={()=>openEditWork(p)}>✏️</button>
                      <button style={{ ...S.cardActionBtn, background:'#fce4ec' }} onClick={()=>deleteWork(p.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {activeTab==='reviews' && (
          <div style={S.fadeIn}>
            <div style={{ ...S.sectionCard, textAlign:'center', marginBottom:'16px' }}>
              <div style={S.bigRating}>{avgRating} ⭐</div>
              <div style={S.ratingLabel}>Based on {profile.reviews?.length||0} reviews</div>
              {[5,4,3,2,1].map(star=>{
                const count=(profile.reviews||[]).filter(r=>r.rating===star).length;
                const pct=profile.reviews?.length?Math.round(count/profile.reviews.length*100):0;
                return (
                  <div key={star} style={S.ratingBarRow}>
                    <span style={S.ratingBarStar}>{star}★</span>
                    <div style={S.ratingBarBg}><div style={{ ...S.ratingBarFill, width:`${pct}%` }} /></div>
                    <span style={{ fontSize:'11px', color:'#c2698f', width:'28px' }}>{pct}%</span>
                  </div>
                );
              })}
              <button style={{ ...S.smallEditBtn, marginTop:'1rem' }} onClick={()=>setShowAddReview(v=>!v)}>
                {showAddReview?'✕ Cancel':'➕ Add Review'}
              </button>
            </div>
            {showAddReview&&(
              <div style={{ ...S.sectionCard, marginBottom:'16px' }}>
                <h3 style={{ ...S.sectionTitle, marginBottom:'1rem' }}>Write a Review ✨</h3>
                <label style={S.label}>Your Name</label>
                <input value={newReview.name} onChange={e=>setNewReview(p=>({ ...p,name:e.target.value }))} placeholder="Your name" style={{ ...S.minput, marginTop:'6px', marginBottom:'12px' }} />
                <label style={S.label}>Rating</label>
                <div style={{ margin:'8px 0 12px' }}><StarRating rating={newReview.rating} onRate={r=>setNewReview(p=>({ ...p,rating:r }))} /></div>
                <label style={S.label}>Review</label>
                <textarea value={newReview.text} onChange={e=>setNewReview(p=>({ ...p,text:e.target.value }))} rows={3} placeholder="Share your experience... 🌸" style={{ ...S.bioTextarea, marginTop:'6px' }} />
                <div style={{ display:'flex', gap:'8px', marginTop:'10px' }}>
                  <button style={{ ...S.saveBtn, opacity:newReview.name.trim()&&newReview.text.trim()?1:0.5 }} onClick={submitReview} disabled={!newReview.name.trim()||!newReview.text.trim()}>💾 Submit</button>
                  <button style={S.cancelSmBtn} onClick={()=>setShowAddReview(false)}>Cancel</button>
                </div>
              </div>
            )}
            {(!profile.reviews||profile.reviews.length===0)&&!showAddReview&&(
              <div style={S.emptyState}><div style={{ fontSize:'36px' }}>⭐</div><p style={{ color:'#c2698f' }}>No reviews yet!</p></div>
            )}
            {(profile.reviews||[]).map(r=>(
              <div key={r.id} style={S.reviewCard}
                onMouseEnter={e=>e.currentTarget.style.boxShadow='0 8px 30px rgba(233,30,140,0.12)'}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.05)'}>
                <div style={S.reviewTop}>
                  <div style={S.reviewAvatar}>{r.avatar}</div>
                  <div><div style={S.reviewName}>{r.name}</div><StarRating rating={r.rating} /></div>
                  <div style={S.reviewDate}>{r.date}</div>
                </div>
                <p style={S.reviewText}>{r.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* SKILLS */}
        {activeTab==='skills' && (
          <div style={S.fadeIn}>
            <div style={S.sectionCard}>
              <h2 style={S.sectionTitle}>My Skills 🎀</h2>
              <p style={S.skillsHint}>Tap to toggle — saved automatically!</p>
              <div style={S.skillsGrid}>
                {ALL_SKILLS.map((skill,i)=>{
                  const active=(profile.selectedSkills||[]).includes(skill);
                  return (
                    <button key={i} onClick={()=>toggleSkill(skill)}
                      style={{ ...S.skillChip, background:active?'linear-gradient(135deg,#e91e8c,#ff6eb4)':'#fff0f6', color:active?'#fff':'#9c5a7a', border:active?'none':'1.5px solid #ffd6e7', transform:active?'scale(1.05)':'scale(1)' }}>
                      {skill}{active&&<span style={{ marginLeft:'6px' }}>✓</span>}
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize:'13px', color:'#c2698f', marginTop:'1rem' }}>{(profile.selectedSkills||[]).length} skills selected ✨</p>
            </div>
            <div style={S.sectionCard}>
              <h2 style={S.sectionTitle}>Earnings Overview 💰</h2>
              <div style={S.earningsGrid}>
                {[
                  { label:'This Month',  value:profile.monthEarned||'₹0',   icon:'📅', color:'#e91e8c' },
                  { label:'Total Earned',value:profile.totalEarned||'₹0',   icon:'💖', color:'#ff6eb4' },
                  { label:'Pending',     value:profile.pendingEarned||'₹0', icon:'⏳', color:'#c2698f' },
                  { label:'Tasks Done',  value:profile.tasksCompleted||0,   icon:'✅', color:'#9c5a7a' },
                ].map((e,i)=>(
                  <div key={i} style={S.earningCard}>
                    <div style={S.earningIcon}>{e.icon}</div>
                    <div style={{ ...S.earningValue, color:e.color }}>{e.value}</div>
                    <div style={S.earningLabel}>{e.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{KEYFRAMES}</style>
    </div>
  );
}

const KEYFRAMES = `
  @keyframes blobFloat  { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,-20px) scale(1.05)} 66%{transform:translate(-10px,15px) scale(0.97)} }
  @keyframes sparkleAnim{ 0%,100%{opacity:0;transform:scale(0.5) rotate(0deg)} 50%{opacity:1;transform:scale(1) rotate(180deg)} }
  @keyframes coverDrift { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-8px)} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse      { 0%,100%{box-shadow:0 0 0 0 rgba(233,30,140,0.4)} 50%{box-shadow:0 0 0 6px rgba(233,30,140,0)} }
  @keyframes modalPop   { 0%{transform:scale(0.88) translateY(20px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
  @keyframes toastIn    { 0%{opacity:0;transform:translateX(-50%) translateY(10px)} 100%{opacity:1;transform:translateX(-50%) translateY(0)} }
`;

const S = {
  page:          { minHeight:'100vh', background:'linear-gradient(135deg,#fff0f6 0%,#fff8fb 60%,#fce4ec 100%)', fontFamily:'Segoe UI,sans-serif', position:'relative', overflowX:'hidden' },
  blob1:         { position:'fixed', top:'-100px', left:'-100px', width:'350px', height:'350px', background:'radial-gradient(circle,rgba(233,30,140,0.12) 0%,transparent 70%)', borderRadius:'50%', animation:'blobFloat 8s ease-in-out infinite', pointerEvents:'none', zIndex:0 },
  blob2:         { position:'fixed', bottom:'-80px', right:'-80px', width:'300px', height:'300px', background:'radial-gradient(circle,rgba(255,105,180,0.15) 0%,transparent 70%)', borderRadius:'50%', animation:'blobFloat 10s ease-in-out infinite reverse', pointerEvents:'none', zIndex:0 },
  blob3:         { position:'fixed', top:'45%', right:'5%', width:'180px', height:'180px', background:'radial-gradient(circle,rgba(255,182,193,0.2) 0%,transparent 70%)', borderRadius:'50%', animation:'blobFloat 13s ease-in-out infinite', pointerEvents:'none', zIndex:0 },
  sparkle:       { position:'fixed', background:'radial-gradient(circle,#e91e8c,#ffb6c1)', borderRadius:'50%', animation:'sparkleAnim 3s ease-in-out infinite', pointerEvents:'none', zIndex:0, opacity:0 },
  globalToast:   { position:'fixed', bottom:'28px', left:'50%', transform:'translateX(-50%)', background:'#e91e8c', color:'#fff', padding:'10px 24px', borderRadius:'20px', fontSize:'14px', fontWeight:'700', zIndex:9999, boxShadow:'0 6px 20px rgba(233,30,140,0.35)', animation:'toastIn 0.3s ease' },
  onboardBanner: { background:'rgba(255,255,255,0.95)', borderRadius:'24px', border:'1.5px solid #ffd6e7', padding:'2rem', textAlign:'center', marginBottom:'20px', boxShadow:'0 12px 40px rgba(233,30,140,0.08)' },
  onboardTitle:  { fontSize:'26px', fontWeight:'800', color:'#3d1a2e', margin:'0 0 8px' },
  onboardSub:    { fontSize:'14px', color:'#9c5a7a', lineHeight:'1.6', margin:0 },
  stepRow:       { display:'flex', justifyContent:'space-between', marginBottom:'20px', background:'rgba(255,255,255,0.8)', borderRadius:'16px', padding:'14px 20px', border:'1.5px solid #ffd6e7' },
  stepItem:      { display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' },
  stepDot:       { width:'32px', height:'32px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'700' },
  stepLabel:     { fontSize:'11px', textAlign:'center', maxWidth:'80px' },
  overlay:       { position:'fixed', inset:0, background:'rgba(61,26,46,0.45)', backdropFilter:'blur(6px)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', overflowY:'auto' },
  modal:         { background:'#fff', borderRadius:'24px', padding:'2rem', width:'100%', maxWidth:'420px', boxShadow:'0 30px 80px rgba(233,30,140,0.2)', border:'1.5px solid #ffd6e7', animation:'modalPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards', maxHeight:'90vh', overflowY:'auto' },
  modalTitle:    { fontSize:'20px', fontWeight:'800', color:'#3d1a2e', marginBottom:'1.25rem', textAlign:'center' },
  mlabel:        { display:'block', fontSize:'12px', fontWeight:'700', color:'#9c5a7a', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'6px', marginTop:'12px' },
  minput:        { width:'100%', border:'1.5px solid #ffd6e7', borderRadius:'10px', padding:'10px 12px', fontSize:'14px', color:'#3d1a2e', fontFamily:'Segoe UI,sans-serif', outline:'none', background:'#fff8fb', boxSizing:'border-box' },
  mselect:       { width:'100%', border:'1.5px solid #ffd6e7', borderRadius:'10px', padding:'10px 12px', fontSize:'14px', color:'#3d1a2e', fontFamily:'Segoe UI,sans-serif', outline:'none', background:'#fff8fb', boxSizing:'border-box' },
  emojiGrid:     { display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'4px' },
  emojiBtn:      { width:'40px', height:'40px', border:'none', borderRadius:'10px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' },
  colorRow:      { display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'4px' },
  colorDot:      { width:'28px', height:'28px', borderRadius:'50%', cursor:'pointer' },
  nav:           { background:'rgba(255,255,255,0.88)', backdropFilter:'blur(12px)', borderBottom:'1px solid #ffd6e7', padding:'0 2rem', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 },
  logo:          { fontSize:'20px', fontWeight:'700', color:'#e91e8c', cursor:'pointer' },
  navBtn:        { background:'none', border:'1.5px solid #ffd6e7', padding:'7px 16px', borderRadius:'20px', cursor:'pointer', fontSize:'13px', color:'#e91e8c', fontWeight:'600', fontFamily:'Segoe UI,sans-serif' },
  navBtnPink:    { background:'#e91e8c', border:'none', padding:'7px 16px', borderRadius:'20px', cursor:'pointer', fontSize:'13px', color:'#fff', fontWeight:'600', fontFamily:'Segoe UI,sans-serif' },
  container:     { maxWidth:'860px', margin:'0 auto', padding:'2rem 1rem 4rem', position:'relative', zIndex:1 },
  headerCard:    { background:'rgba(255,255,255,0.95)', borderRadius:'28px', border:'1.5px solid #ffd6e7', boxShadow:'0 20px 60px rgba(233,30,140,0.1)', overflow:'hidden', marginBottom:'20px' },
  coverStrip:    { height:'90px', background:'linear-gradient(135deg,#e91e8c 0%,#ff6eb4 50%,#ffb6c1 100%)', display:'flex', alignItems:'center', overflow:'hidden' },
  coverPattern:  { display:'flex', gap:'18px', padding:'0 24px', animation:'coverDrift 4s ease-in-out infinite' },
  coverEmoji:    { fontSize:'22px', opacity:0.7 },
  profileRow:    { display:'flex', alignItems:'flex-start', gap:'20px', padding:'0 2rem 2rem', flexWrap:'wrap' },
  avatarWrap:    { position:'relative', marginTop:'-36px', flexShrink:0 },
  avatar:        { width:'88px', height:'88px', borderRadius:'50%', background:'linear-gradient(135deg,#ffd6e7,#fff0f6)', border:'4px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'44px', boxShadow:'0 8px 24px rgba(233,30,140,0.2)' },
  availDot:      (a)=>({ position:'absolute', bottom:'4px', right:'4px', width:'18px', height:'18px', borderRadius:'50%', background:a==='available'?'#4caf50':'#e91e8c', border:'3px solid #fff', animation:'pulse 2s ease-in-out infinite' }),
  profileInfo:   { flex:1, paddingTop:'12px', minWidth:'200px' },
  nameRow:       { display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' },
  name:          { fontSize:'22px', fontWeight:'800', color:'#3d1a2e', margin:0 },
  verifiedBadge: { background:'linear-gradient(135deg,#e91e8c,#ff6eb4)', color:'#fff', fontSize:'11px', padding:'3px 10px', borderRadius:'20px', fontWeight:'700' },
  handleText:    { fontSize:'13px', color:'#c2698f', margin:'4px 0 12px' },
  statsRow:      { display:'flex', alignItems:'center', flexWrap:'wrap' },
  stat:          { display:'flex', flexDirection:'column', alignItems:'center', paddingRight:'16px' },
  statNum:       { fontSize:'18px', fontWeight:'800', color:'#e91e8c' },
  statLbl:       { fontSize:'11px', color:'#c2698f', marginTop:'2px' },
  statDiv:       { width:'1px', height:'28px', background:'#ffd6e7', marginRight:'16px' },
  availSection:  { display:'flex', flexDirection:'column', gap:'8px', paddingTop:'12px', alignItems:'flex-end' },
  availLabel:    { fontSize:'12px', color:'#c2698f', fontWeight:'600', margin:0 },
  availToggleRow:{ display:'flex', gap:'6px' },
  availBtn:      { padding:'6px 14px', borderRadius:'20px', cursor:'pointer', fontSize:'12px', fontWeight:'600', fontFamily:'Segoe UI,sans-serif', transition:'all 0.2s' },
  editProfileBtn:{ background:'none', border:'1.5px solid #ffd6e7', padding:'7px 16px', borderRadius:'20px', cursor:'pointer', fontSize:'13px', color:'#e91e8c', fontWeight:'600', fontFamily:'Segoe UI,sans-serif', marginTop:'4px' },
  tabBar:        { display:'flex', gap:'8px', marginBottom:'16px', background:'rgba(255,255,255,0.8)', borderRadius:'20px', padding:'6px', border:'1.5px solid #ffd6e7', flexWrap:'wrap' },
  tab:           { flex:1, padding:'9px 16px', borderRadius:'14px', border:'none', cursor:'pointer', fontSize:'13px', transition:'all 0.25s', fontFamily:'Segoe UI,sans-serif', minWidth:'100px' },
  fadeIn:        { animation:'fadeUp 0.4s ease forwards' },
  sectionCard:   { background:'rgba(255,255,255,0.95)', borderRadius:'20px', border:'1.5px solid #ffd6e7', padding:'1.5rem', marginBottom:'16px', boxShadow:'0 4px 20px rgba(233,30,140,0.06)' },
  sectionHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' },
  sectionTitle:  { fontSize:'18px', fontWeight:'800', color:'#3d1a2e', margin:0 },
  smallEditBtn:  { background:'#fff0f6', border:'1.5px solid #ffd6e7', padding:'6px 14px', borderRadius:'14px', cursor:'pointer', fontSize:'12px', color:'#e91e8c', fontWeight:'600', fontFamily:'Segoe UI,sans-serif' },
  saveBtn:       { background:'linear-gradient(135deg,#e91e8c,#ff6eb4)', border:'none', color:'#fff', padding:'8px 20px', borderRadius:'12px', cursor:'pointer', fontSize:'13px', fontWeight:'700', fontFamily:'Segoe UI,sans-serif' },
  cancelSmBtn:   { background:'none', border:'1.5px solid #ffd6e7', color:'#c2698f', padding:'8px 16px', borderRadius:'12px', cursor:'pointer', fontSize:'13px', fontFamily:'Segoe UI,sans-serif' },
  bioText:       { fontSize:'14px', color:'#9c5a7a', lineHeight:'1.75', margin:0 },
  bioTextarea:   { width:'100%', border:'1.5px solid #ffd6e7', borderRadius:'12px', padding:'12px', fontSize:'14px', color:'#3d1a2e', fontFamily:'Segoe UI,sans-serif', resize:'vertical', outline:'none', background:'#fff8fb', boxSizing:'border-box', lineHeight:'1.7' },
  infoGrid:      { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'12px', marginBottom:'16px' },
  infoCard:      { background:'rgba(255,255,255,0.95)', border:'1.5px solid #ffd6e7', borderRadius:'16px', padding:'14px 16px', display:'flex', alignItems:'center', gap:'12px', minWidth:0, overflow:'hidden' },
  infoIcon:      { fontSize:'22px', flexShrink:0 },
  infoTextBlock: { flex:1, minWidth:0 },
  infoLabel:     { fontSize:'11px', color:'#c2698f', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.5px' },
  infoValue:     { fontSize:'13px', color:'#3d1a2e', fontWeight:'600', marginTop:'2px', wordBreak:'break-all', overflowWrap:'anywhere', whiteSpace:'normal' },
  inlineInput:   { width:'100%', border:'1.5px solid #ffd6e7', borderRadius:'8px', padding:'6px 10px', fontSize:'13px', color:'#3d1a2e', fontFamily:'Segoe UI,sans-serif', outline:'none', background:'#fff8fb', boxSizing:'border-box', marginTop:'2px' },
  portfolioGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'14px' },
  portfolioCard: { borderRadius:'18px', padding:'1.5rem 1.25rem', cursor:'pointer', transition:'all 0.3s ease', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1.5px solid rgba(233,30,140,0.1)' },
  portfolioEmoji:{ fontSize:'36px', marginBottom:'10px' },
  portfolioTag:  { fontSize:'11px', color:'#e91e8c', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'6px' },
  portfolioTitle:{ fontSize:'14px', fontWeight:'700', color:'#3d1a2e', lineHeight:'1.4', marginBottom:'10px' },
  portfolioView: { fontSize:'12px', color:'#e91e8c', fontWeight:'600' },
  cardActions:   { display:'flex', gap:'6px', marginTop:'8px', justifyContent:'flex-end' },
  cardActionBtn: { background:'#fff0f6', border:'1.5px solid #ffd6e7', borderRadius:'10px', padding:'5px 10px', cursor:'pointer', fontSize:'14px', fontFamily:'Segoe UI,sans-serif' },
  emptyState:    { textAlign:'center', padding:'2rem 1rem' },
  bigRating:     { fontSize:'42px', fontWeight:'800', color:'#e91e8c' },
  ratingLabel:   { fontSize:'13px', color:'#c2698f', marginBottom:'12px' },
  ratingBarRow:  { display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px', justifyContent:'center' },
  ratingBarStar: { fontSize:'12px', color:'#e91e8c', width:'20px', textAlign:'right' },
  ratingBarBg:   { width:'140px', height:'7px', background:'#ffd6e7', borderRadius:'10px', overflow:'hidden' },
  ratingBarFill: { height:'100%', background:'linear-gradient(90deg,#e91e8c,#ff6eb4)', borderRadius:'10px', transition:'width 0.6s ease' },
  reviewCard:    { background:'rgba(255,255,255,0.95)', border:'1.5px solid #ffd6e7', borderRadius:'18px', padding:'1.25rem', marginBottom:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', transition:'box-shadow 0.2s' },
  reviewTop:     { display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px' },
  reviewAvatar:  { fontSize:'30px', width:'44px', height:'44px', background:'#fff0f6', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'1.5px solid #ffd6e7', flexShrink:0 },
  reviewName:    { fontSize:'14px', fontWeight:'700', color:'#3d1a2e', marginBottom:'2px' },
  reviewDate:    { marginLeft:'auto', fontSize:'11px', color:'#c2698f' },
  reviewText:    { fontSize:'13px', color:'#9c5a7a', lineHeight:'1.65', margin:0 },
  skillsHint:    { fontSize:'13px', color:'#c2698f', marginBottom:'1rem', marginTop:'-4px' },
  skillsGrid:    { display:'flex', flexWrap:'wrap', gap:'10px' },
  skillChip:     { padding:'10px 18px', borderRadius:'20px', cursor:'pointer', fontSize:'14px', fontWeight:'600', fontFamily:'Segoe UI,sans-serif', transition:'all 0.25s ease' },
  earningsGrid:  { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:'12px', marginTop:'8px' },
  earningCard:   { background:'#fff8fb', border:'1.5px solid #ffd6e7', borderRadius:'16px', padding:'1.25rem', textAlign:'center' },
  earningIcon:   { fontSize:'28px', marginBottom:'8px' },
  earningValue:  { fontSize:'22px', fontWeight:'800', marginBottom:'4px' },
  earningLabel:  { fontSize:'12px', color:'#c2698f', fontWeight:'500' },
  fieldGroup:    { display:'flex', flexDirection:'column', gap:'6px', marginBottom:'12px' },
  label:         { fontSize:'13px', fontWeight:'600', color:'#3d1a2e' },
};