import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DigitalCore({ size, scroll, reduceMotion }) {
  const group = useRef();
  const innerCore = useRef();
  const outerWireframe = useRef();
  const ringGroupA = useRef();
  const ringGroupB = useRef();
  const orbitA = useRef();
  const orbitB = useRef();

  useFrame((state, delta) => {
    const mobile = size.width < 680;
    const phase = scroll.current.service;

    // Smooth Lerping for Position and Scale
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      (mobile ? -1.3 : 1.4) + scroll.current.pointerX * 0.12,
      1.5,
      delta
    );
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      (mobile ? 1.55 : 0.35) + scroll.current.pointerY * 0.08,
      1.5,
      delta
    );
    group.current.scale.setScalar(
      THREE.MathUtils.damp(
        group.current.scale.x,
        mobile ? 0.76 : 0.96 + (phase === 2 ? 0.18 : 0),
        1.5,
        delta
      )
    );

    if (!reduceMotion) {
      const t = state.clock.elapsedTime;

      // Core & Wireframe Rotations
      group.current.rotation.y = t * 0.15;
      if (innerCore.current) innerCore.current.rotation.x = t * 0.2;
      if (outerWireframe.current) {
        outerWireframe.current.rotation.y = -t * 0.25;
        outerWireframe.current.rotation.z = t * 0.1;
      }

      // Gyroscopic Ring Animations
      if (ringGroupA.current) {
        ringGroupA.current.rotation.x = t * 0.35;
        ringGroupA.current.rotation.y = t * 0.2;
      }
      if (ringGroupB.current) {
        ringGroupB.current.rotation.y = -t * 0.4;
        ringGroupB.current.rotation.z = t * 0.25;
      }

      // Orbital Satellite Rotations
      if (orbitA.current) {
        orbitA.current.rotation.y = t * 0.6;
        orbitA.current.rotation.x = Math.sin(t * 0.5) * 0.2;
      }
      if (orbitB.current) {
        orbitB.current.rotation.y = -t * 0.5;
        orbitB.current.rotation.z = Math.cos(t * 0.5) * 0.25;
      }
    }
  });

  return (
    <group ref={group}>
      {/* 1. Inner Quantum Glowing Core */}
      <mesh ref={innerCore}>
        <icosahedronGeometry args={[0.85, 4]} />
        <meshPhysicalMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1}
          transmission={0.4}
          thickness={0.5}
        />
      </mesh>

      {/* 2. Outer Cyber Wireframe Hologram */}
      <mesh ref={outerWireframe} scale={1.12}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshBasicMaterial color="#7000ff" wireframe transparent opacity={0.35} />
      </mesh>

      {/* 3. Gyroscopic Ring A (Cyan Glowing) */}
      <group ref={ringGroupA}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.25, 0.012, 16, 100]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.75} />
        </mesh>
      </group>

      {/* 4. Gyroscopic Ring B (Purple Glowing) */}
      <group ref={ringGroupB}>
        <mesh rotation={[0, Math.PI / 4, Math.PI / 6]}>
          <torusGeometry args={[1.48, 0.009, 16, 100]} />
          <meshBasicMaterial color="#7000ff" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* 5. Orbital System A (Floating Crystals) */}
      <group ref={orbitA}>
        <mesh position={[1.25, 0, 0]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[-1.25, 0, 0]} scale={0.7}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* 6. Orbital System B (Purple Energy Nodes) */}
      <group ref={orbitB}>
        <mesh position={[1.48, 0, 0]}>
          <icosahedronGeometry args={[0.1, 1]} />
          <meshStandardMaterial
            color="#7000ff"
            emissive="#7000ff"
            emissiveIntensity={0.8}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[-1.48, 0, 0]} scale={0.5}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>

      {/* Core Dynamic Lights */}
      <pointLight color="#00f0ff" intensity={3} distance={5} />
      <pointLight color="#7000ff" intensity={2.5} distance={4} position={[0, -1, 0]} />
    </group>
  );
}