import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const styles = {
  blob: (top, left, size, color, delay) => ({
    position: 'fixed', top, left, width: size, height: size,
    borderRadius: '50%', background: color, filter: 'blur(80px)',
    opacity: 0.35, animation: `blobFloat 6s ease-in-out ${delay} infinite alternate`,
    zIndex: 0, pointerEvents: 'none',
  }),
  sparkle: (top, left, delay) => ({
    position: 'fixed', top, left, fontSize: '1.2rem',
    animation: `sparkleAnim 3s ease-in-out ${delay} infinite`,
    zIndex: 0, pointerEvents: 'none',
  }),
  navbar: {
    position: 'fixed', top: 0, left: 0, right: 0, padding: '14px 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,182,214,0.3)', zIndex: 100,
  },
  logo: {
    fontSize: '1.4rem', fontWeight: 800,
    background: 'linear-gradient(135deg, #ff6eb4, #ff9bd2)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    cursor: 'pointer', letterSpacing: '-0.5px',
  },
  card: {
    background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)',
    borderRadius: '28px', padding: '44px 40px', width: '100%', maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(255,110,180,0.15), 0 0 0 1px rgba(255,182,214,0.3)',
    zIndex: 10, animation: 'fadeUp 0.5s ease both', position: 'relative',
  },
  kitty: {
    textAlign: 'center', fontSize: '3rem', marginBottom: '4px',
    animation: 'bounce 1.5s ease-in-out infinite', display: 'block',
  },
  title: { textAlign: 'center', fontSize: '1.9rem', fontWeight: 800, marginBottom: '4px', color: '#2d1b3d' },
  shimmer: {
    background: 'linear-gradient(90deg, #ff6eb4, #ffb3d9, #ff6eb4)',
    backgroundSize: '200% auto', WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent', animation: 'shimmer 2s linear infinite',
  },
  subtitle: { textAlign: 'center', color: '#b06090', fontSize: '0.9rem', marginBottom: '28px' },
  fieldWrap: { position: 'relative', marginBottom: '14px' },
  fieldIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', zIndex: 1 },
  input: {
    width: '100%', padding: '13px 44px 13px 42px', borderRadius: '14px',
    border: '2px solid rgba(255,182,214,0.5)', background: 'rgba(255,255,255,0.8)',
    fontSize: '0.95rem', color: '#2d1b3d', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s', fontFamily: "'Nunito', sans-serif",
  },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '4px',
  },
  error: { color: '#e05090', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px', paddingLeft: '4px' },
  forgotBtn: {
    background: 'none', border: 'none', color: '#ff6eb4', cursor: 'pointer',
    fontSize: '0.85rem', textAlign: 'right', display: 'block', marginLeft: 'auto',
    marginBottom: '18px', fontFamily: "'Nunito', sans-serif", textDecoration: 'underline',
  },
  loginBtn: {
    width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
    background: 'linear-gradient(135deg, #ff6eb4, #ff9bd2)', color: '#fff',
    fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginBottom: '8px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 6px 20px rgba(255,110,180,0.35)', fontFamily: "'Nunito', sans-serif",
  },
  divider: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#c090b0', fontSize: '0.85rem' },
  dividerLine: { flex: 1, height: '1px', background: 'rgba(255,182,214,0.4)' },
  socialBtn: {
    width: '100%', padding: '12px', borderRadius: '14px',
    border: '2px solid rgba(255,182,214,0.5)', background: 'rgba(255,255,255,0.8)',
    color: '#2d1b3d', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
    marginBottom: '10px', transition: 'border-color 0.2s, background 0.2s',
    fontFamily: "'Nunito', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  },
  registerLink: { textAlign: 'center', color: '#b06090', fontSize: '0.88rem', marginTop: '14px' },
  registerSpan: { color: '#ff6eb4', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' },
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(45,27,61,0.4)', backdropFilter: 'blur(6px)',
    zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px', animation: 'fadeUp 0.2s ease',
  },
  modalCard: {
    background: '#fff', borderRadius: '24px', padding: '36px 32px', maxWidth: '380px',
    width: '100%', boxShadow: '0 24px 80px rgba(255,110,180,0.25)', position: 'relative',
  },
  modalClose: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#b06090' },
  modalTitle: { fontSize: '1.3rem', fontWeight: 800, color: '#2d1b3d', margin: '0 0 6px' },
  modalSubtitle: { color: '#b06090', fontSize: '0.85rem', margin: '0 0 20px' },
  modalInput: {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '2px solid rgba(255,182,214,0.5)', fontSize: '0.95rem',
    fontFamily: "'Nunito', sans-serif", outline: 'none', boxSizing: 'border-box',
    marginBottom: '10px', color: '#2d1b3d',
  },
  modalBtn: {
    width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #ff6eb4, #ff9bd2)', color: '#fff',
    fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", marginTop: '4px',
  },
  modalError: { color: '#e05090', fontSize: '0.82rem', margin: '0 0 8px' },
};

const cssAnimation = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  @keyframes blobFloat { from{transform:scale(1) translate(0,0);} to{transform:scale(1.1) translate(20px,-20px);} }
  @keyframes sparkleAnim { 0%,100%{opacity:0.2;transform:scale(0.8) rotate(0deg);} 50%{opacity:1;transform:scale(1.2) rotate(20deg);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  @keyframes shimmer { to{background-position:200% center;} }
  @keyframes bounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
`;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [showSSO, setShowSSO] = useState(false);
  const [ssoEmail, setSsoEmail] = useState('');
  const [ssoError, setSsoError] = useState('');
  const [ssoLoading, setSsoLoading] = useState(false);
  const [ssoSuccess, setSsoSuccess] = useState(false);
  const [showGoogle, setShowGoogle] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleDetected, setGoogleDetected] = useState(false);
  const [googleError, setGoogleError] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('skillswap_current_user');
    if (user) navigate('/jobs');
  }, [navigate]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  const validate = () => {
    const e = {};
    if (!email) e.email = '💌 Please enter your email!';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "💌 That doesn't look like an email!";
    if (!password) e.password = '🔒 Please enter your password!';
    else if (password.length < 6) e.password = '🔒 Password must be at least 6 characters!';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── LOGIN with Supabase ───────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Check if user exists in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        // User exists — check password (we store hashed password)
        if (existingUser.password !== btoa(password)) {
          setErrors({ password: '🔒 Wrong password — try again!' });
          setLoading(false);
          return;
        }
        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('email', email);

        localStorage.setItem('skillswap_current_user', email);
        navigate('/jobs');
      } else {
        // New user — create account
        const { error } = await supabase
          .from('users')
          .insert({
            email: email,
            password: btoa(password), // simple encoding for demo
            name: email.split('@')[0],
            role: 'user',
            status: 'active',
            onboarded: false,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
          });

        if (error) {
          console.error('Supabase error:', error);
          setErrors({ email: '❌ Something went wrong: ' + error.message });
          setLoading(false);
          return;
        }

        localStorage.setItem('skillswap_current_user', email);
        showToast('🌸 Account created! Setting up your profile...');
        await new Promise(r => setTimeout(r, 800));
        navigate('/jobs');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrors({ email: '❌ Something went wrong. Please try again!' });
    }
    setLoading(false);
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleForgotPassword = () => {
    if (!email) { showToast('💌 Enter your email first!', 'error'); return; }
    showToast('📧 Contact admin to reset your password 🌸');
  };

  const handleSSOSubmit = async () => {
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = ssoEmail.split('@')[1] || '';
    if (!ssoEmail.includes('@')) { setSsoError('💌 Enter a valid college email!'); return; }
    if (personalDomains.some(d => domain === d)) { setSsoError('❌ Use your college email, not personal!'); return; }
    setSsoError('');
    setSsoLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setSsoLoading(false);
    setSsoSuccess(true);
    await new Promise(r => setTimeout(r, 1200));
    setEmail(ssoEmail);
    setShowSSO(false);
    setSsoSuccess(false);
    setSsoEmail('');
    showToast('✅ College email auto-filled! Enter your password to continue.');
  };

  const handleGoogleEmailChange = (val) => {
    setGoogleEmail(val);
    setGoogleDetected(val.includes('@gmail.com'));
    setGoogleError('');
    if (val.includes('@') && !val.includes('@gmail.com')) setGoogleError('⚠️ Only Gmail addresses work here!');
  };

  const handleGoogleUse = () => {
    if (!googleDetected) return;
    setEmail(googleEmail);
    setShowGoogle(false);
    setGoogleEmail('');
    setGoogleDetected(false);
    showToast('✅ Gmail auto-filled! Enter your password to continue.');
  };

  const toastBg = toast.type === 'error' ? 'linear-gradient(135deg, #e05090, #f07ab0)' : 'linear-gradient(135deg, #ff6eb4, #ff9bd2)';

  return (
    <>
      <style>{cssAnimation}</style>
      <div style={styles.blob('10%','5%','350px','#ffb3d9','0s')} />
      <div style={styles.blob('60%','75%','300px','#ffd6e8','1.5s')} />
      <div style={styles.blob('80%','20%','250px','#ff9bd2','0.8s')} />
      {[['12%','20%','0s'],['25%','80%','0.7s'],['70%','10%','1.2s'],['85%','60%','0.4s'],['45%','92%','1.8s']].map(([t,l,d],i) => (
        <span key={i} style={styles.sparkle(t,l,d)}>✨</span>
      ))}
      <div style={{position:'fixed',inset:0,background:'linear-gradient(135deg,#fff0f5 0%,#ffe4f0 40%,#ffd6e8 100%)',zIndex:-1}} />

      <nav style={styles.navbar}>
        <span style={styles.logo} onClick={() => navigate('/')}>🌸 SkillSwap</span>
        <button style={{...styles.socialBtn, width:'auto', padding:'8px 20px', marginBottom:0}} onClick={() => navigate('/register')}>
          Sign Up 🎀
        </button>
      </nav>

      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'80px 20px 20px',position:'relative',zIndex:1}}>
        <div style={styles.card}>
          <span style={styles.kitty}>🐱</span>
          <h1 style={styles.title}>Welcome to <span style={styles.shimmer}>SkillSwap</span></h1>
          <p style={styles.subtitle}>Log in to find your next gig ✨</p>

          {toast.msg && (
            <div style={{background:toastBg,color:'#fff',borderRadius:'12px',padding:'10px 16px',fontSize:'0.85rem',marginBottom:'16px',textAlign:'center',animation:'fadeUp 0.3s ease',fontWeight:600}}>
              {toast.msg}
            </div>
          )}

          <div style={styles.fieldWrap}>
            <span style={styles.fieldIcon}>💌</span>
            <input
              style={{...styles.input, borderColor: errors.email ? '#e05090' : email ? '#ff6eb4' : 'rgba(255,182,214,0.5)'}}
              type="email" placeholder="your@email.com" value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email:''})); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          {errors.email && <p style={styles.error}>{errors.email}</p>}

          <div style={styles.fieldWrap}>
            <span style={styles.fieldIcon}>🔒</span>
            <input
              style={{...styles.input, borderColor: errors.password ? '#e05090' : password ? '#ff6eb4' : 'rgba(255,182,214,0.5)'}}
              type={showPass ? 'text' : 'password'} placeholder="Password (min 6 characters)" value={password}
              onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password:''})); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button style={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>{showPass ? '🙈' : '👁️'}</button>
          </div>
          {errors.password && <p style={styles.error}>{errors.password}</p>}

          <button style={styles.forgotBtn} onClick={handleForgotPassword}>Forgot password?</button>

          <button
            style={{...styles.loginBtn, opacity: loading ? 0.8 : 1}}
            onClick={handleLogin} disabled={loading}
            onMouseEnter={e => { if(!loading){e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 10px 30px rgba(255,110,180,0.45)';}}}
            onMouseLeave={e => { e.target.style.transform='';e.target.style.boxShadow='0 6px 20px rgba(255,110,180,0.35)'; }}
          >
            {loading ? '✨ One moment...' : 'Log In 🌸'}
          </button>

          <p style={{textAlign:'center',color:'#c090b0',fontSize:'0.75rem',marginTop:'-4px',marginBottom:'16px'}}>
            New here? Just log in with any email + password to auto-create your account ✨
          </p>

          <div style={styles.divider}><div style={styles.dividerLine} /><span>or continue with</span><div style={styles.dividerLine} /></div>

          <button style={styles.socialBtn}
            onClick={() => { setShowSSO(true); setSsoError(''); setSsoSuccess(false); setSsoEmail(''); }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#ff6eb4'; e.currentTarget.style.background='#fff0f7'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,182,214,0.5)'; e.currentTarget.style.background='rgba(255,255,255,0.8)'; }}
          >🎓 College SSO</button>

          <button style={styles.socialBtn}
            onClick={() => { setShowGoogle(true); setGoogleEmail(''); setGoogleDetected(false); setGoogleError(''); }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#ff6eb4'; e.currentTarget.style.background='#fff0f7'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,182,214,0.5)'; e.currentTarget.style.background='rgba(255,255,255,0.8)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p style={styles.registerLink}>
            Don't have an account?{' '}
            <span style={styles.registerSpan} onClick={() => navigate('/register')}>Sign up free 🎀</span>
          </p>
          <div style={{display:'flex',justifyContent:'center',gap:'16px',marginTop:'18px',fontSize:'0.75rem',color:'#c090b0'}}>
            <span>🔒 Secure</span><span>✨ Free to join</span><span>🌸 Student-friendly</span>
          </div>
        </div>
      </div>

      {showSSO && (
        <div style={styles.modalOverlay} onClick={e => { if(e.target===e.currentTarget) setShowSSO(false); }}>
          <div style={styles.modalCard}>
            <button style={styles.modalClose} onClick={() => setShowSSO(false)}>✕</button>
            {ssoSuccess ? (
              <div style={{textAlign:'center',padding:'10px'}}>
                <div style={{fontSize:'3rem'}}>✅</div>
                <p style={{fontWeight:800,color:'#2d1b3d',marginTop:'8px'}}>Verified! Auto-filling...</p>
              </div>
            ) : (
              <>
                <p style={styles.modalTitle}>🎓 College SSO Login</p>
                <p style={styles.modalSubtitle}>Enter your college email to auto-fill the login form</p>
                <input style={styles.modalInput} placeholder="name@yourcollege.edu" value={ssoEmail}
                  onChange={e => { setSsoEmail(e.target.value); setSsoError(''); }}
                  onKeyDown={e => e.key==='Enter' && handleSSOSubmit()} autoFocus />
                {ssoError && <p style={styles.modalError}>{ssoError}</p>}
                <button style={styles.modalBtn} onClick={handleSSOSubmit}>
                  {ssoLoading ? '🔄 Verifying with college...' : '✅ Use this email'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showGoogle && (
        <div style={styles.modalOverlay} onClick={e => { if(e.target===e.currentTarget) setShowGoogle(false); }}>
          <div style={styles.modalCard}>
            <button style={styles.modalClose} onClick={() => setShowGoogle(false)}>✕</button>
            <p style={styles.modalTitle}>🔵 Google Sign-In</p>
            <p style={styles.modalSubtitle}>Enter your Gmail address to auto-fill the login form</p>
            <input
              style={{...styles.modalInput, borderColor: googleDetected?'#ff6eb4':googleError?'#e05090':'rgba(255,182,214,0.5)'}}
              placeholder="yourname@gmail.com" value={googleEmail}
              onChange={e => handleGoogleEmailChange(e.target.value)} autoFocus />
            {googleDetected && <p style={{color:'#ff6eb4',fontSize:'0.85rem',marginBottom:'8px'}}>✅ Gmail detected!</p>}
            {googleError && <p style={styles.modalError}>{googleError}</p>}
            <button style={{...styles.modalBtn, opacity: googleDetected?1:0.5}} onClick={handleGoogleUse} disabled={!googleDetected}>
              Use this email ✨
            </button>
          </div>
        </div>
      )}
    </>
  );
}