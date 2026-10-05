import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const focusDetails = {
  web: ['WEB APPLICATION', 'A tailored digital workspace, shaped around how your business runs.'],
  pos: ['POINT OF SALE', 'Sales, products and inventory—together in one dependable system.'],
  database: ['CONNECTED DATA', 'Secure, connected information that flows between your business systems.'],
  analytics: ['BUSINESS ANALYTICS', 'Clear, timely insight into the numbers that keep your business moving.'],
};

export default function FocusPanel() {
  const [active, setActive] = useState(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const show = (event) => setActive(event.detail);
    const hide = () => setActive(null);
    window.addEventListener('devcore:focus-object', show);
    window.addEventListener('devcore:leave-focus', hide);
    return () => {
      window.removeEventListener('devcore:focus-object', show);
      window.removeEventListener('devcore:leave-focus', hide);
    };
  }, []);

  const detail = active ? focusDetails[active] : null;

  return (
    <AnimatePresence>
      {detail && (
        <motion.aside
          className="fixed bottom-8 left-8 z-40 max-w-md w-full p-6 rounded-2xl bg-[#05070c]/85 backdrop-blur-xl border border-[#00f0ff]/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] text-white"
          initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.97 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
        >
          {/* Header Index Tag */}
          <div className="flex items-center space-x-2 text-xs font-mono tracking-widest text-[#00f0ff] mb-3 uppercase">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span>SYSTEM // {detail[0]}</span>
          </div>

          {/* Description Text */}
          <p className="text-sm font-sans text-[#a0a5b5] leading-relaxed mb-6">
            {detail[1]}
          </p>

          {/* Actions Bar */}
          <div className="flex items-center justify-between space-x-4 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('devcore:leave-focus'))}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-wider text-white border border-white/10 hover:border-[#00f0ff]/50 transition-all duration-300"
            >
              <ArrowLeft size={14} className="text-[#00f0ff]" />
              <span>Return to universe</span>
            </button>

            <a
              href="#contact"
              aria-label="Discuss this system"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-[#00f0ff] to-[#7000ff] text-black font-bold hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              <ArrowUpRight size={18} />
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}