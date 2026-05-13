import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SAMPLE_JOBS = [
  { id: 1, title: 'Build a React Portfolio Website', category: 'Coding', budget: '₹2,500', duration: '3 days', location: 'Remote', skills: ['React', 'CSS', 'JavaScript'], eligibility: 'Any student', postedBy: 'Priya S.', postedAt: '2 hours ago', urgent: true, description: 'Need a clean, modern portfolio website built in React. Must include home, about, projects, and contact sections. Responsive design required.', avatar: '👩‍💻' },
  { id: 2, title: 'Logo Design for Student Club', category: 'Design', budget: '₹800', duration: '2 days', location: 'Remote', skills: ['Illustrator', 'Canva', 'Branding'], eligibility: 'Design students preferred', postedBy: 'Arjun K.', postedAt: '5 hours ago', urgent: false, description: 'We need a fun, modern logo for our college coding club. Provide 3 concepts in PNG + SVG.', avatar: '🎨' },
  { id: 3, title: 'Python Data Analysis for Project', category: 'Coding', budget: '₹1,800', duration: '5 days', location: 'Remote', skills: ['Python', 'Pandas', 'Matplotlib'], eligibility: 'CS/IT students', postedBy: 'Sneha R.', postedAt: '1 day ago', urgent: false, description: 'Analyze a dataset of 10,000 rows, clean the data, and produce 5 visualizations with insights report.', avatar: '📊' },
  { id: 4, title: 'Math Tutoring – 10th Grade', category: 'Tutoring', budget: '₹400/hr', duration: 'Ongoing', location: 'Bangalore / Online', skills: ['Algebra', 'Geometry', 'Patience'], eligibility: 'Strong math background', postedBy: 'Kavya M.', postedAt: '3 hours ago', urgent: true, description: 'My sister needs help with 10th grade CBSE math. 1 hour sessions 3x per week. Flexible timing.', avatar: '📚' },
  { id: 5, title: 'Social Media Content (1 week)', category: 'Content', budget: '₹1,200', duration: '7 days', location: 'Remote', skills: ['Copywriting', 'Instagram', 'Canva'], eligibility: 'Marketing/Comm students', postedBy: 'Rahul T.', postedAt: '6 hours ago', urgent: false, description: '14 posts (captions + images) for Instagram and LinkedIn for a small bakery. Fun, warm tone.', avatar: '📱' },
  { id: 6, title: 'Fix Bugs in Django Backend', category: 'Coding', budget: '₹3,000', duration: '2 days', location: 'Remote', skills: ['Django', 'Python', 'REST API'], eligibility: 'Backend experience required', postedBy: 'Meera P.', postedAt: '30 min ago', urgent: true, description: 'Our Django REST API has 3 known bugs affecting auth and file uploads. Need someone experienced to squash them fast.', avatar: '🐛' },
  { id: 7, title: 'Video Editing – College Fest Reel', category: 'Video', budget: '₹1,500', duration: '3 days', location: 'Remote', skills: ['Premiere Pro', 'After Effects', 'Reels'], eligibility: 'Any student', postedBy: 'Aarav N.', postedAt: '2 days ago', urgent: false, description: 'Edit a 60-second Instagram reel from raw footage of our college annual fest. Trendy cuts and music sync.', avatar: '🎬' },
  { id: 8, title: 'English Essay Proofreading', category: 'Content', budget: '₹500', duration: '1 day', location: 'Remote', skills: ['English', 'Proofreading', 'Academic Writing'], eligibility: 'English/Journalism students', postedBy: 'Divya L.', postedAt: '4 hours ago', urgent: true, description: 'Proofread and improve a 3,000-word academic essay on climate change. Grammar, flow, and citations.', avatar: '✍️' },
  { id: 9, title: 'Figma UI Design – Mobile App', category: 'Design', budget: '₹4,000', duration: '1 week', location: 'Remote', skills: ['Figma', 'UI/UX', 'Mobile Design'], eligibility: 'Design students only', postedBy: 'Kiran V.', postedAt: '1 day ago', urgent: false, description: 'Design 10 screens for a food delivery app in Figma. Include components, auto-layout, and a style guide.', avatar: '📱' },
  { id: 10, title: 'WordPress Blog Setup', category: 'Coding', budget: '₹2,000', duration: '2 days', location: 'Remote', skills: ['WordPress', 'CSS', 'Plugins'], eligibility: 'Any student', postedBy: 'Ananya B.', postedAt: '8 hours ago', urgent: false, description: 'Set up a WordPress blog with a premium theme, essential plugins, and 3 sample posts. Must be SEO-ready.', avatar: '🌐' },
  { id: 11, title: 'Physics Tutor – JEE Prep', category: 'Tutoring', budget: '₹600/hr', duration: 'Ongoing', location: 'Chennai / Online', skills: ['Physics', 'JEE', 'Problem Solving'], eligibility: 'JEE qualified or equivalent', postedBy: 'Rohan S.', postedAt: '12 hours ago', urgent: false, description: 'Looking for a physics tutor for JEE Advanced preparation. 2 sessions per week, 1.5 hours each.', avatar: '⚛️' },
  { id: 12, title: 'Voiceover for Explainer Video', category: 'Video', budget: '₹700', duration: '1 day', location: 'Remote', skills: ['Clear Voice', 'Hindi or English', 'Recording'], eligibility: 'Any student', postedBy: 'Nisha G.', postedAt: '3 days ago', urgent: false, description: 'Need a clear, friendly voiceover for a 2-minute product explainer video. Script provided.', avatar: '🎙️' },
];

