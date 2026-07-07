import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './AbstractMechanics.css';

const AbstractMechanics = () => {
  const { scrollYProgress } = useScroll();
  
  // High-precision rotation transforms
  const rotateOuter = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotateMiddle = useTransform(scrollYProgress, [0, 1], [0, -360]);
  const rotateInner = useTransform(scrollYProgress, [0, 1], [0, 720]);

  // Parallax Y for the entire mechanism
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 400]);

  return (
    <div className="mechanics-container">
      <motion.div 
        className="mechanics-assembly"
        style={{ y: yParallax }}
      >
        {/* Outer Ring */}
        <motion.div 
          className="mech-ring mech-ring-outer"
          style={{ rotate: rotateOuter }}
        >
          <div className="mech-tick mech-tick-1"></div>
          <div className="mech-tick mech-tick-2"></div>
          <div className="mech-tick mech-tick-3"></div>
          <div className="mech-tick mech-tick-4"></div>
        </motion.div>

        {/* Middle Ring */}
        <motion.div 
          className="mech-ring mech-ring-middle"
          style={{ rotate: rotateMiddle }}
        >
          <svg viewBox="0 0 100 100" className="mech-svg">
            <circle cx="50" cy="50" r="48" strokeDasharray="4 12" />
          </svg>
        </motion.div>

        {/* Inner Ring (Core) */}
        <motion.div 
          className="mech-ring mech-ring-inner"
          style={{ rotate: rotateInner }}
        >
          <div className="mech-core"></div>
        </motion.div>
        
        {/* Abstract Data Lines */}
        <div className="mech-data-line line-horizontal"></div>
        <div className="mech-data-line line-vertical"></div>
      </motion.div>
    </div>
  );
};

export default AbstractMechanics;
