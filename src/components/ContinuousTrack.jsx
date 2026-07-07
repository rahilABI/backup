import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ContinuousTrack.css';

const ContinuousTrack = () => {
  const { scrollYProgress } = useScroll();

  // The track height expands from 0% to 100% as the user scrolls
  const trackHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  
  // A glowing dot that moves exactly at the bottom of the active track
  const dotY = useTransform(scrollYProgress, [0, 1], ['0vh', '100vh']);

  return (
    <div className="continuous-track-container">
      {/* Background faint line */}
      <div className="track-bg" />
      
      {/* Active glowing track that fills up on scroll */}
      <motion.div 
        className="track-fill" 
        style={{ height: trackHeight }} 
      />
      
      {/* The glowing pulse dot traveling down */}
      <motion.div 
        className="track-dot" 
        style={{ top: dotY }} 
      >
        <div className="track-dot-core" />
        <div className="track-dot-halo" />
      </motion.div>
    </div>
  );
};

export default ContinuousTrack;
