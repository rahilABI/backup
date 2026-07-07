import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RequestForm.css';

/* ── Professional SVG Icon Set ── */
const IconAutomation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>
);

const IconBI = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const IconBoth = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 8v4l3 3"/>
    <path d="M3.05 11a9 9 0 0 1 17.9 0"/>
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

/* ── Goal card icon definitions ── */
const GoalIcons = {
  'Cost Savings': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  'Increased Productivity': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  'Higher Accuracy': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  'Time Savings': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  'Process Efficiency': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M4.93 4.93A10 10 0 0 1 19.07 19.07"/>
    </svg>
  ),
  'Data Quality': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  'Risk Reduction': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  'Scalability': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  'Instant Data Access': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  'Faster Decision Making': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  'Better Data Accuracy': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  'Improved Visibility': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
};

const goalItems = [
  { key: 'Cost Savings',           desc: 'Reduce operational expenses and optimise resource allocation.' },
  { key: 'Increased Productivity', desc: 'Free up team capacity and enable higher output with the same resources.' },
  { key: 'Higher Accuracy',        desc: 'Eliminate human errors and ensure consistent data quality.' },
  { key: 'Time Savings',           desc: 'Accelerate processing and enable faster decision cycles.' },
  { key: 'Process Efficiency',     desc: 'Streamline workflows and automate repetitive operational tasks.' },
  { key: 'Data Quality',           desc: 'Maintain a single source of truth and eliminate data discrepancies.' },
  { key: 'Risk Reduction',         desc: 'Minimise compliance risks and detect anomalies proactively.' },
  { key: 'Scalability',            desc: 'Handle growing data volumes without expanding headcount.' },
  { key: 'Instant Data Access',    desc: 'View live operational data on demand, with no manual reports.' },
  { key: 'Faster Decision Making', desc: 'Empower leadership with real-time data for rapid, informed decisions.' },
  { key: 'Better Data Accuracy',   desc: 'Remove conflicting numbers and manual entry errors permanently.' },
  { key: 'Improved Visibility',    desc: 'Identify real-time trends and spot issues before they escalate.' },
];

const departments = [
  "Algo","Software","Medical","QA","Hardware","QARA","Marketing",
  "Human Resource","Customer Success","Order Management","Finance & Accounts",
  "Inside Sales","Customer Support","Management","Inventory & Logistics",
  "Admin & Facility","Product & Design","Channel Management","IT",
  "Product Operations","Tools and Analytics","SRE","DE","Echo Sales",
  "Sales - SME","Digital Health","Installation & Service","Government Business",
  "Sales - LE","Malaysia Business","Africa Business","Philippines Business",
  "Automation & Business Intelligence","Clinical Research Division","Draft",
  "Business Ops","New Business Initiatives"
];

const fadeSlide = {
  hidden:  { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, x: -30, transition: { duration: 0.25 } }
};

