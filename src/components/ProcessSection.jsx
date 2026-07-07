import React from 'react';
import { motion } from 'framer-motion';
import './ProcessSection.css';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } }
};

const processSteps = [
  {
    num: '01',
    phase: 'UNDERSTAND',
    line: 'We engage with your team to deeply understand the challenge, analyse its root cause, and define a clear solution strategy.'
  },
  {
    num: '02',
    phase: 'PROCESS',
    line: 'We architect, engineer, and build custom solutions for your core challenges, developing each feature with precision and testing rigorously to validate the system'
  },
  {
    num: '03',
    phase: 'DELIVER',
    line: 'We deploy with precision, monitor outcomes, and refine continuously to ensure lasting, measurable impact.'
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="process-section">
      <div className="process-container">
        {/* ══ ZONE 2 — PROCESS RIBBON ══ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          <motion.p className="process-block-label" variants={fadeUp}>How We Work</motion.p>
          <div className="process-ribbon">
            {processSteps.map((step, i) => (
              <React.Fragment key={i}>
                <motion.div className="ribbon-step" variants={fadeUp}>
                  <div className="ribbon-num">{step.num}</div>
                  <div className="ribbon-phase">{step.phase}</div>
                  <p className="ribbon-line">{step.line}</p>
                </motion.div>
                {i < processSteps.length - 1 && (
                  <div className="ribbon-arrow" aria-hidden="true">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
