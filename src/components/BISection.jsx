import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedGear from './AnimatedGear';

import './BISection.css';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } }
};


const IconConsolidated = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
);

const IconReporting = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
);

const IconRealTime = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

const IconForecast = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

const IconDecision = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

const IconEfficiency = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);

const biFeatures = [
  {
    icon: IconConsolidated,
    keyword: 'Consolidated Data',
    desc: 'Pull information from multiple sources into a single, reliable source of truth.'
  },
  {
    icon: IconReporting,
    keyword: 'Clearer Reporting',
    desc: 'We apply operational formulas, dynamic filters, and calculated fields to surface the exact numbers that drive your decisions.'
  },
  {
    icon: IconRealTime,
    keyword: 'Dashboards',
    desc: 'We create and deliver custom dashboards based on your specific requirements.'
  }
];

const biBenefits = [
  {
    icon: IconRealTime,
    keyword: 'Real-Time Insights',
    desc: 'Gain immediate visibility into current performance metrics, not outdated reports.'
  },
  {
    icon: IconForecast,
    keyword: 'Predictive Forecasting',
    desc: 'Anticipate market trends and operational shifts before they become critical issues.'
  },
  {
    icon: IconDecision,
    keyword: 'Faster Decision Making',
    desc: 'Empower leaders with self-service access to critical performance data.'
  }
];

const BISection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeBenefit, setActiveBenefit] = useState(null);

  return (
    <section id="bi" className="bi-section">
      <div className="bi-container">

        {/* ══ ZONE 1 — IDENTITY ══ */}
        <motion.div
          className="bi-identity"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div className="identity-content" variants={fadeUp}>

            <h2 className="bi-main-heading">Business Intelligence</h2>
            <p className="bi-tagline">
              Consolidate data. Accelerate decisions.
            </p>
            <p className="bi-intro">
              Business intelligence transforms raw, scattered data into actionable insights. By leveraging modern analytics and clear dashboards, we empower every team to identify trends, eliminate inefficiencies, and make strategic decisions with confidence.
            </p>
          </motion.div>
        </motion.div>

        <div className="bi-rule" />


        {/* ══ ZONE 3 — INTERACTIVE TAB SHOWCASE ══ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="bi-tab-zone"
        >
          <motion.h2 className="bi-tab-heading" variants={fadeUp}>Insights We Deliver</motion.h2>

          {/* Tab Nav */}
          <div className="bi-tab-nav">
            {biFeatures.map((f, i) => (
              <button
                key={i}
                className={`bi-tab-btn ${activeFeature === i ? 'active' : ''}`}
                onClick={() => setActiveFeature(i)}
              >
                <span className="bi-tab-num">0{i + 1}</span>
                <span className="bi-tab-label">{f.keyword}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Panel */}
          <div className="bi-tab-panel">
            <AnimatePresence mode="wait">
              {(() => {
                const f = biFeatures[activeFeature];
                const Icon = f.icon;
                return (
                  <motion.div
                    key={activeFeature}
                    className="bi-tab-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="bi-tab-content-inner">
                      <div className="bi-tab-icon-wrap">
                        <Icon />
                      </div>
                      <div className="bi-tab-text">
                        <h3 className="bi-tab-title">{f.keyword}</h3>
                        <p className="bi-tab-desc">{f.desc}</p>
                      </div>
                      <div className="bi-tab-bg-num">0{activeFeature + 1}</div>
                    </div>
                    <motion.div
                      className="bi-tab-progress"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                    />
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="bi-rule" />

        {/* ══ ZONE 4 — PREMIUM BENEFIT CARDS ══ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          <motion.p className="bi-block-label" variants={fadeUp}>Benefits</motion.p>
          <div className="benefits-cards-grid">
            {biBenefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div key={i} className="benefit-card" variants={fadeUp}>
                  <div className="benefit-card-icon">
                    <Icon />
                  </div>
                  <h4 className="benefit-card-title">{b.keyword}</h4>
                  <p className="benefit-card-desc">{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default BISection;