const RequestForm = () => {
  const [step, setStep]             = useState(1);
  const [focus, setFocus]           = useState('');
  const [goals, setGoals]           = useState([]);
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [dept, setDept]             = useState('');
  const [deptQuery, setDeptQuery]   = useState('');
  const [showDept, setShowDept]     = useState(false);
  const [problem, setProblem]       = useState('');
  const [current, setCurrent]       = useState('');
  const [submitted, setSubmitted]   = useState(false);
  const [score, setScore]           = useState(0);

  const filteredDepts = departments.filter(d =>
    d.toLowerCase().includes(deptQuery.toLowerCase())
  );

  const toggleGoal = (key) => {
    setGoals(prev =>
      prev.includes(key) ? prev.filter(g => g !== key) : [...prev, key]
    );
  };

  const canNext = () => {
    if (step === 1) return focus !== '';
    if (step === 2) return goals.length > 0;
    if (step === 3) return name && email && dept && problem;
    return false;
  };

  const handleSubmit = () => {
    let s = 45;
    if (current.toLowerCase().match(/manual|email|excel|sheet/)) s += 25;
    if (goals.length > 5) s += 15;
    setScore(Math.min(100, s));
    setSubmitted(true);
  };

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
    else handleSubmit();
  };

  const exportBlueprint = () => {
    const text = `=== ABI SYSTEM SCOPE BLUEPRINT ===\nName: ${name}\nEmail: ${email}\nDepartment: ${dept}\nFocus: ${focus}\nChallenge: ${problem}\nCurrent Process: ${current || 'Not specified'}\nGoals: ${goals.join(', ')}\n==================================`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const progressPct = submitted ? 100 : ((step - 1) / 2) * 100;

  return (
    <section className="rf-page">
      <div className="rf-wrapper">

        {/* ── Page Header ── */}
        <div className="rf-header">
          <div className="section-label">Let's Collaborate</div>
          <h1 className="rf-title">What brings you here?</h1>
          <p className="rf-subtitle">Share your current challenges, and let's explore how we can build a tailored solution together.</p>
        </div>

        {/* ── Progress ── */}
        {!submitted && (
          <div className="rf-progress-bar-wrap">
            <div className="rf-progress-track">
              <div className="rf-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="rf-steps-row">
              {[1, 2, 3].map(n => (
                <div key={n} className="rf-step-item">
                  <div className={`rf-step-dot ${step === n ? 'active' : step > n ? 'done' : ''}`}>
                    {step > n ? <IconCheck /> : n}
                  </div>
                  <span className={`rf-step-label ${step >= n ? 'active' : ''}`}>
                    {n === 1 ? 'Focus' : n === 2 ? 'Goals' : 'Profile'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Form Card ── */}
        <div className="rf-card glass-card">

          <AnimatePresence mode="wait">

            {/* ───── STEP 1 ───── */}
            {!submitted && step === 1 && (
              <motion.div key="step1" variants={fadeSlide} initial="hidden" animate="visible" exit="exit" className="rf-section">
                <div className="rf-section-head">
                  <h2 className="rf-section-title">Where should we direct our efforts?</h2>
                  <p className="rf-section-sub">Select the service area that aligns with your current operational goals.</p>
                </div>
                <div className="rf-focus-grid">
                  {[
                    { key: 'Automation',           Icon: IconAutomation, desc: 'Eliminate manual tasks through intelligent workflow automation.' },
                    { key: 'Business Intelligence', Icon: IconBI,         desc: 'Transform raw data into clear, actionable insights and dashboards.' },
                    { key: 'Both',                  Icon: IconBoth,       desc: 'An integrated solution spanning automation and BI capabilities.' },
                  ].map(({ key, Icon, desc }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setFocus(key);
                        setTimeout(() => setStep(2), 200);
                      }}
                      className={`rf-focus-card ${focus === key ? 'selected' : ''}`}
                    >
                      <div className="rf-focus-icon"><Icon /></div>
                      <strong className="rf-focus-title">{key}</strong>
                      <p className="rf-focus-desc">{desc}</p>
                      <div className={`rf-selected-badge ${focus === key ? 'checked' : ''}`}>
                        {focus === key && <IconCheck />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ───── STEP 2 ───── */}
            {!submitted && step === 2 && (
              <motion.div key="step2" variants={fadeSlide} initial="hidden" animate="visible" exit="exit" className="rf-section">
                <div className="rf-section-head">
                  <h2 className="rf-section-title">What are your primary objectives?</h2>
                  <p className="rf-section-sub">Select all key outcomes that match your immediate business priorities.</p>
                </div>
                <div className={`rf-goals-grid ${focus !== 'Both' ? 'grid-cols-3' : ''}`}>
                  {goalItems.filter(({ key }) => {
                    if (focus === 'Both') return true;
                    const isAutomation = ['Cost Savings', 'Increased Productivity', 'Time Savings', 'Process Efficiency', 'Risk Reduction', 'Scalability'].includes(key);
                    return focus === 'Automation' ? isAutomation : !isAutomation;
                  }).map(({ key, desc }) => {
                    const Icon = GoalIcons[key];
                    const active = goals.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleGoal(key)}
                        className={`rf-goal-card ${active ? 'selected' : ''}`}
                      >
                        <div className="rf-goal-top">
                          <div className="rf-goal-icon"><Icon /></div>
                          <div className={`rf-goal-check ${active ? 'checked' : ''}`}>
                            {active && (goals.indexOf(key) + 1)}
                          </div>
                        </div>
                        <strong className="rf-goal-title">{key}</strong>
                        <p className="rf-goal-desc">{desc}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ───── STEP 3 ───── */}
            {!submitted && step === 3 && (
              <motion.div key="step3" variants={fadeSlide} initial="hidden" animate="visible" exit="exit" className="rf-section">
                <div className="rf-section-head">
                  <h2 className="rf-section-title">Build your workspace profile</h2>
                  <p className="rf-section-sub">Share your contact details and describe your challenge in your own words.</p>
                </div>

                <div className="rf-form-grid">
                  {/* Name */}
                  <div className="rf-field">
                    <label className="rf-label">Full Name</label>
                    <input className="rf-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  {/* Email */}
                  <div className="rf-field">
                    <label className="rf-label">Email Address</label>
                    <input className="rf-input" type="email" placeholder="yourname@domain.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  {/* Department */}
                  <div className="rf-field rf-field--full rf-dept-wrap">
                    <label className="rf-label">Department</label>
                    <input
                      className="rf-input"
                      placeholder="Search department…"
                      value={deptQuery || dept}
                      onFocus={() => { setDeptQuery(''); setShowDept(true); }}
                      onChange={e => { setDeptQuery(e.target.value); setDept(''); setShowDept(true); }}
                    />
                    {showDept && (
                      <div className="rf-dept-dropdown">
                        {filteredDepts.map(d => (
                          <div key={d} className="rf-dept-option" onClick={() => { setDept(d); setDeptQuery(''); setShowDept(false); }}>
                            {d}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Problem */}
                  <div className="rf-field rf-field--full">
                    <label className="rf-label">What specific challenge can ABI help you solve?</label>
                    <textarea className="rf-textarea" rows={4} placeholder="Describe the process you need streamlined or the data visibility you require…" value={problem} onChange={e => setProblem(e.target.value)} />
                  </div>
                  {/* Current state */}
                  <div className="rf-field rf-field--full">
                    <label className="rf-label">How is this currently being handled? <span className="rf-optional">(Optional)</span></label>
                    <textarea className="rf-textarea" rows={3} placeholder="e.g. Manual spreadsheets, email chains, legacy tools…" value={current} onChange={e => setCurrent(e.target.value)} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ───── BLUEPRINT RESULT ───── */}
            {submitted && (
              <motion.div key="blueprint" variants={fadeSlide} initial="hidden" animate="visible" className="rf-section rf-blueprint">
                <div className="rf-blueprint-header">
                  <div className="rf-blueprint-badge"><IconCheck /></div>
                  <h2 className="rf-section-title">Your ABI Blueprint is Ready</h2>
                  <p className="rf-section-sub">Based on your inputs, we have scoped your operational priorities.</p>
                </div>

                <div className="rf-blueprint-grid">
                  {/* Priority score */}
                  <div className="rf-score-card glass-card">
                    <p className="rf-card-eyebrow">Priority Index</p>
                    <div className="rf-score-num">{score}%</div>
                    <p className="rf-score-desc">
                      {score >= 80
                        ? 'Critical urgency detected. Fast-tracked deployment recommended.'
                        : score >= 60
                        ? 'High complexity. Strong candidate for automated pipelines.'
                        : 'Steady optimisation roadmap recommended.'}
                    </p>
                    <div className="rf-score-divider"/>
                    <p className="rf-card-eyebrow" style={{marginBottom:'0.3rem'}}>Initial Focus</p>
                    <p className="rf-focus-result">
                      {focus === 'Automation' ? 'Automated Workflows'
                        : focus === 'Business Intelligence' ? 'KPI Live Dashboards'
                        : 'Ecosystem Integration'}
                    </p>
                  </div>

                  {/* Scope breakdown */}
                  <div className="rf-scope-card glass-card">
                    <div className="rf-scope-head">
                      <p className="rf-card-eyebrow">Scoped Blueprint Path</p>
                      <span className="rf-auto-badge">Auto-Scoped</span>
                    </div>
                    <ol className="rf-scope-list">
                      <li><strong>Map existing silos:</strong> Audit current processes and remove manual dependency.</li>
                      <li><strong>Eliminate manual grind:</strong> Implement triggers targeting <strong>{goals.length} key</strong> strategic objectives.</li>
                      <li><strong>ABI System Launch:</strong> Integrate dashboards focused on real-time operational visibility.</li>
                    </ol>
                    <div className="rf-scope-footer">
                      <span>Scoped for <strong>{name}</strong> · <span className="rf-gold">{dept}</span></span>
                      <button className="rf-export-btn" onClick={exportBlueprint}><IconDownload /> Export Blueprint</button>
                    </div>
                  </div>
                </div>

                <div className="rf-notify-bar">
                  <p>A technical scoping draft has been generated for <strong className="rf-gold">{email}</strong>. Our operational architect will reach out to schedule a 15-minute integration review.</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* ── Navigation ── */}
          {!submitted && step !== 1 && (
            <div className="rf-nav">
              <button
                className="btn-outline"
                onClick={() => setStep(s => s - 1)}
                style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
              >
                Back
              </button>
              <button
                className="btn-primary"
                onClick={handleNext}
                disabled={!canNext()}
              >
                {step === 3 ? 'Submit' : `Step ${step + 1}`} <IconArrow />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RequestForm;
