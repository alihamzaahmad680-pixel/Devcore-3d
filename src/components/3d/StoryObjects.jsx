import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const attributes = [
  { x: -2.55, y: 0.6, color: '#00f0ff', shape: 0 },
  { x: -0.85, y: 1.38, color: '#7000ff', shape: 1 },
  { x: 0.95, y: -0.45, color: '#00f0ff', shape: 2 },
  { x: 2.65, y: 0.8, color: '#7000ff', shape: 3 },
];

const steps = [
  [-2.55, 0, 0.15],
  [-0.87, 0, 0.88],
  [0.87, 0, -0.48],
  [2.55, 0, 0.64],
];

function Shape({ shape, color }) {
  if (shape === 0) {
    return (
      <mesh>
        <icosahedronGeometry args={[0.38, 1]} />
        <meshPhysicalMaterial
          color="#0b0f19"
          metalness={0.7}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={0.35}
          clearcoat={1}
        />
      </mesh>
    );
  }
  if (shape === 1) {
    return (
      <mesh rotation={[0.4, 0.2, 0]}>
        <octahedronGeometry args={[0.4, 1]} />
        <meshPhysicalMaterial
          color="#0b0f19"
          metalness={0.65}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={0.35}
          clearcoat={1}
        />
      </mesh>
    );
  }
  if (shape === 2) {
    return (
      <mesh>
        <torusKnotGeometry args={[0.23, 0.085, 72, 10, 2, 3]} />
        <meshStandardMaterial
          color="#0b0f19"
          metalness={0.75}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
    );
  }
  return (
    <mesh rotation={[0.3, 0.2, 0]}>
      <dodecahedronGeometry args={[0.4, 0]} />
      <meshPhysicalMaterial
        color="#0b0f19"
        metalness={0.7}
        roughness={0.15}
        emissive={color}
        emissiveIntensity={0.35}
        clearcoat={1}
      />
    </mesh>
  );
}

