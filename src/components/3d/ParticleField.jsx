import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField({ count = 60, scale = 10, color = '#00f0ff', scroll, reduceMotion }) {
  const points = useRef();

  // Create positions, sizes, and alpha attributes for particles
  const { positions, sizes } = useMemo(() => {
    const vertices = new Float32Array(count * 3);
    const particleSizes = new Float32Array(count);

    for (let index = 0; index < count; index++) {
      const offset = index * 3;
      const seed = index + 1;

      vertices[offset] = (Math.sin(seed * 127.1) * 0.5) * scale;
      vertices[offset + 1] = (Math.sin(seed * 311.7) * 0.5) * scale;
      vertices[offset + 2] = (Math.sin(seed * 74.7) * 0.5) * scale;

      particleSizes[index] = 0.015 + Math.random() * 0.025;
    }

    return { positions: vertices, sizes: particleSizes };
  }, [count, scale]);

  useFrame((state, delta) => {
    if (!points.current) return;

    const time = reduceMotion ? 0 : state.clock.elapsedTime;
    const pointerX = reduceMotion ? 0 : (scroll?.current?.pointerX ?? state.pointer.x);
    const pointerY = reduceMotion ? 0 : (scroll?.current?.pointerY ?? state.pointer.y);
    const progress = reduceMotion ? 0 : (scroll?.current?.progress ?? 0);

    // Dynamic rotation reactive to scroll & pointer
    points.current.rotation.y = THREE.MathUtils.damp(
      points.current.rotation.y,
      pointerX * 0.045 + progress * 0.08 + time * 0.02,
      1.5,
      delta
    );
    points.current.rotation.x = THREE.MathUtils.damp(
      points.current.rotation.x,
      pointerY * 0.03 + Math.sin(time * 0.2) * 0.02,
      1.5,
      delta
    );

    // Micro floating position bobbing
    points.current.position.y = Math.sin(time * 0.25) * 0.08;
    points.current.position.z = Math.cos(time * 0.18) * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.03}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}