import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  const frameRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.25,
      lerp: 0.09,
      syncTouch: false,
    });

    window.lenis = lenis;
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    const handleScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on('scroll', handleScroll);

    const raf = (time) => {
      lenis.raf(time);
      frameRef.current = requestAnimationFrame(raf);
    };

    frameRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameRef.current);
      lenis.off('scroll', handleScroll);
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      if (window.lenis === lenis) delete window.lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}