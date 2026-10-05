import { motion, useReducedMotion } from 'framer-motion';

export default function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 0.72,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'none'
  distance = 26,
  once = true,
  amount = 0.18,
  as = 'div',
  ...props
}) {
  const reduceMotion = useReducedMotion();

  // Direction offset calculator
  const getInitialPosition = () => {
    if (reduceMotion || direction === 'none') return { opacity: 1, x: 0, y: 0 };

    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance, x: 0 };
      case 'down':
        return { opacity: 0, y: -distance, x: 0 };
      case 'left':
        return { opacity: 0, x: distance, y: 0 };
      case 'right':
        return { opacity: 0, x: -distance, y: 0 };
      default:
        return { opacity: 0, y: distance, x: 0 };
    }
  };

  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      initial={getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }
      }
      {...props}
    >
      {children}
    </Component>
  );
}