import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  @keyframes blobFloat { from{transform:scale(1) translate(0,0);} to{transform:scale(1.1) translate(20px,-20px);} }
  @keyframes shimmer { to{background-position:200% center;} }
  @keyframes bounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
  @keyframes sparkle { 0%,100%{opacity:0.2;transform:scale(0.8) rotate(0deg);} 50%{opacity:1;transform:scale(1.2) rotate(20deg);} }
  @keyframes float { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-15px);} }
  @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
  .hero-card { animation: fadeUp 0.6s ease both; }
  .feature-card { background:rgba(255,255,255,0.75); backdrop-filter:blur(12px); border-radius:20px; padding:28px; border:1.5px solid rgba(255,182,214,0.25); box-shadow:0 4px 20px rgba(255,110,180,0.08); transition:transform 0.2s,box-shadow 0.2s; }
  .feature-card:hover { transform:translateY(-6px); box-shadow:0 16px 40px rgba(255,110,180,0.18); }
  .skill-tag { display:inline-block; padding:6px 16px; border-radius:20px; background:rgba(255,255,255,0.8); border:1.5px solid rgba(255,182,214,0.4); color:#c0608a; font-weight:700; font-size:0.82rem; margin:4px; transition:all 0.2s; cursor:pointer; }
  .skill-tag:hover { background:linear-gradient(135deg,#ff6eb4,#ff9bd2); color:#fff; border-color:transparent; }
  .pink-btn { background:linear-gradient(135deg,#ff6eb4,#ff9bd2); color:#fff; border:none; border-radius:14px; padding:14px 28px; font-weight:800; font-size:1rem; cursor:pointer; font-family:'Nunito',sans-serif; transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 6px 20px rgba(255,110,180,0.35); }
  .pink-btn:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(255,110,180,0.45); }
  .ghost-btn { background:rgba(255,255,255,0.85); border:2px solid rgba(255,182,214,0.5); border-radius:14px; padding:13px 28px; font-weight:800; font-size:1rem; cursor:pointer; font-family:'Nunito',sans-serif; color:#b06090; transition:all 0.2s; }
  .ghost-btn:hover { border-color:#ff6eb4; background:#fff; transform:translateY(-2px); }
  .nav-link { background:none; border:none; cursor:pointer; font-family:'Nunito',sans-serif; font-weight:700; font-size:0.9rem; color:#b06090; padding:8px 14px; border-radius:10px; transition:background 0.2s,color 0.2s; }
  .nav-link:hover { background:rgba(255,110,180,0.1); color:#ff6eb4; }
  ::-webkit-scrollbar{width:6px;} ::-webkit-scrollbar-track{background:#fff0f7;} ::-webkit-scrollbar-thumb{background:#ffb3d9;border-radius:10px;}
`;

const SKILLS = ['React','Python','UI/UX Design','Video Editing','Content Writing','Data Analysis','Graphic Design','Tutoring','Node.js','Figma','Machine Learning','WordPress'];
const HOW_STEPS = [
  { icon:'🌸', title:'Create Your Profile', desc:'Show off your skills, portfolio, and set your rate in minutes.' },
  { icon:'🔍', title:'Browse or Post Jobs', desc:'Find the perfect freelance gig or post your own for the community.' },
  { icon:'✨', title:'Connect & Earn', desc:'Chat, agree on terms, complete the work, and build your reputation.' },
];
const FEATURES = [
  { icon:'🐱', title:'Student-First', desc:'Built for college students — flexible schedules, student rates, no experience required.' },
  { icon:'💖', title:'Skill Exchange', desc:'No money? No problem! Trade skills with other students for mutual growth.' },
  { icon:'🌸', title:'Safe Community', desc:'Verified college emails only. A trusted space for students to collaborate.' },
  { icon:'✨', title:'Build Your Portfolio', desc:'Every gig you complete adds to your profile and helps you land bigger opportunities.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('skillswap_current_user');
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('skillswap_current_user');
    setIsLoggedIn(false);
  };

  const handleSkillClick = () => {
    if (isLoggedIn) navigate('/jobs');
    else navigate('/login');
  };

  return (
    <>
      <style>{css}</style>
      {/* Background */}
      <div style={{position:'fixed',inset:0,background:'linear-gradient(135deg,#fff0f5 0%,#ffe4f0 40%,#fff8f5 100%)',zIndex:-2}} />
      <div style={{position:'fixed',top:'10%',left:'-5%',width:'400px',height:'400px',borderRadius:'50%',background:'#ffb3d9',filter:'blur(90px)',opacity:0.3,animation:'blobFloat 7s ease-in-out infinite alternate',zIndex:-1}} />
      <div style={{position:'fixed',bottom:'5%',right:'-5%',width:'350px',height:'350px',borderRadius:'50%',background:'#ffd6e8',filter:'blur(90px)',opacity:0.3,animation:'blobFloat 9s ease-in-out 2s infinite alternate',zIndex:-1}} />
      <div style={{position:'fixed',top:'50%',left:'30%',width:'300px',height:'300px',borderRadius:'50%',background:'#ffe4b3',filter:'blur(100px)',opacity:0.2,animation:'blobFloat 8s ease-in-out 1s infinite alternate',zIndex:-1}} />

      {/* Sparkles */}
      {[['12%','15%','0s'],['22%','85%','0.8s'],['65%','8%','1.4s'],['80%','75%','0.3s'],['45%','92%','1.9s'],['90%','30%','0.6s']].map(([t,l,d],i) => (
        <span key={i} style={{position:'fixed',top:t,left:l,fontSize:'1.2rem',animation:`sparkle 3s ease-in-out ${d} infinite`,zIndex:0,pointerEvents:'none'}}>✨</span>
      ))}

      {/* Navbar */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,0.75)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(255,182,214,0.3)',padding:'14px 40px',display:'flex',alignItems:'center',gap:'12px',fontFamily:"'Nunito',sans-serif"}}>
        <span style={{fontWeight:900,fontSize:'1.4rem',background:'linear-gradient(135deg,#ff6eb4,#ff9bd2)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',cursor:'pointer',letterSpacing:'-0.5px',marginRight:'auto'}} onClick={() => navigate('/')}>
          🌸 SkillSwap
        </span>

        {isLoggedIn ? (
          <>
            <button className="nav-link" onClick={() => navigate('/jobs')}>🏠 Browse Jobs</button>
            <button className="nav-link" onClick={() => navigate('/profile')}>🐱 My Profile</button>
            <button className="pink-btn" style={{padding:'9px 20px',fontSize:'0.88rem'}} onClick={handleLogout}>🚪 Logout</button>
          </>
        ) : (
          <>
            <button className="nav-link" onClick={() => navigate('/login')}>Log In</button>
            <button className="pink-btn" style={{padding:'9px 20px',fontSize:'0.88rem'}} onClick={() => navigate('/register')}>Sign Up Free 🎀</button>
          </>
        )}
      </nav>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'0 24px',fontFamily:"'Nunito',sans-serif"}}>
        {/* Hero */}
        <div className="hero-card" style={{textAlign:'center',padding:'80px 20px 60px'}}>
          <span style={{fontSize:'4rem',display:'block',marginBottom:'8px',animation:'bounce 2s ease-in-out infinite'}}>🐱</span>
          <div style={{display:'inline-block',background:'rgba(255,182,214,0.2)',border:'1.5px solid rgba(255,182,214,0.4)',borderRadius:'20px',padding:'4px 16px',fontSize:'0.85rem',fontWeight:700,color:'#c0608a',marginBottom:'20px'}}>
            ✨ For Students, By Students
          </div>
          <h1 style={{fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:900,color:'#2d1b3d',margin:'0 0 16px',lineHeight:1.15}}>
            Exchange Skills,{' '}
            <span style={{background:'linear-gradient(90deg,#ff6eb4,#ffb3d9,#ff6eb4)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',animation:'shimmer 2.5s linear infinite'}}>
              Grow Together
            </span>{' '}🌸
          </h1>
          <p style={{fontSize:'1.1rem',color:'#7a5570',maxWidth:'560px',margin:'0 auto 36px',lineHeight:1.7}}>
            The freelancing platform built for college students. Find gigs, trade skills, build your portfolio, and earn real money — all within your campus community.
          </p>
          <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap'}}>
            {isLoggedIn ? (
              <>
                <button className="pink-btn" onClick={() => navigate('/jobs')}>Browse Jobs 🌸</button>
                <button className="ghost-btn" onClick={() => navigate('/profile')}>My Profile →</button>
              </>
            ) : (
              <>
                <button className="pink-btn" onClick={() => navigate('/register')}>Get Started Free 🌸</button>
                <button className="ghost-btn" onClick={() => navigate('/login')}>Browse Skills →</button>
              </>
            )}
          </div>

          {/* Trust badges */}
          <div style={{display:'flex',gap:'24px',justifyContent:'center',marginTop:'36px',flexWrap:'wrap'}}>
            {['🎓 College Verified','✨ 100% Free to join','💖 Student-friendly rates','🔒 Safe & secure'].map(b=>(
              <span key={b} style={{fontSize:'0.85rem',color:'#b06090',fontWeight:700}}>{b}</span>
            ))}
          </div>
        </div>

        {/* Skills cloud */}
        <div style={{textAlign:'center',marginBottom:'70px',animation:'fadeUp 0.6s ease 0.2s both'}}>
          <h2 style={{fontWeight:900,color:'#2d1b3d',fontSize:'1.6rem',marginBottom:'16px'}}>🎀 Explore Skills</h2>
          <p style={{color:'#b06090',marginBottom:'20px',fontSize:'0.92rem'}}>Tap any skill to find jobs or people who can help you!</p>
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'4px'}}>
            {SKILLS.map(s => <span key={s} className="skill-tag" onClick={handleSkillClick}>{s}</span>)}
          </div>
        </div>

        {/* How it works */}
        <div style={{marginBottom:'70px',animation:'fadeUp 0.6s ease 0.3s both'}}>
          <h2 style={{textAlign:'center',fontWeight:900,color:'#2d1b3d',fontSize:'1.8rem',marginBottom:'8px'}}>✨ How It Works</h2>
          <p style={{textAlign:'center',color:'#b06090',marginBottom:'36px',fontSize:'0.92rem'}}>Start earning in 3 simple steps 🌸</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'20px'}}>
            {HOW_STEPS.map((s,i) => (
              <div key={i} className="feature-card" style={{textAlign:'center',animationDelay:`${i*0.1}s`}}>
                <div style={{fontSize:'3rem',marginBottom:'12px',animation:'float 3s ease-in-out infinite',animationDelay:`${i*0.5}s`}}>{s.icon}</div>
                <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'linear-gradient(135deg,#ff6eb4,#ff9bd2)',color:'#fff',fontWeight:900,fontSize:'0.85rem',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>{i+1}</div>
                <h3 style={{fontWeight:800,color:'#2d1b3d',margin:'0 0 8px',fontSize:'1.05rem'}}>{s.title}</h3>
                <p style={{color:'#7a5570',margin:0,fontSize:'0.88rem',lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{marginBottom:'70px',animation:'fadeUp 0.6s ease 0.4s both'}}>
          <h2 style={{textAlign:'center',fontWeight:900,color:'#2d1b3d',fontSize:'1.8rem',marginBottom:'8px'}}>💖 Why SkillSwap?</h2>
          <p style={{textAlign:'center',color:'#b06090',marginBottom:'36px',fontSize:'0.92rem'}}>Everything a student freelancer needs ✨</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'18px'}}>
            {FEATURES.map((f,i) => (
              <div key={i} className="feature-card">
                <div style={{fontSize:'2.2rem',marginBottom:'12px'}}>{f.icon}</div>
                <h3 style={{fontWeight:800,color:'#2d1b3d',margin:'0 0 8px',fontSize:'1rem'}}>{f.title}</h3>
                <p style={{color:'#7a5570',margin:0,fontSize:'0.86rem',lineHeight:1.6}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{background:'linear-gradient(135deg,#ff6eb4,#ff9bd2)',borderRadius:'28px',padding:'50px 40px',textAlign:'center',marginBottom:'60px',boxShadow:'0 20px 60px rgba(255,110,180,0.3)',animation:'fadeUp 0.6s ease 0.5s both'}}>
          <span style={{fontSize:'3rem',display:'block',marginBottom:'12px',animation:'pulse 2s ease-in-out infinite'}}>🌸</span>
          <h2 style={{fontWeight:900,color:'#fff',fontSize:'2rem',margin:'0 0 10px'}}>Ready to get started?</h2>
          <p style={{color:'rgba(255,255,255,0.85)',margin:'0 0 28px',fontSize:'0.95rem'}}>Join thousands of students already swapping skills and earning money!</p>
          <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap'}}>
            {isLoggedIn ? (
              <button style={{background:'#fff',border:'none',borderRadius:'14px',padding:'14px 32px',fontWeight:800,fontSize:'1rem',cursor:'pointer',fontFamily:"'Nunito',sans-serif",color:'#ff6eb4',boxShadow:'0 6px 20px rgba(0,0,0,0.1)',transition:'transform 0.2s'}} onClick={() => navigate('/jobs')}>
                Browse Jobs 💼
              </button>
            ) : (
              <>
                <button style={{background:'#fff',border:'none',borderRadius:'14px',padding:'14px 32px',fontWeight:800,fontSize:'1rem',cursor:'pointer',fontFamily:"'Nunito',sans-serif",color:'#ff6eb4',boxShadow:'0 6px 20px rgba(0,0,0,0.1)',transition:'transform 0.2s'}} onClick={() => navigate('/register')}>
                  Sign Up Free 🎀
                </button>
                <button style={{background:'transparent',border:'2px solid rgba(255,255,255,0.6)',borderRadius:'14px',padding:'13px 28px',fontWeight:800,fontSize:'1rem',cursor:'pointer',fontFamily:"'Nunito',sans-serif",color:'#fff',transition:'all 0.2s'}} onClick={() => navigate('/login')}>
                  Log In →
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{textAlign:'center',padding:'20px',color:'#c090b0',fontSize:'0.82rem',borderTop:'1px solid rgba(255,182,214,0.25)',marginBottom:'20px'}}>
          <p style={{margin:'0 0 8px',fontWeight:700}}>🌸 SkillSwap — Built with 💖 by students, for students</p>
          <p style={{margin:0}}>A Software Engineering Project · All rights reserved 2025</p>
        </div>
      </div>
    </>
  );
}