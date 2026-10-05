import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

export default function CursorHalo() {
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const springX = useSpring(x, { stiffness: 210, damping: 26, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 210, damping: 26, mass: 0.3 });

  useEffect(() => {
    // Disable halo for reduced motion or touch-first devices
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return undefined;

    const move = (event) => {
      // Ignore touch and pen pointer events to prevent jumpy behavior on hybrid screens
      if (event.pointerType && event.pointerType !== 'mouse') return;

      x.set(event.clientX);
      y.set(event.clientY);

      if (!isVisible) setIsVisible(true);
    };

    const enterInteractive = (event) => {
      if (event.target.closest?.('a, button, [role="button"], input, textarea, select')) {
        document.body.classList.add('cursor-halo--active');
      }
    };

    const leaveInteractive = (event) => {
      if (!event.relatedTarget?.closest?.('a, button, [role="button"], input, textarea, select')) {
        document.body.classList.remove('cursor-halo--active');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', enterInteractive);
    document.addEventListener('pointerout', leaveInteractive);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', enterInteractive);
      document.removeEventListener('pointerout', leaveInteractive);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('cursor-halo--active');
    };
  }, [reduceMotion, isVisible, x, y]);

  if (reduceMotion) return null;

  return (
    <motion.span
      className="cursor-halo"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        opacity: isVisible ? 1 : 0,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.2 } }}
      aria-hidden="true"
    />
  );
}