import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Hero() {
  const reduceMotion = useReducedMotion();

  // Animation variants for smooth staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow hero-glow--top" aria-hidden="true" />
      
      <div className="hero-content page-shell">
        <motion.div
          className="hero-copy"
          variants={reduceMotion ? undefined : containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <motion.p className="eyebrow" variants={reduceMotion ? undefined : itemVariants}>
            <span className="eyebrow-dot" /> DEVCORE&nbsp; / &nbsp;DIGITAL SYSTEMS BUILT TO MOVE
          </motion.p>
          
          <motion.h1 variants={reduceMotion ? undefined : itemVariants}>
            Build Smarter.<br />
            <span>Scale Faster.</span>
          </motion.h1>
          
          <motion.p className="hero-lede" variants={reduceMotion ? undefined : itemVariants}>
            Powerful web applications and POS solutions, built for modern business.
          </motion.p>
          
          <motion.div className="hero-actions" variants={reduceMotion ? undefined : itemVariants}>
            <a 
              className="button button--primary" 
              href="#solutions"
              onClick={(e) => handleSmoothScroll(e, '#solutions')}
            >
              Explore solutions <ArrowUpRight size={16} strokeWidth={1.8} />
            </a>
            <a 
              className="button button--text" 
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, '#contact')}
            >
              Let&apos;s talk <ArrowUpRight size={15} strokeWidth={1.8} className="button-arrow" />
            </a>
          </motion.div>
          
          <motion.div className="hero-proof" variants={reduceMotion ? undefined : itemVariants}>
            <span className="hero-proof-line" />
            <span>Built for the way business actually works.</span>
          </motion.div>
        </motion.div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual-label">
            <span className="status-indicator" />
            <span>CONNECTED SYSTEMS</span>
          </div>
          <div className="hero-visual-index">01 — 03</div>
        </div>

        <a 
          className="hero-scroll" 
          href="#intro" 
          onClick={(e) => handleSmoothScroll(e, '#intro')}
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown size={14} />
        </a>

        <span className="hero-coordinate" aria-hidden="true">
          SYSTEMS / ALWAYS IN SYNC
        </span>
      </div>
    </section>
  );
}