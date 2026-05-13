import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    usn: '',
    college: '',
    year: '',
    skill: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const skills = [
    'Coding / Development',
    'Graphic Design',
    'Content Writing',
    'Tutoring',
    'Video Editing',
    'Digital Marketing',
    'Data Analysis',
    'Other',
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!form.email.includes('@') || !form.email.includes('.edu')) e.email = 'Must be a valid college email (.edu)';
    if (!form.usn.trim()) e.usn = 'USN / Roll number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.college.trim()) e.college = 'College name is required';
    if (!form.year) e.year = 'Please select your year';
    if (!form.skill) e.skill = 'Please select your primary skill';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = () => {
    if (validateStep3()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <style>{css}</style>
        <nav style={styles.nav}>
          <div style={styles.logo} onClick={() => navigate('/')}>🌸 SkillSwap</div>
        </nav>
        <div style={styles.successWrap}>
          <div style={styles.successCard}>
            <div style={styles.successIcon}>🎉</div>
            <h2 style={styles.successTitle}>You are registered!</h2>
            <p style={styles.successDesc}>
              Welcome to SkillSwap, <strong>{form.firstName}</strong>! 🌸<br /><br />
              Your account is pending admin verification. You will receive a confirmation on your college email once approved.
            </p>
            <div style={styles.successInfo}>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Name</span><span>{form.firstName} {form.lastName}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Email</span><span>{form.email}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>USN</span><span>{form.usn}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Skill</span><span>{form.skill}</span></div>
            </div>
            <button style={styles.btnPink} className="btn-glow" onClick={() => navigate('/login')}>
              Go to Login 🌸
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => navigate('/')}>🌸 SkillSwap</div>
        <div style={styles.navRight}>
          Already have an account?{' '}
          <span style={styles.navLink} onClick={() => navigate('/login')}>Log in</span>
        </div>
      </nav>

      <div style={styles.wrap}>

        {/* LEFT PANEL */}
        <div style={styles.leftPanel}>
          <div style={styles.leftContent}>
            <div style={{ fontSize: '60px', marginBottom: '1rem', animation: 'bounce 1s ease-in-out infinite', display: 'inline-block' }}>🐱</div>
            <h2 style={styles.leftTitle}>Join the cutest campus community 🌸</h2>
            <p style={styles.leftDesc}>Exchange skills, earn experience, and grow with fellow students on SkillSwap.</p>
            <div style={styles.perks}>
              {[
                { icon: '✓', text: 'College email verified accounts only' },
                { icon: '✓', text: 'Free to use, zero platform fees' },
                { icon: '✓', text: 'Short-term paid and unpaid tasks' },
                { icon: '✓', text: 'Peer ratings and reviews system' },
                { icon: '✓', text: 'Admin verified for safety' },
              ].map((p, i) => (
                <div key={i} style={styles.perkItem}>
                  <span style={styles.perkIcon}>{p.icon}</span>
                  <span style={styles.perkText}>{p.text}</span>
                </div>
              ))}
            </div>
            <div style={styles.sparkleRow}>
              {['✨', '💗', '🎀', '💫', '🌸'].map((s, i) => (
                <span key={i} style={{ fontSize: '22px', animation: `float ${2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`, display: 'inline-block' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - FORM */}
        <div style={styles.rightPanel}>
          <div style={styles.formCard}>

            {/* STEP INDICATOR */}
            <div style={styles.stepRow}>
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={step >= s ? styles.stepDotActive : styles.stepDot}>{step > s ? '✓' : s}</div>
                    <div style={{ fontSize: '11px', color: step >= s ? '#e91e8c' : '#c2698f', fontWeight: '700' }}>
                      {s === 1 ? 'Personal' : s === 2 ? 'Academic' : 'Password'}
                    </div>
                  </div>
                  {s < 3 && <div style={step > s ? styles.stepLineActive : styles.stepLine} />}
                </React.Fragment>
              ))}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="fade-up">
                <h2 style={styles.formTitle}>Personal Details 💁‍♀️</h2>
                <p style={styles.formSub}>Tell us who you are</p>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>First Name</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handle}
                      placeholder="Megha"
                      style={errors.firstName ? styles.inputError : styles.input}
                    />
                    {errors.firstName && <div style={styles.errMsg}>⚠ {errors.firstName}</div>}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Last Name</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handle}
                      placeholder="Patil"
                      style={errors.lastName ? styles.inputError : styles.input}
                    />
                    {errors.lastName && <div style={styles.errMsg}>⚠ {errors.lastName}</div>}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>College Email 📧</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handle}
                    placeholder="yourname@college.edu.in"
                    style={errors.email ? styles.inputError : styles.input}
                  />
                  {errors.email && <div style={styles.errMsg}>⚠ {errors.email}</div>}
                  <div style={styles.hint}>Must be your official college email address</div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>USN / Roll Number 🎓</label>
                  <input
                    name="usn"
                    value={form.usn}
                    onChange={handle}
                    placeholder="BL.EN.U4AIE23070"
                    style={errors.usn ? styles.inputError : styles.input}
                  />
                  {errors.usn && <div style={styles.errMsg}>⚠ {errors.usn}</div>}
                </div>

                <button style={styles.btnPink} className="btn-glow" onClick={nextStep}>
                  Next Step →
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="fade-up">
                <h2 style={styles.formTitle}>Academic Details 🎓</h2>
                <p style={styles.formSub}>Tell us about your college</p>

                <div style={styles.formGroup}>
                  <label style={styles.label}>College / University Name</label>
                  <input
                    name="college"
                    value={form.college}
                    onChange={handle}
                    placeholder="Amrita School of Engineering, Bengaluru"
                    style={errors.college ? styles.inputError : styles.input}
                  />
                  {errors.college && <div style={styles.errMsg}>⚠ {errors.college}</div>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Year of Study</label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handle}
                    style={errors.year ? styles.inputError : styles.input}
                  >
                    <option value="">Select your year</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.year && <div style={styles.errMsg}>⚠ {errors.year}</div>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Primary Skill 💅</label>
                  <select
                    name="skill"
                    value={form.skill}
                    onChange={handle}
                    style={errors.skill ? styles.inputError : styles.input}
                  >
                    <option value="">Select your main skill</option>
                    {skills.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.skill && <div style={styles.errMsg}>⚠ {errors.skill}</div>}
                </div>

                <div style={styles.skillChips}>
                  <div style={styles.chipsLabel}>Popular skills on SkillSwap:</div>
                  <div style={styles.chips}>
                    {['💻 Coding', '🎨 Design', '✍️ Writing', '📚 Tutoring'].map((chip) => (
                      <div key={chip} style={styles.chip}>{chip}</div>
                    ))}
                  </div>
                </div>

                <div style={styles.btnRow}>
                  <button style={styles.btnBack} onClick={() => setStep(1)}>← Back</button>
                  <button style={styles.btnPink} className="btn-glow" onClick={nextStep}>Next Step →</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="fade-up">
                <h2 style={styles.formTitle}>Create Password 🔒</h2>
                <p style={styles.formSub}>Almost there! Set a strong password</p>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Password</label>
                  <div style={styles.passWrap}>
                    <input
                      name="password"
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={handle}
                      placeholder="Min. 8 characters"
                      style={{ ...(errors.password ? styles.inputError : styles.input), paddingRight: '50px' }}
                    />
                    <button style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <div style={styles.errMsg}>⚠ {errors.password}</div>}

                  {form.password && (
                    <div style={styles.strengthBar}>
                      <div style={{
                        ...styles.strengthFill,
                        width: form.password.length >= 12 ? '100%' : form.password.length >= 8 ? '60%' : '30%',
                        background: form.password.length >= 12 ? '#16a34a' : form.password.length >= 8 ? '#e91e8c' : '#f59e0b',
                      }} />
                      <span style={styles.strengthLabel}>
                        {form.password.length >= 12 ? 'Strong 💪' : form.password.length >= 8 ? 'Good 🌸' : 'Weak 😬'}
                      </span>
                    </div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Confirm Password</label>
                  <input
                    name="confirm"
                    type="password"
                    value={form.confirm}
                    onChange={handle}
                    placeholder="Re-enter your password"
                    style={errors.confirm ? styles.inputError : styles.input}
                  />
                  {errors.confirm && <div style={styles.errMsg}>⚠ {errors.confirm}</div>}
                  {form.confirm && form.password === form.confirm && (
                    <div style={{ fontSize: '13px', color: '#16a34a', marginTop: '6px', fontWeight: '700' }}>✓ Passwords match!</div>
                  )}
                </div>

                <div style={styles.termsBox}>
                  <span>🔒 By registering, you confirm this is your official college email and agree to our </span>
                  <span style={{ color: '#e91e8c', fontWeight: '700' }}>Terms of Service</span>
                </div>

                <div style={styles.btnRow}>
                  <button style={styles.btnBack} onClick={() => setStep(2)}>← Back</button>
                  <button style={styles.btnPink} className="btn-glow" onClick={handleSubmit}>
                    Create Account 🎀
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  * { font-family: 'Nunito', sans-serif; box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-16px); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 18px #f9a8d4, 0 0 36px #f472b6; }
    50% { box-shadow: 0 0 36px #f472b6, 0 0 72px #ec4899; }
  }

  .fade-up { animation: fadeUp 0.4s ease forwards; }
  .btn-glow { animation: glowPulse 2s ease-in-out infinite; }
  .btn-glow:hover { transform: scale(1.04) !important; transition: transform 0.15s; }

  input:focus, select:focus {
    outline: none !important;
    border-color: #e91e8c !important;
    box-shadow: 0 0 0 3px rgba(233,30,140,0.12) !important;
  }
  input::placeholder { color: #d4a0b8; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: #f472b6; border-radius: 10px; }
`;

const styles = {
  page: { minHeight: '100vh', background: '#fff0f6', overflowX: 'hidden' },
  nav: { background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #ffd6e7', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontSize: '20px', fontWeight: '900', color: '#e91e8c', cursor: 'pointer' },
  navRight: { fontSize: '14px', color: '#9c5a7a', fontWeight: '600' },
  navLink: { color: '#e91e8c', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' },
  wrap: { display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 60px)' },
  leftPanel: { background: 'linear-gradient(160deg, #e91e8c, #f472b6, #fb7185)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2.5rem' },
  leftContent: { maxWidth: '400px', textAlign: 'center' },
  leftTitle: { fontSize: '26px', fontWeight: '900', color: '#fff', marginBottom: '1rem', lineHeight: '1.3', letterSpacing: '-0.5px' },
  leftDesc: { fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', marginBottom: '2rem', fontWeight: '600' },
  perks: { display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', marginBottom: '2rem' },
  perkItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  perkIcon: { width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', color: '#fff', flexShrink: 0 },
  perkText: { fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  sparkleRow: { display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '1rem' },
  rightPanel: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#fff0f6' },
  formCard: { background: '#fff', border: '1.5px solid #ffd6e7', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '480px', boxShadow: '0 8px 40px rgba(233,30,140,0.08)' },
  stepRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '2rem' },
  stepDot: { width: '36px', height: '36px', borderRadius: '50%', background: '#ffd6e7', color: '#c2698f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', flexShrink: 0 },
  stepDotActive: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #e91e8c, #f472b6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', flexShrink: 0, boxShadow: '0 4px 12px rgba(233,30,140,0.35)' },
  stepLine: { flex: 1, height: '3px', background: '#ffd6e7', margin: '0 6px', marginBottom: '20px' },
  stepLineActive: { flex: 1, height: '3px', background: 'linear-gradient(90deg, #e91e8c, #f472b6)', margin: '0 6px', marginBottom: '20px' },
  formTitle: { fontSize: '22px', fontWeight: '900', color: '#3d1a2e', marginBottom: '4px', letterSpacing: '-0.5px' },
  formSub: { fontSize: '14px', color: '#c2698f', marginBottom: '1.75rem', fontWeight: '600' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  formGroup: { marginBottom: '1.1rem' },
  label: { display: 'block', fontSize: '13px', fontWeight: '800', color: '#9c5a7a', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #ffd6e7', borderRadius: '12px', fontSize: '14px', color: '#3d1a2e', background: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: '600', transition: 'all 0.15s' },
  inputError: { width: '100%', padding: '10px 14px', border: '1.5px solid #f472b6', borderRadius: '12px', fontSize: '14px', color: '#3d1a2e', background: '#fff0f6', fontFamily: 'Nunito, sans-serif', fontWeight: '600' },
  errMsg: { fontSize: '12px', color: '#e91e8c', marginTop: '5px', fontWeight: '700' },
  hint: { fontSize: '12px', color: '#c2698f', marginTop: '5px', fontWeight: '600' },
  skillChips: { marginBottom: '1.25rem' },
  chipsLabel: { fontSize: '12px', color: '#c2698f', fontWeight: '700', marginBottom: '8px' },
  chips: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  chip: { background: '#fff0f6', border: '1px solid #ffd6e7', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '700', color: '#e91e8c' },
  passWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' },
  strengthBar: { marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' },
  strengthFill: { height: '5px', borderRadius: '10px', transition: 'all 0.3s ease', flex: 1 },
  strengthLabel: { fontSize: '12px', fontWeight: '700', color: '#9c5a7a', whiteSpace: 'nowrap' },
  termsBox: { background: '#fff0f6', border: '1px solid #ffd6e7', borderRadius: '12px', padding: '12px 14px', fontSize: '13px', color: '#9c5a7a', marginBottom: '1.25rem', lineHeight: '1.6', fontWeight: '600' },
  btnRow: { display: 'flex', gap: '10px' },
  btnPink: { flex: 1, background: 'linear-gradient(135deg, #e91e8c, #f472b6)', border: 'none', padding: '12px 24px', borderRadius: '25px', cursor: 'pointer', fontSize: '15px', color: '#fff', fontWeight: '800' },
  btnBack: { background: '#fff0f6', border: '1.5px solid #ffd6e7', padding: '12px 20px', borderRadius: '25px', cursor: 'pointer', fontSize: '14px', color: '#e91e8c', fontWeight: '700' },
  successWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: '2rem' },
  successCard: { background: '#fff', border: '1.5px solid #ffd6e7', borderRadius: '24px', padding: '3rem', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(233,30,140,0.1)' },
  successIcon: { fontSize: '64px', marginBottom: '1rem', animation: 'bounce 1s ease-in-out infinite', display: 'inline-block' },
  successTitle: { fontSize: '26px', fontWeight: '900', color: '#3d1a2e', marginBottom: '1rem' },
  successDesc: { fontSize: '15px', color: '#9c5a7a', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: '600' },
  successInfo: { background: '#fff0f6', border: '1px solid #ffd6e7', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #ffd6e7', fontSize: '14px', color: '#3d1a2e', fontWeight: '600' },
  infoLabel: { color: '#c2698f', fontWeight: '700' },
};

export default Register;