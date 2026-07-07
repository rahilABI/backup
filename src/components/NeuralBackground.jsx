import React, { useEffect, useRef } from 'react';
import './NeuralBackground.css';

/* ─────────────────────────────────────────────────────────────
   ABI Portal — Unified Interactive Morphing Background

   Hero/Process  → Interactive 3D Plexus
                   Dense network of floating nodes reacting to 
                   mouse physics. Deep parallax.
                   
   Automation    → Fully-formed 3D brain wireframe
                   Nodes from the plexus smoothly morph into
                   exact 3D coordinates.

   BI            → Brain morphs → Bulb + micro glow
───────────────────────────────────────────────────────────── */
const NeuralBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let rafId;
    let W = 0, H = 0;
    let t = 0;

    /* ── Mouse & Physics ── */
    let mx = 0.5, my = 0.5; // normalized 0-1
    let rawMouseX = -9999, rawMouseY = -9999;
    
    const onMouse = (e) => { 
      mx = e.clientX / W; 
      my = e.clientY / H; 
      rawMouseX = e.clientX;
      rawMouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    /* ── scroll ── */
    let scrollY = 0;
    let autoTop = 9999, biTop = 9999;
    const onScroll = () => { scrollY = window.scrollY; };
    const measureSections = () => {
      const aEl = document.getElementById('automation');
      const bEl = document.getElementById('bi');

      autoTop = aEl ? aEl.offsetTop : window.innerHeight * 2.2;
      biTop   = bEl ? bEl.offsetTop   : autoTop + window.innerHeight * 1.2;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ─────────────────────────────────────────────────────
       UNIFIED PARTICLE SYSTEM
    ───────────────────────────────────────────────────── */
    let particles = [];
    let brainRot = 0;

    const buildParticles = () => {
      particles = [];
      const count = Math.min(Math.floor(W * H / 2500), 820); // High density

      for (let i = 0; i < count; i++) {
        /* BRAIN MESH COORDINATES (State B) */
        const u = Math.random() * Math.PI * 2;
        const v = Math.acos(2 * Math.random() - 1);
        const fold = 0.07*Math.sin(12*u)*Math.cos(10*v) + 0.03*Math.sin(20*u+15*v);
        const r = 1 + fold;
        let bx = r*Math.sin(v)*Math.cos(u)*0.70;
        let by = r*Math.cos(v)*0.75;
        let bz = r*Math.sin(v)*Math.sin(u)*1.15;
        if (bz > 0) { bx *= (1-0.15*bz); by *= (1-0.05*bz); }
        if (by < -0.1) by *= 0.3;
        bx += bx > 0 ? 0.07 : -0.07;

        /* BULB MESH COORDINATES (State C) */
        const reg = Math.random();
        let bux=0, buy=0, buz=0;
        if (reg < 0.75) {
          const bu=Math.random()*Math.PI*2, bv=Math.acos(2*Math.random()-1);
          bux=Math.sin(bv)*Math.cos(bu); buy=-(Math.cos(bv)-0.4); buz=Math.sin(bv)*Math.sin(bu);
          if (buy<-0.4) { bux*=(1-(-buy-0.4)); buz*=(1-(-buy-0.4)); }
        } else if (reg<0.9) {
          const bu=Math.random()*Math.PI*2, bh=Math.random(), rad=0.6-bh*0.2;
          bux=rad*Math.cos(bu); buy=-(0.4+bh*0.6); buz=rad*Math.sin(bu);
        } else {
          const bu=Math.random()*Math.PI*2, bh=Math.random(), rad=0.4+0.05*Math.sin(bh*30);
          bux=rad*Math.cos(bu); buy=0.4+bh*0.3; buz=rad*Math.sin(bu);
        }
        bux*=0.8; buy*=0.8; buz*=0.8;

        /* PLEXUS COORDINATES (State A) */
        const heroDepth = Math.random(); // 0 = back, 1 = front
        const speedMult = 0.15 + heroDepth * 0.45;

        particles.push({ 
          bx, by, bz, bux, buy, buz,
          pulse: Math.random()*Math.PI*2,
          pSpeed: Math.random()*0.022+0.008,
          baseR: Math.random()*1.4+0.6,
          // Plexus State
          heroX: Math.random() * W,
          heroY: Math.random() * H,
          vx: (Math.random() - 0.5) * speedMult,
          vy: (Math.random() - 0.5) * speedMult,
          heroDepth: heroDepth,
        });
      }
    };

    /* ─────────────────────────────────────────────────────
       Main Rendering & Interpolation
    ───────────────────────────────────────────────────── */
    const drawCombined = (brainAlpha, biProg) => {
      // Smooth cubic-bezier easing for the morph transition
      const ease = brainAlpha < 0.5 ? 2 * brainAlpha * brainAlpha : 1 - Math.pow(-2 * brainAlpha + 2, 2) / 2;
      
      // Shift cx to the right as it morphs into brain and bulb (from center to 75% width)
      const cx = W/2 + (W * 0.25) * ease; 
      const cy = H/2;
      const scl = Math.min(W,H)*0.35;
      const tilt = 0.25;
      const now = Date.now()*0.001;
      
      const pxShift = (mx - 0.5) * 18;
      const pyShift = (my - 0.5) * 12;

      ctx.save();
      
      // Hero ambient glow
      if (brainAlpha < 0.3) {
        const gx = W * (0.65 + (mx - 0.5) * 0.08);
        const gy = H * (0.35 + (my - 0.5) * 0.06);
        const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * 0.55);
        grd.addColorStop(0,   `rgba(210,170,90,${0.065 * (1 - brainAlpha)})`);
        grd.addColorStop(0.5, `rgba(133,100,48,${0.022 * (1 - brainAlpha)})`);
        grd.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      // Transition burst
      if (biProg > 0 && biProg < 1) {
        const burst = Math.sin(biProg * Math.PI);
        const burstGlow = burst * 0.18;
        const grd2=ctx.createRadialGradient(cx,cy,0,cx,cy,scl*3);
        grd2.addColorStop(0,   `rgba(220,175,95,${burstGlow})`);
        grd2.addColorStop(0.4, `rgba(133,100,48,${burstGlow*0.4})`);
        grd2.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle=grd2;
        ctx.beginPath(); ctx.arc(cx,cy,scl*3,0,Math.PI*2); ctx.fill();
      }
      
      // BI glow
      if (biProg > 0.6) {
        const gi = (biProg - 0.6) / 0.4 * 0.08;
        const grd=ctx.createRadialGradient(cx,cy,0,cx,cy,scl*2.5);
        grd.addColorStop(0, `rgba(200,160,90,${gi})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle=grd;
        ctx.beginPath(); ctx.arc(cx,cy,scl*2.5,0,Math.PI*2); ctx.fill();
      }

      // Easing moved to top for cx calculation
      // Update positions and interpolations
      const repelDist = 140;
      
      for (const p of particles) {
        p.pulse += p.pSpeed;
        
        // 1. Plexus Physics (only update if visible to save CPU)
        if (brainAlpha < 0.99) {
          p.heroX += p.vx;
          p.heroY += p.vy;

          // Gentle bounce with overflow buffer
          if (p.heroX < -150) p.vx *= -1;
          if (p.heroX > W + 150) p.vx *= -1;
          if (p.heroY < -150) p.vy *= -1;
          if (p.heroY > H + 150) p.vy *= -1;

          // Mouse Repel Force (simulates pushing through nodes)
          const dx = p.heroX - rawMouseX;
          const dy = p.heroY - rawMouseY;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < repelDist) {
            const force = (repelDist - dist) / repelDist;
            // Foreground nodes pushed faster
            p.heroX += (dx / dist) * force * 3.5 * (p.heroDepth + 0.2);
            p.heroY += (dy / dist) * force * 3.5 * (p.heroDepth + 0.2);
          }
        }

        // 2. 3D Brain position (with BI interpolation)
        const cx2=p.bx+(p.bux-p.bx)*biProg;
        const cy2=p.by+(p.buy-p.by)*biProg;
        const cz2=p.bz+(p.buz-p.bz)*biProg;
        const yT=cy2*Math.cos(tilt)-cz2*Math.sin(tilt);
        const zT=cy2*Math.sin(tilt)+cz2*Math.cos(tilt);
        const fX=cx2*Math.cos(brainRot)-zT*Math.sin(brainRot);
        const fZ=cx2*Math.sin(brainRot)+zT*Math.cos(brainRot);
        const fY=yT;
        p.rx=fX; p.ry=fY; p.rz=fZ;
        const s=3.5/(3.5+fZ);
        const brainPx2 = cx+fX*s*scl; 
        const brainPy2 = cy-fY*s*scl;
        
        p.depth=Math.max(0,1-(fZ+1.5)/3.5); // 3D depth for brain
        p.shine=Math.pow(Math.max(0,Math.sin(cx2*3+now*1.5)),6);
        p.glow=(Math.sin(p.pulse)+1)*0.5;

        // 3. Final Position = Morph between 2D plexus and 3D node
        p.px2 = p.heroX + (brainPx2 - p.heroX) * ease;
        p.py2 = p.heroY + (brainPy2 - p.heroY) * ease;
      }

      // Draw Lines
      const md=0.27; // Max distance for brain connections
      
      for (let i=0; i<particles.length; i++) {
        const p = particles[i]; 
        
        // --- BRAIN WIREFRAME CONNECTIONS ---
        if (brainAlpha > 0.05 && p.depth >= 0.04) {
          let c=0;
          for (let j=i+1; j<particles.length; j++) {
            if(c>=4) break;
            const p2=particles[j]; if(p2.depth<0.04) continue;
            const dx=p.rx-p2.rx, dy=p.ry-p2.ry, dz=p.rz-p2.rz;
            const d3=Math.sqrt(dx*dx+dy*dy+dz*dz);
            if(d3<md) {
              const df=1-((p.rz+p2.rz)/2+1.5)/3.5;
              const op=(1-d3/md)*df*0.42 * brainAlpha;
              if(op>0.012){ 
                ctx.beginPath(); ctx.moveTo(p.px2,p.py2); ctx.lineTo(p2.px2,p2.py2);
                ctx.strokeStyle=`rgba(133,100,48,${op})`; ctx.lineWidth=0.55; ctx.stroke(); 
                c++; 
              }
            }
          }
        }
        
        // --- PLEXUS NETWORK CONNECTIONS ---
        // Optimization: Only check connections for nodes in the foreground (heroDepth > 0.65)
        // This keeps it performant with 800+ nodes while maintaining a dense visual web
        if (brainAlpha < 0.95 && p.heroDepth > 0.65) {
          let c=0;
          for (let j=i+1; j<particles.length; j++) {
            if(c>=3) break; // Max 3 plexus lines per node
            const p2=particles[j];
            if (p2.heroDepth > 0.65) {
              const dx = p.px2 - p2.px2;
              const dy = p.py2 - p2.py2;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 140) {
                const op = (1 - dist/140) * 0.45 * (1 - ease); // Fade lines during morph
                if (op > 0.01) {
                  ctx.beginPath(); ctx.moveTo(p.px2,p.py2); ctx.lineTo(p2.px2,p2.py2);
                  ctx.strokeStyle=`rgba(133,100,48,${op})`; ctx.lineWidth=0.6; ctx.stroke();
                  c++;
                }
              }
            }
          }
        }
        
        // --- DRAW PARTICLES ---
        const sR=Math.floor(100+155*p.shine), sG=Math.floor(75+165*p.shine), sB=Math.floor(35+165*p.shine);
        
        // Base opacity calculation based on morph
        const heroOp = (0.05 + p.heroDepth * 0.4) * (1 - ease);
        const brainOp = p.depth*(0.35+p.glow*0.35+p.shine*0.6) * ease;
        const nOp = heroOp + brainOp;
        
        // Interpolate radius from floating sizes to strict brain sizes
        const heroR = 0.5 + p.heroDepth * 1.8;
        const brainR = Math.max(p.baseR*p.depth+p.shine*2, 0.4);
        const nr = heroR * (1 - ease) + brainR * ease;
        
        if (nOp > 0.01) {
            ctx.beginPath(); ctx.arc(p.px2,p.py2,nr,0,Math.PI*2);
            ctx.fillStyle=`rgba(${sR},${sG},${sB},${nOp})`; ctx.fill();
        }
      }
      ctx.restore();
    };

    /* ─────────────────────────────────────────────────────
       Resize
    ───────────────────────────────────────────────────── */
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth; H = window.innerHeight;
      canvas.width=W*dpr; canvas.height=H*dpr;
      canvas.style.width=W+'px'; canvas.style.height=H+'px';
      ctx.scale(dpr, dpr);
      buildParticles();
      measureSections();
    };

    /* ─────────────────────────────────────────────────────
       Loop
    ───────────────────────────────────────────────────── */
    const FADE_RANGE = window.innerHeight * 0.8; // Extended range for majestic morph

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      t   += 0.004;          
      brainRot += 0.0018;

      // Morph 1: Hero Field -> Brain
      const intoAuto   = scrollY - (autoTop - FADE_RANGE);
      const brainAlpha = Math.min(1, Math.max(0, intoAuto / FADE_RANGE));

      // Morph 2: Brain -> Bulb (BI section)
      const biStart    = biTop - window.innerHeight * 0.8;
      const biEnd      = biTop - window.innerHeight * 0.2;
      const biProg     = Math.min(1, Math.max(0, (scrollY - biStart) / (biEnd - biStart)));

      drawCombined(brainAlpha, biProg);

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();
    loop();
    setTimeout(measureSections, 400);
    setTimeout(measureSections, 1200);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <div className="neural-background-container">
      <canvas ref={canvasRef} className="neural-canvas" />
    </div>
  );
};

export default NeuralBackground;
