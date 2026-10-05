import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import ExperienceScene from './ExperienceScene';
import FocusPanel from './FocusPanel';
import ExperienceLoader from './ExperienceLoader';

function ExperienceFallback() {
  return (
    <div className="experience-fallback" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

class ExperienceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('Devcore 3D experience could not be rendered.', error);
  }

  render() {
    return this.state.failed ? <ExperienceFallback /> : this.props.children;
  }
}

export default function Experience() {
  const reduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 1600);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <ExperienceErrorBoundary>
      <div className="experience-canvas relative w-full h-full min-h-screen overflow-hidden" aria-hidden="true">
        <Canvas
          camera={{ position: [2.1, 0.2, 8.5], fov: 37, near: 0.1, far: 60 }}
          dpr={[1, 2]}
          frameloop="always"
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
          fallback={<ExperienceFallback />}
          eventSource={document.body}
          eventPrefix="client"
          onCreated={() => window.setTimeout(() => setLoading(false), 500)}
          onPointerMissed={() => window.dispatchEvent(new Event('devcore:leave-focus'))}
        >
          <ExperienceScene reduceMotion={reduceMotion} />
        </Canvas>

        {/* Ambient Dark Vignette Overlay for Depth */}
        <div className="experience-vignette pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(5,7,12,0.85)_100%)]" />
      </div>

      <ExperienceLoader loaded={!loading} />
      <FocusPanel />
    </ExperienceErrorBoundary>
  );
}