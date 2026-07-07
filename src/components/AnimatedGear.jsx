import React from 'react';
import { motion } from 'framer-motion';
import gearImage from '../assets/gear-sketch.png';
import './AnimatedGear.css';

const AnimatedGear = ({ className = '', size = 120 }) => {
  return (
    <div className={`animated-gear-wrapper ${className}`} style={{ width: size, height: size }}>
      <motion.img 
        src={gearImage} 
        alt="Nano Banana Gear Sketch" 
        className="gear-sketch-img"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 20, 
          ease: "linear", 
          repeat: Infinity 
        }}
      />
    </div>
  );
};

export default AnimatedGear;
