import { useEffect, useState } from 'react';

function readScrollProgress() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollableHeight <= 0) return 0;

  return Math.min(1, Math.max(0, window.scrollY / scrollableHeight));
}

export default function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => setProgress(readScrollProgress()));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return progress;
}
