import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero-inner">

        <div className="hero-text-glow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Main Heading */}
          <motion.h1
            className="hero-heading primary-h1"
            style={{ textAlign: 'center', marginBottom: '0.6rem', fontSize: 'clamp(4rem, 8vw, 7rem)', lineHeight: '1.1' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            Where <span style={{ color: 'var(--gold)', fontWeight: '600', fontStyle: 'italic' }}>Complexity</span><br />
            Becomes Clarity
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="hero-description body-text"
            style={{ textAlign: 'center', margin: '0 0 3.5rem', width: '100%', maxWidth: '780px', fontSize: 'clamp(1rem, 1.5vw, 1.3rem)', fontWeight: '400', opacity: 0.65, letterSpacing: '0.02em' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.65, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Smarter Solutions. Sharper Decisions.
          </motion.p>
        </div>

        {/* CTA */}
        <motion.div
          className="hero-actions"
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem', flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="#automation" className="btn-outline">Explore automation</a>
          <a href="#bi" className="btn-outline">Unlock insights</a>
        </motion.div>

        {/* KPI Metrics */}
        <motion.div
          className="hero-kpis"
          style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap', width: '100%', maxWidth: '900px', margin: '0 auto' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div style={{ textAlign: 'center', flex: '1 1 180px' }}>
            <div style={{ fontSize: '3rem', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: '500', lineHeight: '1' }}>12</div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', marginTop: '0.6rem', fontWeight: '700', color: 'var(--text-primary)' }}>TOTAL PROJECTS</div>
          </div>
          <div style={{ textAlign: 'center', flex: '1 1 180px' }}>
            <div style={{ fontSize: '3rem', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: '500', lineHeight: '1' }}>1007+</div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', marginTop: '0.6rem', fontWeight: '700', color: 'var(--text-primary)' }}>TOTAL HOURS SAVED</div>
          </div>
          <div style={{ textAlign: 'center', flex: '1 1 180px' }}>
            <div style={{ fontSize: '3rem', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: '500', lineHeight: '1' }}>7+</div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', marginTop: '0.6rem', fontWeight: '700', color: 'var(--text-primary)' }}>DASHBOARDS CREATED</div>
          </div>
          <div style={{ textAlign: 'center', flex: '1 1 180px' }}>
            <div style={{ fontSize: '3rem', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: '500', lineHeight: '1' }}>100%</div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', marginTop: '0.6rem', fontWeight: '700', color: 'var(--text-primary)' }}>OPTIMIZATION</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
