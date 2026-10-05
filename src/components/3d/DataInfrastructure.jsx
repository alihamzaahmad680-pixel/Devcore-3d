import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const dataPath = [
  [-1.55, 0.35, 0.15],
  [-0.75, 0.75, 0.5],
  [0.15, 0.12, -0.08],
  [1.1, -0.05, -0.42],
  [1.92, 0.35, -0.12],
];

function DatabaseStack({ onFocus }) {
  const stackGroup = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (stackGroup.current) {
      stackGroup.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <group
      ref={stackGroup}
      position={[1.62, -0.02, -0.45]}
      onClick={onFocus}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.08 : 1}
    >
      {[0, 1, 2].map((level) => (
        <group key={level} position={[0, level * 0.38, 0]}>
          {/* Main Glass/Holographic Storage Disc */}
          <mesh>
            <cylinderGeometry args={[0.58, 0.58, 0.22, 32]} />
            <meshPhysicalMaterial
              color="#00f0ff"
              metalness={0.8}
              roughness={0.1}
              transparent
              opacity={0.8}
              transmission={0.6}
              clearcoat={1}
            />
          </mesh>

          {/* Emissive Core Ring */}
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.42, 0.02, 16, 32]} />
            <meshBasicMaterial color={level === 2 ? '#7000ff' : '#00f0ff'} />
          </mesh>

          {/* Outer Cyber Pulse Ring */}
          <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.59, 0.62, 32]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      <pointLight position={[0, 0.8, 0]} color="#00f0ff" intensity={2} distance={3} />
    </group>
  );
}

function ServerBlock() {
  const rackRef = useRef();

  useFrame((state) => {
    if (rackRef.current) {
      rackRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    }
  });

  return (
    <group ref={rackRef} position={[-1.75, -0.12, -0.72]}>
      {[0, 1, 2].map((level) => (
        <group key={level} position={[0, level * 0.68, 0]}>
          {/* Main Metallic Server Blade Box */}
          <mesh>
            <boxGeometry args={[0.8, 0.58, 0.65]} />
            <meshStandardMaterial color="#0b0e14" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Front Panel Grid lines */}
          <mesh position={[0, 0, 0.33]}>
            <planeGeometry args={[0.72, 0.48]} />
            <meshStandardMaterial color="#161b26" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Glowing Status Indicator Strip */}
          <mesh position={[-0.15, 0, 0.34]}>
            <boxGeometry args={[0.35, 0.03, 0.02]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>

          {/* Blink Indicator LEDs */}
          <mesh position={[0.28, 0.15, 0.34]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshBasicMaterial color={level === 1 ? '#7000ff' : '#00f0ff'} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 0.5, 0.5]} color="#7000ff" intensity={1.5} distance={2} />
    </group>
  );
}

export default function DataInfrastructure({ scroll, reduceMotion }) {
  const group = useRef();
  const packet = useRef();

  // Smooth CatmullRom Curve Highway Path
  const { curvePath, tubeGeometry } = useMemo(() => {
    const vectors = dataPath.map((pt) => new THREE.Vector3(...pt));
    const curve = new THREE.CatmullRomCurve3(vectors);
    const geom = new THREE.TubeGeometry(curve, 64, 0.012, 8, false);
    return { curvePath: curve, tubeGeometry: geom };
  }, []);

  const focusDatabase = (event) => {
    if (event.nativeEvent?.target?.closest?.('a, button, input, textarea')) return;
    event.stopPropagation();
    window.dispatchEvent(new CustomEvent('devcore:focus-object', { detail: 'database' }));
  };

  useFrame((state, delta) => {
    const phase = scroll.current.phase ?? 0;
    const inInfrastructure = THREE.MathUtils.smoothstep(phase, 6.15, 6.65) * (1 - THREE.MathUtils.smoothstep(phase, 7.65, 8.15));
    const targetScale = Math.max(0.001, inInfrastructure);
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, targetScale, 1.8, delta));
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, 0.25, 1.5, delta);

    // Animate High-Speed Traveling Packet along the Curve Pipe
    if (!reduceMotion && packet.current && curvePath) {
      const progress = (state.clock.elapsedTime * 0.3) % 1;
      const pointOnCurve = curvePath.getPointAt(progress);
      packet.current.position.copy(pointOnCurve);
    }
  });

  return (
    <group ref={group}>
      {/* Curved Cyber Data Pipe */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} wireframe={false} />
      </mesh>

      <ServerBlock />
      <DatabaseStack onFocus={focusDatabase} />

      {/* Nodes along Data Highway */}
      {dataPath.map((position, index) => (
        <group key={index} position={position}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={index === dataPath.length - 1 ? '#7000ff' : '#00f0ff'}
              emissive={index === dataPath.length - 1 ? '#7000ff' : '#00f0ff'}
              emissiveIntensity={1}
            />
          </mesh>
          <pointLight color={index === dataPath.length - 1 ? '#7000ff' : '#00f0ff'} intensity={0.8} distance={1} />
        </group>
      ))}

      {/* Traveling Energy Pulse Packet */}
      <mesh ref={packet}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight color="#00f0ff" intensity={2.5} distance={2} />
      </mesh>
    </group>
  );
}