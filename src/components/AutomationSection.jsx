import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedGear from './AnimatedGear';

import './AutomationSection.css';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } }
};

const itemStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
};

const popIn = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } }
};

const drawLine = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: { scaleY: 1, opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};



const IconContent = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
);

const IconProcessing = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6"></path><path d="M9 15h6"></path></svg>
);

const IconDocMgmt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const IconWorkflow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
);

const IconDecision = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
);

const IconProcess = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);

const IconSync = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);

const IconTuning = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
);

const IconWorkflowBranch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><circle cx="18" cy="5" r="3"></circle><path d="M8.59 13.51l6.83 3.98"></path><path d="M15.41 6.51l-6.82 3.98"></path></svg>
);

const IconArrowDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
);

const automationFeatures = [
  {
    icon: IconSync,
    keyword: 'Daily routines',
    desc: 'Scheduled tasks that run on their own—data syncs, report generation, system backups, and routine notifications.'
  },
  {
    icon: IconWorkflowBranch,
    keyword: 'Build workflows',
    desc: "Multi-step processes that connect systems—from approval chains to data pipelines that handle complexity reliably."
  },
  {
    icon: IconTuning,
    keyword: 'Process fine tuning',
    desc: 'Optimization and refinement of existing processes—reducing error rates, improving speed, and eliminating bottlenecks.'
  }
];

const automationBenefits = [
  {
    icon: IconProcessing,
    keyword: 'Accelerated Execution',
    desc: 'Transform hours of manual effort into minutes with precise, high-speed automation.'
  },
  {
    icon: IconProcess,
    keyword: 'Custom Implementation',
    desc: 'We design and build automated workflows tailored exactly to your unique processes.'
  },
  {
    icon: IconDecision,
    keyword: 'Uncompromised Quality',
    desc: 'Eliminate human error from repetitive tasks and maintain consistent, reliable output every single time.'
  },
];

const AutomationSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeBenefit, setActiveBenefit] = useState(null);

  return (
    <section id="automation" className="automation-section">
      <div className="automation-container">

        {/* ══ ZONE 1 — IDENTITY ══ */}
        <motion.div
          className="automation-identity"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div className="identity-content" variants={fadeUp}>

            <h2 className="automation-main-heading">Automation</h2>
            <p className="automation-tagline">
              Simplifying your work. Amplifying your impact.
            </p>
            <p className="automation-intro">
              Automation helps you handle repetitive, time consuming tasks and provides solutions for use case driven scenarios that run faster and completely error free.
            </p>
          </motion.div>
        </motion.div>

        <div className="automation-rule" />



        {/* ══ ZONE 3 — TIMELINE EDITORIAL FEATURES ══ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="automation-timeline-zone"
        >
          <motion.h2 className="timeline-main-heading" variants={fadeUp}>What we automate</motion.h2>
          
          <div className="timeline-container">
            {automationFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div 
                  key={i}
                  className="timeline-item"
                  variants={itemStagger}
                >
                  <div className="timeline-marker-col">
                    <motion.div className={`timeline-icon-wrap color-${i}`} variants={popIn}>
                      <Icon />
                    </motion.div>
                    {i !== automationFeatures.length - 1 && (
                      <motion.div 
                        className={`timeline-line-segment line-${i}`} 
                        variants={drawLine}
                        style={{ transformOrigin: 'top' }}
                      />
                    )}
                  </div>
                  <motion.div className="timeline-content-col" variants={slideInRight}>
                    <h3 className="timeline-title">{f.keyword}</h3>
                    <p className="timeline-desc">{f.desc}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="automation-rule" />

        {/* ══ ZONE 4 — PREMIUM BENEFIT CARDS ══ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          <motion.p className="automation-block-label" variants={fadeUp}>Benefits</motion.p>
          <div className="benefits-cards-grid">
            {automationBenefits.map((b, i) => {
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

export default AutomationSection;
