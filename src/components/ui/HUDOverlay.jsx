import { useEffect, useRef, useState } from 'react';
import useScrollProgress from '../../hooks/useScrollProgress';

function createAmbientAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 55;
  filter.type = 'lowpass';
  filter.frequency.value = 140;
  gain.gain.value = 0;

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start();

  return { context, oscillator, gain };
}

export default function HUDOverlay() {
  const progress = useScrollProgress();
  const [soundOn, setSoundOn] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const audioRef = useRef(null);
  const percentage = Math.round(progress * 100);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.oscillator.stop();
    audio.context.close();
  }, []);

  const toggleSound = async () => {
    if (!audioRef.current) {
      audioRef.current = createAmbientAudio();
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (!soundOn) {
      await audio.context.resume();
      audio.gain.gain.setTargetAtTime(0.012, audio.context.currentTime, 0.25);
      setSoundOn(true);
      return;
    }

    audio.gain.gain.setTargetAtTime(0, audio.context.currentTime, 0.18);
    setSoundOn(false);
  };

  return (
    <div className="hud-overlay">
      <header className="hud-topbar">
        <a className="hud-brand" href="#hero" aria-label="Devcore home">
          <span className="hud-brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>DEVCORE</span>
        </a>
        <p className="hud-copyright">DIGITAL MATTER / COPYRIGHT © 2026</p>
        <a className="hud-manifesto" href="#about">
          <span>// MANIFESTO</span>
          <span>We build systems for what comes next.</span>
        </a>
      </header>

      <footer className="hud-bottombar">
        <button
          className="hud-sound"
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={`Turn ambient sound ${soundOn ? 'off' : 'on'}`}
        >
          <span className={`hud-audio-indicator${soundOn ? ' is-on' : ''}`} aria-hidden="true" />
          SOUND: {soundOn ? 'ON' : 'OFF'}
        </button>

        <span className="hud-coordinates">
          VIEWPORT / {String(viewport.width).padStart(4, '0')} × {String(viewport.height).padStart(4, '0')}
        </span>

        <a className="hud-radar" href="#about" aria-label="Scroll to explore">
          <span className="hud-radar-ping" aria-hidden="true" />
          <span>SCROLL TO EXPLORE</span>
        </a>
      </footer>

      <nav className="hud-progress" aria-label="Page sections">
        <span className="hud-progress-value">{String(percentage).padStart(2, '0')}</span>
        <span className="hud-progress-line" aria-hidden="true">
          <span style={{ transform: `scaleY(${progress})` }} />
        </span>
        <span className="hud-progress-value">100</span>
      </nav>
    </div>
  );
}