export default function StoryObjects({ scroll, reduceMotion }) {
  const group = useRef();
  const whyObjects = useRef([]);
  const processNodes = useRef([]);
  const endCore = useRef();
  const processPulse = useRef();

  useFrame((state, delta) => {
    const data = scroll.current;
    const phase = data.phase ?? 0;
    const whyIn =
      THREE.MathUtils.smoothstep(phase, 7.4, 7.9) *
      (1 - THREE.MathUtils.smoothstep(phase, 8.65, 9.05));
    const processIn =
      THREE.MathUtils.smoothstep(phase, 6.55, 6.95) *
      (1 - THREE.MathUtils.smoothstep(phase, 7.5, 7.92));
    const ctaIn = THREE.MathUtils.smoothstep(phase, 9.15, 9.85);
    const mobile = state.size.width < 680;

    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      mobile ? 0 : -0.05,
      1.5,
      delta
    );

    whyObjects.current.forEach((object, index) => {
      if (!object) return;
      const item = attributes[index];
      object.position.x = item.x * (mobile ? 0.68 : 1) + data.pointerX * 0.045;
      const time = reduceMotion ? 0 : state.clock.elapsedTime;
      object.position.y = item.y + Math.sin(time * 0.5 + index) * 0.11 + data.pointerY * 0.035;
      if (!reduceMotion) {
        object.rotation.x += delta * (0.07 + index * 0.015);
        object.rotation.y += delta * (0.1 + index * 0.017);
      }
      object.scale.setScalar(
        THREE.MathUtils.damp(
          object.scale.x,
          Math.max(0.001, whyIn * (mobile ? 0.82 : 1)),
          2,
          delta
        )
      );
    });

    processNodes.current.forEach((node, index) => {
      if (!node) return;
      node.position.x = steps[index][0] * (mobile ? 0.67 : 1);
      const time = reduceMotion ? 0 : state.clock.elapsedTime;
      node.position.y = Math.sin(time * 0.45 + index * 0.6) * 0.06;
      node.position.z = steps[index][2];
      const activeNode = Math.round(THREE.MathUtils.clamp((phase - 6.55) * 3.2, 0, 3));
      const glow = processIn * (index <= activeNode ? 1 : 0.56);
      node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, Math.max(0.001, glow), 2.2, delta));
    });

    if (processPulse.current) {
      const time = reduceMotion ? 0 : state.clock.elapsedTime;
      const progress = ((time * 0.22) % 1) * 3;
      const segment = Math.min(2, Math.floor(progress));
      const amount = progress - segment;
      processPulse.current.position.x =
        THREE.MathUtils.lerp(steps[segment][0], steps[segment + 1][0], amount) *
        (mobile ? 0.67 : 1);
      processPulse.current.position.y = Math.sin(time * 0.45 + segment * 0.6) * 0.06;
      processPulse.current.position.z =
        THREE.MathUtils.lerp(steps[segment][2], steps[segment + 1][2], amount) + 0.15;
      processPulse.current.scale.setScalar(Math.max(0.001, processIn));
    }

    if (endCore.current) {
      endCore.current.scale.setScalar(
        THREE.MathUtils.damp(
          endCore.current.scale.x,
          Math.max(0.001, ctaIn * (mobile ? 0.75 : 1)),
          1.6,
          delta
        )
      );
      if (!reduceMotion) {
        endCore.current.rotation.y += delta * 0.16;
        endCore.current.rotation.x += delta * 0.08;
      }
    }
  });

  return (
    <group ref={group}>
      {/* 1. Attributes & Why Objects */}
      {attributes.map((item, index) => (
        <group
          key={item.shape}
          ref={(node) => {
            whyObjects.current[index] = node;
          }}
          position={[item.x, item.y, 0.1]}
          scale={0.001}
        >
          <Shape shape={item.shape} color={item.color} />
          <mesh scale={1.5}>
            <torusGeometry args={[0.38, 0.003, 6, 48]} />
            <meshBasicMaterial color={item.color} transparent opacity={0.6} />
          </mesh>
          <pointLight color={item.color} intensity={0.6} distance={1.8} />
        </group>
      ))}

      {/* 2. Process Nodes & Floating Pulse Path */}
      <group position={[0, -0.1, 0.4]}>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(steps.flatMap(([x, y, z]) => [x, y, z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00f0ff" transparent opacity={0.5} />
        </line>

        {steps.map((position, index) => (
          <group
            key={index}
            ref={(node) => {
              processNodes.current[index] = node;
            }}
            position={position}
            scale={0.001}
          >
            <mesh>
              <icosahedronGeometry args={[0.19, 1]} />
              <meshPhysicalMaterial
                color="#0b0f19"
                metalness={0.7}
                roughness={0.2}
                emissive={index % 2 ? '#7000ff' : '#00f0ff'}
                emissiveIntensity={0.6}
              />
            </mesh>
            <mesh scale={1.6}>
              <sphereGeometry args={[0.19, 16, 16]} />
              <meshBasicMaterial
                color={index % 2 ? '#7000ff' : '#00f0ff'}
                wireframe
                transparent
                opacity={0.35}
              />
            </mesh>
            <pointLight color="#00f0ff" intensity={1} distance={1.4} />
          </group>
        ))}

        <mesh
          ref={processPulse}
          position={[steps[0][0], steps[0][1], steps[0][2] + 0.15]}
          scale={0.001}
        >
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
          <pointLight color="#00f0ff" intensity={1.2} distance={1.2} />
        </mesh>
      </group>

      {/* 3. CTA Core Nucleus */}
      <group ref={endCore} position={[0.9, 0.1, -0.25]} scale={0.001}>
        <mesh>
          <icosahedronGeometry args={[1.15, 2]} />
          <meshPhysicalMaterial
            color="#0b0f19"
            metalness={0.8}
            roughness={0.15}
            clearcoat={1}
            emissive="#00f0ff"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh scale={1.12}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshBasicMaterial color="#7000ff" wireframe transparent opacity={0.3} />
        </mesh>
        {[0, 1, 2].map((index) => (
          <mesh
            key={index}
            rotation={[0.4 + index * 0.55, 0.3 + index * 0.35, index * 0.42]}
          >
            <torusGeometry args={[1.45 + index * 0.2, 0.007, 8, 96]} />
            <meshBasicMaterial
              color={index === 1 ? '#7000ff' : '#00f0ff'}
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}
        <pointLight color="#00f0ff" intensity={3.5} distance={5.2} />
      </group>
    </group>
  );
}