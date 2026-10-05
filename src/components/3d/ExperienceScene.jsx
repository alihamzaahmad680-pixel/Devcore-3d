import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DigitalCore from './DigitalCore';
import POSSystem from './POSSystem';
import FloatingPanels from './FloatingPanels';
import ConnectionLines from './ConnectionLines';
import ParticleField from './ParticleField';
import StoryObjects from './StoryObjects';
import ServiceObjects from './ServiceObjects';
import DataInfrastructure from './DataInfrastructure';
import Effects from './Effects';

const cameraPath = [
  [0, 0, 10.2],
  [0, 0, 8.7],
  [0.35, 0.2, 6.7],
  [-1.15, 0.1, 5.4],
  [0.85, -0.2, 4.45],
  [0.1, 0.1, 3.85],
  [-1.5, 0.05, 4.8],
  [1.35, -0.1, 4.9],
  [0.15, 0, 6.3],
  [0.65, 0.15, 8.2],
  [0, 0, 6.0],
];

const focusViews = {
  web: { position: [-0.85, 0.8, 4.1], target: [-0.85, 1.52, -0.35] },
  pos: { position: [1.75, -0.1, 3.55], target: [1.75, -0.1, 0] },
  database: { position: [2.4, 1, 3.6], target: [1.87, 0.3, -0.45] },
  analytics: { position: [4.1, 0.9, 3.9], target: [4.3, 1.62, -0.3] },
};

function smoothstep(value) {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

export default function ExperienceScene({ reduceMotion }) {
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  const starGroupRef = useRef();
  const scroll = useRef({ progress: 0, pointerX: 0, pointerY: 0, service: 0, focus: null });
  const { camera, size } = useThree();

  // Enhanced Starfield Generator
  const starPositions = useMemo(() => {
    const values = new Float32Array(250 * 3);
    for (let index = 0; index < 250; index++) {
      const offset = index * 3;
      values[offset] = (Math.sin((index + 1) * 127.1) * 0.5) * 16;
      values[offset + 1] = (Math.sin((index + 1) * 311.7) * 0.5) * 12;
      values[offset + 2] = -2 - (index % 25) * 0.5;
    }
    return values;
  }, []);

  useEffect(() => {
    const timeline = scroll.current;
    const updatePointer = (event) => {
      timeline.pointerX = reduceMotion ? 0 : (event.clientX / window.innerWidth) * 2 - 1;
      timeline.pointerY = reduceMotion ? 0 : -((event.clientY / window.innerHeight) * 2 - 1);
    };
    const updateService = (event) => { timeline.service = event.detail; };
    const focusObject = (event) => { timeline.focus = event.detail; };
    const leaveFocus = () => { timeline.focus = null; };
    const leaveOnEscape = (event) => {
      if (event.key === 'Escape') timeline.focus = null;
    };

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: document.querySelector('.site-main'),
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate: (self) => { timeline.progress = self.progress; },
      onRefresh: (self) => { timeline.progress = self.progress; },
    });
    timeline.progress = trigger.progress;

    window.addEventListener('resize', ScrollTrigger.refresh, { passive: true });
    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('devcore:service-active', updateService);
    window.addEventListener('devcore:focus-object', focusObject);
    window.addEventListener('devcore:leave-focus', leaveFocus);
    window.addEventListener('keydown', leaveOnEscape);

    return () => {
      trigger.kill();
      window.removeEventListener('resize', ScrollTrigger.refresh);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('devcore:service-active', updateService);
      window.removeEventListener('devcore:focus-object', focusObject);
      window.removeEventListener('devcore:leave-focus', leaveFocus);
      window.removeEventListener('keydown', leaveOnEscape);
    };
  }, [reduceMotion]);

  useFrame((state, delta) => {
    const data = scroll.current;
    const route = data.progress * (cameraPath.length - 1);
    const segment = Math.min(cameraPath.length - 2, Math.floor(route));
    const progress = smoothstep(route - segment);
    data.phase = route;
    const from = cameraPath[segment];
    const to = cameraPath[segment + 1];
    const mobileScale = size.width < 680 ? 1.22 : 1;
    const mouseX = reduceMotion ? 0 : data.pointerX;
    const mouseY = reduceMotion ? 0 : data.pointerY;

    // Smooth Starfield Background Rotation
    if (starGroupRef.current && !reduceMotion) {
      starGroupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }

    // Camera Spline Interpolation
    cameraTarget.current.set(
      THREE.MathUtils.lerp(from[0], to[0], progress) * (size.width < 680 ? 0.48 : 1) + mouseX * 0.2,
      THREE.MathUtils.lerp(from[1], to[1], progress) * (size.width < 680 ? 0.72 : 1) + mouseY * 0.12,
      THREE.MathUtils.lerp(from[2], to[2], progress) * mobileScale
    );

    let viewTarget = new THREE.Vector3(mouseX * 0.12, mouseY * 0.08, 0);
    const focusView = focusViews[data.focus];
    if (focusView) {
      cameraTarget.current.set(...focusView.position);
      viewTarget = new THREE.Vector3(...focusView.target);
    }

    // Damp Camera Position & Target Rotation
    camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraTarget.current.x, 1.8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraTarget.current.y, 1.8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraTarget.current.z, 1.6, delta);

    lookTarget.current.x = THREE.MathUtils.damp(lookTarget.current.x, viewTarget.x, 1.8, delta);
    lookTarget.current.y = THREE.MathUtils.damp(lookTarget.current.y, viewTarget.y, 1.8, delta);
    lookTarget.current.z = THREE.MathUtils.damp(lookTarget.current.z, viewTarget.z, 1.8, delta);

    camera.lookAt(lookTarget.current);
  });

  return (
    <>
      <Effects />

      {/* Main 3D Experience World Group */}
      <group>
        <Float
          speed={reduceMotion ? 0 : 0.5}
          rotationIntensity={reduceMotion ? 0 : 0.05}
          floatIntensity={reduceMotion ? 0 : 0.15}
        >
          <POSSystem size={size} scroll={scroll} />
          <DigitalCore size={size} scroll={scroll} reduceMotion={reduceMotion} />
          <FloatingPanels size={size} scroll={scroll} reduceMotion={reduceMotion} />
          <ServiceObjects scroll={scroll} reduceMotion={reduceMotion} />
          <DataInfrastructure scroll={scroll} reduceMotion={reduceMotion} />
        </Float>
        <ConnectionLines scroll={scroll} reduceMotion={reduceMotion} />
        <StoryObjects scroll={scroll} reduceMotion={reduceMotion} />
      </group>

      {/* Animated Deep Space Stars */}
      <points ref={starGroupRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#00f0ff"
          size={0.022}
          transparent
          opacity={0.4}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Atmospheric Micro Floating Dust Particles */}
      <ParticleField count={60} scale={10} color="#00f0ff" scroll={scroll} reduceMotion={reduceMotion} />
    </>
  );
}