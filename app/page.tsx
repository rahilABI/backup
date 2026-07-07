"use client";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Clock, Cog, ShieldCheck, Ticket, BarChart2, Activity, TrendingUp, Eye, Settings, Scale, Compass } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const CustomTarazu = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} overflow="visible" style={{ width: '1.5rem', height: '1.5rem', padding: '0.1rem' }}>
       {/* Stand */}
       <line x1="50" y1="20" x2="50" y2="85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
       <line x1="30" y1="85" x2="70" y2="85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
       <circle cx="50" cy="20" r="3" fill="currentColor" />
       
       {/* Crossbar group (animates rotation) */}
       <motion.g 
          animate={{ rotate: [-10, 10, -10] }} 
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          style={{ transformOrigin: '50px 20px' }}
       >
          {/* Crossbar */}
          <line x1="15" y1="20" x2="85" y2="20" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          
          {/* Left Pan Group */}
          <motion.g
            animate={{ rotate: [10, -10, 10] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ transformOrigin: '15px 20px' }}
          >
             {/* Strings */}
             <line x1="15" y1="20" x2="5" y2="60" stroke="currentColor" strokeWidth="2" />
             <line x1="15" y1="20" x2="25" y2="60" stroke="currentColor" strokeWidth="2" />
             {/* Pan */}
             <path d="M 0 60 Q 15 75 30 60 Z" fill="none" stroke="currentColor" strokeWidth="4" />
             
             {/* Data weighing (Database icon approx) */}
             <g stroke="#38bdf8" strokeWidth="3" fill="none">
               <ellipse cx="15" cy="45" rx="8" ry="3" />
               <path d="M 7 45 v 8 a 8 3 0 0 0 16 0 v -8" />
             </g>
          </motion.g>

          {/* Right Pan Group */}
          <motion.g
            animate={{ rotate: [10, -10, 10] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ transformOrigin: '85px 20px' }}
          >
             {/* Strings */}
             <line x1="85" y1="20" x2="75" y2="60" stroke="currentColor" strokeWidth="2" />
             <line x1="85" y1="20" x2="95" y2="60" stroke="currentColor" strokeWidth="2" />
             {/* Pan */}
             <path d="M 70 60 Q 85 75 100 60 Z" fill="none" stroke="currentColor" strokeWidth="4" />
             
             {/* Token Drop Animation */}
             <motion.circle 
               cx="85" cy="20" r="4" fill="#fbbf24"
               animate={{ y: [0, 35, 35], opacity: [0, 1, 0] }}
               transition={{ repeat: Infinity, duration: 1.5, ease: "easeIn" }}
             />
             <motion.circle 
               cx="80" cy="15" r="4" fill="#fbbf24"
               animate={{ y: [0, 42, 42], opacity: [0, 1, 0] }}
               transition={{ repeat: Infinity, duration: 1.5, delay: 0.75, ease: "easeIn" }}
             />
             {/* Pile of tokens */}
             <circle cx="85" cy="56" r="4" fill="#fbbf24" />
             <circle cx="81" cy="54" r="4" fill="#fbbf24" />
             <circle cx="89" cy="55" r="4" fill="#fbbf24" />
          </motion.g>
       </motion.g>
    </svg>
  )
}

const typewriterContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const typewriterChar = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const TypewriterText = ({ text, className }: { text: string, className?: string }) => {
  return (
    <motion.p
      className={className}
      variants={typewriterContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {text.split(' ').map((word, index) => (
        <span key={index} style={{ display: 'inline-block', marginRight: '0.3em' }}>
          {word.split('').map((char, charIndex) => (
            <motion.span key={charIndex} variants={typewriterChar} style={{ display: 'inline-block' }}>
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.p>
  );
};

export default function Home() {
  const [metrics, setMetrics] = useState([
    { value: '...', label: 'Total Projects' },
    { value: '...', label: 'Total Hours Saved' },
    { value: '...', label: 'Data Visibility' },
    { value: '...', label: 'Optimization' }
  ]);

  useEffect(() => {
    async function fetchMetrics() {
      // Fetch all published projects
      const { data: projectsData, error: projErr } = await supabase
        .from('projects')
        .select('ticket_id')
        .eq('is_published', true);

      if (projErr || !projectsData || projectsData.length === 0) {
        setMetrics([
            { value: '0', label: 'Total Projects' },
            { value: '0', label: 'Total Hours Saved' },
            { value: '0x', label: 'Data Visibility' },
            { value: 'High', label: 'Optimization' }
        ]);
        return;
      }

      const publishedTicketIds = projectsData.map(p => p.ticket_id);

      // Fetch metrics for these projects
      const { data: metricsData, error: metErr } = await supabase
        .from('project_metrics')
        .select('*')
        .in('ticket_id', publishedTicketIds);

      if (metErr || !metricsData) return;

      const totalProjects = publishedTicketIds.length;
      let totalHours = 0;
      let visibilityMax = 0;
      let optSum = 0;
      let optCount = 0;

      metricsData.forEach(m => {
        if (m.total_hours_saved) totalHours += m.total_hours_saved;
        if (m.data_visibility_improved && m.data_visibility_improved > visibilityMax) {
          visibilityMax = m.data_visibility_improved;
        }
        if (m.optimization_rate) {
          optSum += m.optimization_rate;
          optCount++;
        }
      });

      const avgOptimization = optCount > 0 ? Math.round(optSum / optCount) : 100;
      const formattedHours = '1007+';
      
      const repVisibility = visibilityMax > 0 ? `${visibilityMax}x` : '3x';
      const repOptimization = `${avgOptimization}%`;

      setMetrics([
        { value: totalProjects.toString(), label: 'Total Projects' },
        { value: formattedHours, label: 'Total Hours Saved' },
        { value: repVisibility, label: 'Data Visibility' },
        { value: repOptimization, label: 'Optimization' }
      ]);
    }
    fetchMetrics();
  }, []);

  return (
    <div className="container">
      {/* SECTION 1: HERO / OUTCOMES */}
      <motion.div
        className="section text-protect"
        id="hero"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <div className="block-group" style={{ marginBottom: 0 }}>

          <div style={{ display: 'inline-block', textAlign: 'left' }}>
            <h2 className="modern-title" style={{ marginTop: '4rem', marginBottom: '1.5rem', textAlign: 'left', fontSize: 'clamp(3.8rem, 7.6vw, 7.1rem)', lineHeight: '1.05' }}>
              Where <span className="accent-text">Complexity</span><br />
              <span style={{ display: 'inline-block', marginLeft: '0.6em' }}>
                Becomes Clarity
              </span>
            </h2>
          </div>
          <div style={{
            textAlign: 'center',
            fontSize: '28px',
            color: 'rgba(255, 255, 255, 0.85)',
            fontFamily: '"Comfortaa", sans-serif',
            fontWeight: '700',
            letterSpacing: '1.5px',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap',
            fontStyle: 'normal'
          }}>
            Automate the grind. Let your data speak for itself.
          </div>

        </div>

        {/* Action Buttons */}
        <div className="text-protect" style={{ display: 'flex', gap: '2rem', marginTop: '18rem', justifyContent: 'center', position: 'relative', zIndex: 20 }}>
            <a href="/projects" style={{ padding: '1.2rem 4rem', fontSize: '1.2rem', background: 'rgba(56, 189, 248, 0.15)', backdropFilter: 'blur(10px)', color: '#ffffff', textShadow: '0 0 8px rgba(255,255,255,0.6)', borderRadius: '50px', border: '1px solid rgba(226, 232, 240, 0.4)', textDecoration: 'none', fontWeight: '800', display: 'inline-block', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}>Explore Projects</a>
            <a href="/query" style={{ padding: '1.2rem 4rem', fontSize: '1.2rem', background: 'rgba(56, 189, 248, 0.15)', backdropFilter: 'blur(10px)', color: '#ffffff', textShadow: '0 0 8px rgba(255,255,255,0.6)', borderRadius: '50px', border: '1px solid rgba(226, 232, 240, 0.4)', textDecoration: 'none', fontWeight: '800', display: 'inline-block', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}>Let&apos;s Collaborate</a>
        </div>

        {/* Blended Metrics Section */}
        <div className="text-protect" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', width: '100%', maxWidth: '1100px', marginTop: '4rem', marginBottom: '2rem', textAlign: 'center' }}>
          {metrics.map((metric) => (
            <div key={metric.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #bae6fd 0%, #0ea5e9 50%, #bae6fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', lineHeight: '1', textShadow: '0 4px 20px rgba(14, 165, 233, 0.3)' }}>{metric.value}</span>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{metric.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* SECTION 3: AUTOMATION */}
      <motion.div
        className="section text-protect"
        id="automation"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <div style={{ paddingLeft: '2.5rem' }}>
          <h2 className="section-title" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>AUTOMATION</h2>
          <p className="section-subtitle" style={{ fontSize: '28px', textAlign: 'justify', position: 'relative', zIndex: 10 }}>
            We take care of your daily routines, giving your team the freedom to explore new ways of working. With us, you can build workflows for ideas you couldn't manage manually and Fine-tune every process to its absolute best. We architect the ideal solutions When challenges arise.
          </p>
          <div className="sleek-masonry">
          {[
            { title: 'Hours Saved', desc: 'What took hours now takes minutes.', icon: Clock, animProps: { animate: { rotate: [0, -15, 15, -15, 15, 0] }, transition: { repeat: Infinity, duration: 2, repeatDelay: 1 } } },
            { title: 'Implementation', desc: 'We understand your process and build the automation around it.', icon: Cog, animProps: { animate: { rotate: 360 }, transition: { repeat: Infinity, duration: 4, ease: "linear" } } },
            { title: 'Quality', desc: 'Automation keeps your processes aligned to your standards.', icon: ShieldCheck, animProps: { animate: { scale: [1, 1.2, 1] }, transition: { repeat: Infinity, duration: 2 } } },
            { title: 'Opportunities', desc: 'Automation enhances opportunities, opening doors for new innovation and problem-solving.', icon: Ticket, animProps: { animate: { rotateY: [0, 180, 360] }, transition: { repeat: Infinity, duration: 3, ease: "linear" } } }
          ].map(({ title, desc, icon: Icon, animProps }) => (
            <div className="sleek-item" key={title}>
              <strong className="heading-text mb-2" style={{ display: 'block', lineHeight: '1.4' }}>
                <span style={{ display: 'inline' }}>{title}</span>
                <motion.div animate={animProps.animate} transition={animProps.transition as any} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: '0.6rem', verticalAlign: 'text-bottom' }}>
                  <Icon className="w-6 h-6 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
                </motion.div>
              </strong>
              <span className="matter-text">{desc}</span>
            </div>
          ))}
        </div>
        </div>
      </motion.div>

      {/* SECTION 4: BI */}
      <motion.div
        className="section text-protect"
        id="bi"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%', paddingRight: '2.5rem' }}>
          <div style={{ maxWidth: '1050px', width: '100%' }}>
            <h2 className="section-title" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)', marginBottom: '0.5rem', textAlign: 'left', paddingLeft: 0, marginLeft: 0 }}>BUSINESS INTELLIGENCE</h2>
            <p className="section-subtitle" style={{ fontSize: '28px', textAlign: 'justify', position: 'relative', zIndex: 10, paddingLeft: 0, marginLeft: 0 }}>
              We turn scattered data into clear, actionable insights — all in one easy-to-read dashboard. Every team sees the same picture, making decisions faster and tracking performance with confidence. Our dashboards go beyond the numbers: they explain what happened, uncover why, forecast what's coming, and guide the best next steps.
            </p>
          </div>
          <div className="sleek-masonry">
          {[
            { title: 'Know Your Numbers', desc: 'See exactly how your operations are performing right now, not yesterday.', icon: BarChart2, animProps: { animate: { y: [0, -4, 0], scaleY: [1, 1.2, 1] }, transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } } },
            { title: 'Find What\'s Slowing You Down', desc: 'Identify exactly where bottlenecks happen so you can fix them at the source.', icon: CustomTarazu, animProps: { animate: {}, transition: {} } },
            { title: 'Plan Ahead With Confidence', desc: 'Forecast upcoming trends so you can prepare before they become urgent problems.', icon: Compass, animProps: { animate: { rotate: [0, 45, 0, -45, 0] }, transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } } },
            { title: 'Visibility Into Operation', desc: 'Data Analysis across every team and process without the noise.', icon: Eye, animProps: { animate: { scaleY: [1, 0.1, 1] }, transition: { repeat: Infinity, duration: 0.15, repeatDelay: 3, ease: "easeInOut" } } }
          ].map(({ title, desc, icon: Icon, animProps }) => (
            <div className="sleek-item" key={title}>
              <strong className="heading-text mb-2" style={{ display: 'block', lineHeight: '1.4' }}>
                <span style={{ display: 'inline' }}>{title}</span>
                <motion.div animate={animProps.animate} transition={animProps.transition as any} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: '0.6rem', verticalAlign: 'text-bottom' }}>
                  <Icon className="w-6 h-6 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
                </motion.div>
              </strong>
              <span className="matter-text">{desc}</span>
            </div>
          ))}
        </div>
        </div>
      </motion.div>
    </div>
  );
}