const CATEGORIES = ['All', 'Coding', 'Design', 'Tutoring', 'Content', 'Video'];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  @keyframes blobFloat { from{transform:scale(1) translate(0,0);} to{transform:scale(1.08) translate(15px,-15px);} }
  @keyframes shimmer { to{background-position:200% center;} }
  .job-card { animation: fadeUp 0.4s ease both; transition: transform 0.2s, box-shadow 0.2s; }
  .job-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(255,110,180,0.18) !important; }
  .skill-chip { display: inline-block; padding: 3px 10px; border-radius: 20px; background: rgba(255,182,214,0.25); color: #c0608a; font-size: 0.78rem; font-weight: 700; margin: 2px; }
  .cat-pill { border: 2px solid rgba(255,182,214,0.4); background: rgba(255,255,255,0.7); color: #b06090; border-radius: 20px; padding: 6px 16px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; font-family: 'Nunito', sans-serif; }
  .cat-pill:hover, .cat-pill.active { background: linear-gradient(135deg,#ff6eb4,#ff9bd2); color: #fff; border-color: transparent; }
  .nav-btn { background: none; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 0.9rem; color: #b06090; padding: 8px 14px; border-radius: 10px; transition: background 0.2s, color 0.2s; }
  .nav-btn:hover { background: rgba(255,110,180,0.1); color: #ff6eb4; }
  input:focus { border-color: #ff6eb4 !important; outline: none; }
  textarea:focus { border-color: #ff6eb4 !important; outline: none; }
  select:focus { border-color: #ff6eb4 !important; outline: none; }
  .pink-btn { background: linear-gradient(135deg,#ff6eb4,#ff9bd2); color: #fff; border: none; border-radius: 12px; padding: 11px 22px; font-weight: 800; font-size: 0.9rem; cursor: pointer; font-family: 'Nunito', sans-serif; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 16px rgba(255,110,180,0.3); }
  .pink-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,110,180,0.4); }
  .ghost-btn { background: rgba(255,255,255,0.8); border: 2px solid rgba(255,182,214,0.5); border-radius: 12px; padding: 9px 20px; font-weight: 700; font-size: 0.88rem; cursor: pointer; font-family: 'Nunito', sans-serif; color: #b06090; transition: border-color 0.2s, background 0.2s; }
  .ghost-btn:hover { border-color: #ff6eb4; background: #fff0f7; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #fff0f7; } ::-webkit-scrollbar-thumb { background: #ffb3d9; border-radius: 10px; }
`;

export default function Jobs() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sort, setSort] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showPostJob, setShowPostJob] = useState(false);
  const [extraJobs, setExtraJobs] = useState([]);
  const [applied, setApplied] = useState([]);
  const [toast, setToast] = useState('');

  // Post job form
  const [jobForm, setJobForm] = useState({ title:'', category:'Coding', budget:'', duration:'', location:'Remote', skills:'', eligibility:'', description:'' });
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('skillswap_current_user');
    // Guest browsing allowed - only set user if logged in
    if (user) {
      setCurrentUser(user);
      try {
        const savedApplied = JSON.parse(localStorage.getItem('skillswap_applied_' + user) || '[]');
        setApplied(savedApplied);
      } catch {}
    }
    setAuthChecked(true);
    // Load posted jobs
    try {
      const saved = JSON.parse(localStorage.getItem('skillswap_posted_jobs') || '[]');
      setExtraJobs(saved);
    } catch {}
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const allJobs = [...extraJobs, ...SAMPLE_JOBS];

  const filtered = allJobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.title.toLowerCase().includes(q) || j.skills.some(s => s.toLowerCase().includes(q)) || j.category.toLowerCase().includes(q) || j.description.toLowerCase().includes(q);
    const matchCat = category === 'All' || j.category === category;
    const matchUrgent = !urgentOnly || j.urgent;
    return matchSearch && matchCat && matchUrgent;
  }).sort((a, b) => {
    if (sort === 'budgetHigh') return parseInt(b.budget.replace(/\D/g,'')) - parseInt(a.budget.replace(/\D/g,''));
    if (sort === 'budgetLow') return parseInt(a.budget.replace(/\D/g,'')) - parseInt(b.budget.replace(/\D/g,''));
    if (sort === 'urgent') return (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0);
    return b.id - a.id;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleApply = (job) => {
    if (!currentUser) {
      showToast('💌 Please log in to apply for jobs!');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    if (applied.includes(job.id)) return;
    const updated = [...applied, job.id];
    setApplied(updated);
    localStorage.setItem('skillswap_applied_' + currentUser, JSON.stringify(updated));
    showToast(`✅ Applied to "${job.title}"!`);
    setSelectedJob(null);
  };

  const handlePostJob = async () => {
    if (!currentUser) {
      showToast('💌 Please log in to post a job!');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    if (!jobForm.title || !jobForm.budget || !jobForm.description) {
      showToast('💌 Fill in title, budget, and description!');
      return;
    }
    setPostLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newJob = {
      id: Date.now(),
      ...jobForm,
      skills: jobForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      postedBy: currentUser.split('@')[0],
      postedAt: 'Just now',
      urgent: false,
      avatar: '🌸',
    };
    const updated = [newJob, ...extraJobs];
    setExtraJobs(updated);
    localStorage.setItem('skillswap_posted_jobs', JSON.stringify(updated));
    setPostLoading(false);
    setShowPostJob(false);
    setJobForm({ title:'', category:'Coding', budget:'', duration:'', location:'Remote', skills:'', eligibility:'', description:'' });
    showToast('🎉 Job posted successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('skillswap_current_user');
    navigate('/login');
  };

  if (!authChecked) return null;

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '2px solid rgba(255,182,214,0.4)', fontFamily: "'Nunito', sans-serif",
    fontSize: '0.9rem', color: '#2d1b3d', background: '#fff8fc', marginBottom: '10px',
  };

  return (
    <>
      <style>{css}</style>
      {/* Background */}
      <div style={{position:'fixed',inset:0,background:'linear-gradient(135deg,#fff0f5 0%,#ffe4f0 50%,#fff8f5 100%)',zIndex:-2}} />
      <div style={{position:'fixed',top:'5%',left:'-5%',width:'400px',height:'400px',borderRadius:'50%',background:'#ffb3d9',filter:'blur(100px)',opacity:0.25,animation:'blobFloat 7s ease-in-out infinite alternate',zIndex:-1}} />
      <div style={{position:'fixed',bottom:'10%',right:'-5%',width:'350px',height:'350px',borderRadius:'50%',background:'#ffd6e8',filter:'blur(100px)',opacity:0.25,animation:'blobFloat 9s ease-in-out 2s infinite alternate',zIndex:-1}} />

      {/* Toast */}
      {toast && (
        <div style={{position:'fixed',top:'80px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#ff6eb4,#ff9bd2)',color:'#fff',padding:'12px 24px',borderRadius:'14px',fontWeight:700,zIndex:500,fontSize:'0.9rem',boxShadow:'0 8px 30px rgba(255,110,180,0.35)',animation:'fadeUp 0.3s ease'}}>
          {toast}
        </div>
      )}

      {/* Navbar */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,0.8)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(255,182,214,0.3)',padding:'12px 28px',display:'flex',alignItems:'center',gap:'12px',fontFamily:"'Nunito', sans-serif"}}>
        <span style={{fontWeight:900,fontSize:'1.3rem',background:'linear-gradient(135deg,#ff6eb4,#ff9bd2)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',cursor:'pointer',marginRight:'auto',letterSpacing:'-0.5px'}} onClick={() => navigate('/jobs')}>
          🌸 SkillSwap
        </span>
        {/* Search */}
        <div style={{position:'relative',flex:'0 1 320px'}}>
          <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'1rem'}}>🔍</span>
          <input
            style={{width:'100%',padding:'9px 12px 9px 36px',borderRadius:'12px',border:'2px solid rgba(255,182,214,0.4)',fontFamily:"'Nunito', sans-serif",fontSize:'0.88rem',background:'rgba(255,255,255,0.9)',color:'#2d1b3d'}}
            placeholder="Search jobs, skills..."
            value={search}
            onChange={e => { setSearch(e.target.value); setVisibleCount(6); }}
          />
        </div>
        {currentUser ? (
          <>
            <button className="nav-btn" onClick={() => navigate('/profile')}>🐱 Profile</button>
            <button className="nav-btn" onClick={handleLogout}>🚪 Logout</button>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => navigate('/login')}>Log In</button>
            <button className="pink-btn" style={{padding:'8px 18px',fontSize:'0.85rem'}} onClick={() => navigate('/register')}>Sign Up 🎀</button>
          </>
        )}
        <button className="pink-btn" onClick={() => currentUser ? setShowPostJob(true) : navigate('/login')}>➕ Post a Job</button>
      </nav>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'28px 20px',fontFamily:"'Nunito', sans-serif"}}>
        {/* Guest banner */}
        {!currentUser && (
          <div style={{background:'linear-gradient(135deg,rgba(255,110,180,0.12),rgba(255,182,214,0.18))',border:'1.5px solid rgba(255,110,180,0.25)',borderRadius:'16px',padding:'14px 22px',marginBottom:'20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
            <p style={{margin:0,fontWeight:700,color:'#b06090',fontSize:'0.9rem'}}>✨ You're browsing as a guest! Log in to apply for jobs and post your own.</p>
            <div style={{display:'flex',gap:'10px'}}>
              <button className="ghost-btn" style={{padding:'8px 18px',fontSize:'0.85rem'}} onClick={() => navigate('/login')}>Log In</button>
              <button className="pink-btn" style={{padding:'8px 18px',fontSize:'0.85rem'}} onClick={() => navigate('/register')}>Sign Up Free 🌸</button>
            </div>
          </div>
        )}
        {/* Stats strip */}
        <div style={{display:'flex',gap:'14px',marginBottom:'24px',flexWrap:'wrap'}}>
          {[
            {icon:'💼', label:'Total Jobs', val: allJobs.length},
            {icon:'🔥', label:'Urgent', val: allJobs.filter(j=>j.urgent).length},
            {icon:'💰', label:'Starting at', val:'₹400'},
            {icon:'⚡', label:'Avg Response', val:'< 2hrs'},
          ].map((s,i) => (
            <div key={i} style={{background:'rgba(255,255,255,0.75)',backdropFilter:'blur(10px)',borderRadius:'14px',padding:'14px 20px',border:'1px solid rgba(255,182,214,0.3)',flex:'1',minWidth:'120px',textAlign:'center'}}>
              <div style={{fontSize:'1.4rem'}}>{s.icon}</div>
              <div style={{fontWeight:800,fontSize:'1.2rem',color:'#2d1b3d'}}>{s.val}</div>
              <div style={{fontSize:'0.75rem',color:'#b06090'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'20px',flexWrap:'wrap'}}>
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-pill ${category===c?'active':''}`} onClick={() => { setCategory(c); setVisibleCount(6); }}>{c}</button>
          ))}
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
            <label style={{display:'flex',alignItems:'center',gap:'6px',cursor:'pointer',fontWeight:700,color:'#b06090',fontSize:'0.88rem'}}>
              <input type="checkbox" checked={urgentOnly} onChange={e => setUrgentOnly(e.target.checked)} style={{accentColor:'#ff6eb4'}} />
              🔥 Urgent Only
            </label>
            <select
              style={{...inputStyle,width:'auto',marginBottom:0,padding:'8px 12px'}}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="newest">⏰ Newest First</option>
              <option value="budgetHigh">💰 Budget: High→Low</option>
              <option value="budgetLow">💸 Budget: Low→High</option>
              <option value="urgent">🔥 Urgent First</option>
            </select>
            {(search || category !== 'All' || urgentOnly) && (
              <button className="ghost-btn" onClick={() => { setSearch(''); setCategory('All'); setUrgentOnly(false); setVisibleCount(6); }}>✕ Clear</button>
            )}
          </div>
        </div>

        <p style={{color:'#b06090',fontSize:'0.88rem',marginBottom:'16px',fontWeight:600}}>
          Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} jobs ✨
        </p>

        {/* Job Grid */}
        {filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px 20px',color:'#b06090'}}>
            <div style={{fontSize:'3rem',marginBottom:'12px'}}>🔍</div>
            <p style={{fontWeight:700,fontSize:'1.1rem'}}>No jobs found!</p>
            <p style={{fontSize:'0.88rem'}}>Try different keywords or clear filters</p>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',gap:'18px',marginBottom:'24px'}}>
            {visible.map((job, idx) => (
              <div
                key={job.id}
                className="job-card"
                style={{background:'rgba(255,255,255,0.8)',backdropFilter:'blur(12px)',borderRadius:'20px',padding:'22px',border:'1.5px solid rgba(255,182,214,0.25)',boxShadow:'0 4px 20px rgba(255,110,180,0.08)',cursor:'pointer',animationDelay:`${idx*0.05}s`}}
                onClick={() => setSelectedJob(job)}
              >
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'10px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{width:'42px',height:'42px',borderRadius:'12px',background:'linear-gradient(135deg,#ffe4f0,#ffd6e8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0}}>
                      {job.avatar}
                    </div>
                    <div>
                      <p style={{margin:0,fontWeight:800,color:'#2d1b3d',fontSize:'0.95rem',lineHeight:1.3}}>{job.title}</p>
                      <p style={{margin:0,color:'#b06090',fontSize:'0.78rem'}}>by {job.postedBy} · {job.postedAt}</p>
                    </div>
                  </div>
                  {job.urgent && <span style={{background:'linear-gradient(135deg,#ff6eb4,#ff9bd2)',color:'#fff',borderRadius:'8px',padding:'2px 8px',fontSize:'0.72rem',fontWeight:800,flexShrink:0}}>🔥 Urgent</span>}
                </div>

                <p style={{color:'#7a5570',fontSize:'0.84rem',lineHeight:1.5,marginBottom:'12px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
                  {job.description}
                </p>

                <div style={{display:'flex',flexWrap:'wrap',gap:'4px',marginBottom:'12px'}}>
                  {job.skills.slice(0,3).map(s => <span key={s} className="skill-chip">{s}</span>)}
                  {job.skills.length > 3 && <span className="skill-chip">+{job.skills.length - 3}</span>}
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',marginBottom:'14px'}}>
                  {[['💰',job.budget],['⏱️',job.duration],['📍',job.location],['🎓',job.eligibility]].map(([icon,val],i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'0.78rem',color:'#9a6080',fontWeight:600}}>
                      <span>{icon}</span><span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{val}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="pink-btn"
                  style={{width:'100%',padding:'10px'}}
                  onClick={e => { e.stopPropagation(); setSelectedJob(job); }}
                >
                  {applied.includes(job.id) ? '✅ Applied!' : 'View & Apply →'}
                </button>
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <div style={{textAlign:'center',marginBottom:'30px'}}>
            <button className="ghost-btn" style={{padding:'12px 32px',fontSize:'0.95rem'}} onClick={() => setVisibleCount(v => v + 6)}>
              Load More Jobs ✨
            </button>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div style={{position:'fixed',inset:0,background:'rgba(45,27,61,0.45)',backdropFilter:'blur(8px)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',animation:'fadeUp 0.2s ease'}}
          onClick={e => { if(e.target===e.currentTarget) setSelectedJob(null); }}>
          <div style={{background:'#fff',borderRadius:'24px',maxWidth:'520px',width:'100%',maxHeight:'85vh',overflowY:'auto',padding:'36px',position:'relative',fontFamily:"'Nunito', sans-serif"}}>
            <button style={{position:'absolute',top:'16px',right:'16px',background:'none',border:'none',fontSize:'1.4rem',cursor:'pointer',color:'#b06090'}} onClick={() => setSelectedJob(null)}>✕</button>
            <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'20px'}}>
              <div style={{width:'56px',height:'56px',borderRadius:'16px',background:'linear-gradient(135deg,#ffe4f0,#ffd6e8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem'}}>
                {selectedJob.avatar}
              </div>
              <div>
                <h2 style={{margin:0,fontWeight:900,color:'#2d1b3d',fontSize:'1.15rem'}}>{selectedJob.title}</h2>
                <p style={{margin:0,color:'#b06090',fontSize:'0.85rem'}}>Posted by {selectedJob.postedBy} · {selectedJob.postedAt}</p>
              </div>
              {selectedJob.urgent && <span style={{marginLeft:'auto',background:'linear-gradient(135deg,#ff6eb4,#ff9bd2)',color:'#fff',borderRadius:'10px',padding:'4px 12px',fontSize:'0.8rem',fontWeight:800}}>🔥 Urgent</span>}
            </div>

            <p style={{color:'#5a3560',lineHeight:1.7,marginBottom:'20px',fontSize:'0.92rem'}}>{selectedJob.description}</p>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'20px'}}>
              {[['💰 Budget',selectedJob.budget],['⏱️ Duration',selectedJob.duration],['📍 Location',selectedJob.location],['🎓 Eligibility',selectedJob.eligibility],['📂 Category',selectedJob.category]].map(([label,val]) => (
                <div key={label} style={{background:'#fff8fc',borderRadius:'12px',padding:'10px 14px',border:'1px solid rgba(255,182,214,0.3)'}}>
                  <p style={{margin:0,fontSize:'0.75rem',color:'#b06090',fontWeight:700}}>{label}</p>
                  <p style={{margin:0,fontWeight:800,color:'#2d1b3d',fontSize:'0.9rem'}}>{val}</p>
                </div>
              ))}
            </div>

            <div style={{marginBottom:'24px'}}>
              <p style={{fontWeight:800,color:'#2d1b3d',marginBottom:'8px',fontSize:'0.9rem'}}>🛠️ Skills Needed</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                {selectedJob.skills.map(s => <span key={s} className="skill-chip" style={{fontSize:'0.85rem',padding:'4px 12px'}}>{s}</span>)}
              </div>
            </div>

            <button
              className="pink-btn"
              style={{width:'100%',padding:'14px',fontSize:'1rem'}}
              onClick={() => handleApply(selectedJob)}
              disabled={applied.includes(selectedJob.id)}
            >
              {applied.includes(selectedJob.id) ? '✅ Already Applied!' : '🌸 Apply Now'}
            </button>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostJob && (
        <div style={{position:'fixed',inset:0,background:'rgba(45,27,61,0.45)',backdropFilter:'blur(8px)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',animation:'fadeUp 0.2s ease'}}
          onClick={e => { if(e.target===e.currentTarget) setShowPostJob(false); }}>
          <div style={{background:'#fff',borderRadius:'24px',maxWidth:'500px',width:'100%',maxHeight:'90vh',overflowY:'auto',padding:'36px',position:'relative',fontFamily:"'Nunito', sans-serif"}}>
            <button style={{position:'absolute',top:'16px',right:'16px',background:'none',border:'none',fontSize:'1.4rem',cursor:'pointer',color:'#b06090'}} onClick={() => setShowPostJob(false)}>✕</button>
            <h2 style={{fontWeight:900,color:'#2d1b3d',marginBottom:'4px',fontSize:'1.3rem'}}>➕ Post a Job</h2>
            <p style={{color:'#b06090',marginBottom:'20px',fontSize:'0.88rem'}}>Fill in the details below to post your gig 🌸</p>

            {[
              ['Job Title *', 'title', 'e.g. Build a React website'],
              ['Budget *', 'budget', 'e.g. ₹2,000 or ₹500/hr'],
              ['Duration', 'duration', 'e.g. 3 days, 1 week, Ongoing'],
              ['Location', 'location', 'e.g. Remote, Bangalore, Online'],
              ['Skills Needed', 'skills', 'Comma separated: React, CSS, JS'],
              ['Eligibility', 'eligibility', 'e.g. CS students, Any student'],
            ].map(([label, field, ph]) => (
              <div key={field}>
                <label style={{fontWeight:700,color:'#2d1b3d',fontSize:'0.88rem',marginBottom:'4px',display:'block'}}>{label}</label>
                <input style={inputStyle} placeholder={ph} value={jobForm[field]} onChange={e => setJobForm(p => ({...p,[field]:e.target.value}))} />
              </div>
            ))}

            <label style={{fontWeight:700,color:'#2d1b3d',fontSize:'0.88rem',marginBottom:'4px',display:'block'}}>Category</label>
            <select style={{...inputStyle}} value={jobForm.category} onChange={e => setJobForm(p => ({...p,category:e.target.value}))}>
              {CATEGORIES.filter(c=>c!=='All').map(c => <option key={c}>{c}</option>)}
            </select>

            <label style={{fontWeight:700,color:'#2d1b3d',fontSize:'0.88rem',marginBottom:'4px',display:'block'}}>Description *</label>
            <textarea
              style={{...inputStyle,minHeight:'90px',resize:'vertical'}}
              placeholder="Describe the work, requirements, and what you're looking for..."
              value={jobForm.description}
              onChange={e => setJobForm(p => ({...p,description:e.target.value}))}
            />

            <button className="pink-btn" style={{width:'100%',padding:'14px',fontSize:'1rem',marginTop:'4px'}} onClick={handlePostJob}>
              {postLoading ? '✨ Posting...' : '🌸 Post Job'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}