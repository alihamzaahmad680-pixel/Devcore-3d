import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ApplicationWindows() {
  const barsRef = useRef([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    barsRef.current.forEach((bar, idx) => {
      if (bar) {
        bar.scale.y = Math.sin(time * 2 + idx) * 0.2 + 0.8;
      }
    });
  });

  return (
    <group>
      {/* Outer Holographic Window Frame */}
      <mesh position={[0.08, 0, -0.2]} rotation={[0.03, 0.1, -0.04]}>
        <boxGeometry args={[2.7, 1.88, 0.1]} />
        <meshPhysicalMaterial
          color="#05070c"
          metalness={0.4}
          roughness={0.15}
          transparent
          opacity={0.88}
          clearcoat={1}
          emissive="#7000ff"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Screen Face */}
      <mesh position={[0.08, 0, -0.13]}>
        <planeGeometry args={[2.55, 1.7]} />
        <meshBasicMaterial color="#0b0f19" />
      </mesh>

      {/* Top Window Header */}
      <mesh position={[0.08, 0.69, -0.105]}>
        <boxGeometry args={[2.55, 0.17, 0.014]} />
        <meshBasicMaterial color="#121824" />
      </mesh>

      {/* Window Controls (Red/Yellow/Green Nodes) */}
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[-0.83 + index * 0.14, 0.69, -0.09]}>
          <circleGeometry args={[0.026, 12]} />
          <meshBasicMaterial color={['#00f0ff', '#7000ff', '#303545'][index]} />
        </mesh>
      ))}

      {/* Content Mock Panels */}
      <mesh position={[-0.68, 0.24, -0.09]}>
        <boxGeometry args={[0.88, 0.36, 0.03]} />
        <meshBasicMaterial color="#182030" />
      </mesh>
      <mesh position={[0.51, 0.24, -0.09]}>
        <boxGeometry args={[1.1, 0.36, 0.03]} />
        <meshBasicMaterial color="#182030" />
      </mesh>

      {/* Dynamic Visualizer Data Columns */}
      {[0, 1, 2, 3].map((index) => (
        <mesh
          key={index}
          ref={(el) => (barsRef.current[index] = el)}
          position={[-0.72 + index * 0.44, -0.37, -0.07]}
        >
          <boxGeometry args={[0.36, 0.48 + (index % 2) * 0.24, 0.04]} />
          <meshStandardMaterial
            color={index === 3 ? '#7000ff' : '#00f0ff'}
            emissive={index === 3 ? '#7000ff' : '#00f0ff'}
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Outer Halo Ring */}
      <mesh position={[0, 0, 0.06]}>
        <torusGeometry args={[1.68, 0.006, 8, 88]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function PointOfSale() {
  return (
    <group>
      {/* Terminal Main Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.45, 1.72, 0.17]} />
        <meshPhysicalMaterial
          color="#0b0f19"
          metalness={0.8}
          roughness={0.2}
          clearcoat={0.9}
        />
      </mesh>

      {/* Display Screen */}
      <mesh position={[0, 0, 0.095]}>
        <planeGeometry args={[2.27, 1.53]} />
        <meshBasicMaterial color="#05070c" />
      </mesh>

      {/* Top Status Bar */}
      <mesh position={[-0.48, 0.45, 0.12]}>
        <boxGeometry args={[1.1, 0.04, 0.015]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Sales Analytics Columns */}
      {[0, 1, 2, 3, 4].map((index) => (
        <mesh key={index} position={[-0.82 + index * 0.33, -0.08, 0.12]}>
          <boxGeometry args={[0.25, 0.27 + (index % 2) * 0.12, 0.025]} />
          <meshStandardMaterial
            color={index === 2 ? '#7000ff' : '#00f0ff'}
            emissive={index === 2 ? '#7000ff' : '#00f0ff'}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      {/* Terminal Stand Hardware */}
      <mesh position={[0, -1.02, -0.03]}>
        <boxGeometry args={[0.52, 0.39, 0.13]} />
        <meshStandardMaterial color="#121824" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.23, 0.04]}>
        <boxGeometry args={[1.32, 0.08, 0.46]} />
        <meshStandardMaterial color="#121824" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Peripheral Card Reader */}
      <mesh position={[1.25, -0.93, 0.3]} rotation={[0, -0.1, -0.1]}>
        <boxGeometry args={[0.5, 0.72, 0.055]} />
        <meshStandardMaterial color="#121824" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1.25, -0.93, 0.333]}>
        <planeGeometry args={[0.4, 0.59]} />
        <meshBasicMaterial color="#05070c" />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[1.25, -0.76 - index * 0.13, 0.347]}>
          <circleGeometry args={[0.024, 10]} />
          <meshBasicMaterial color={index === 1 ? '#7000ff' : '#00f0ff'} />
        </mesh>
      ))}
    </group>
  );
}

function AutomationNetwork() {
  const nodes = [
    [-1.3, 0.72, 0],
    [0, 1.25, -0.2],
    [1.28, 0.62, 0],
    [-0.8, -0.82, -0.1],
    [0.75, -0.98, -0.2],
    [0, 0, 0.4],
  ];
  const links = [
    [0, 1],
    [1, 2],
    [0, 3],
    [2, 4],
    [3, 5],
    [4, 5],
    [1, 5],
    [2, 5],
  ];

  const nodesRef = useRef([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    nodesRef.current.forEach((node, idx) => {
      if (node) {
        node.rotation.x = time * 0.5 + idx;
        node.rotation.y = time * 0.3 + idx;
      }
    });
  });

  return (
    <group>
      {/* Network Edge Lines */}
      {links.map(([from, to], index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([...nodes[from], ...nodes[to]]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={index % 2 === 0 ? '#00f0ff' : '#7000ff'}
            transparent
            opacity={0.6}
          />
        </line>
      ))}

      {/* Network Nodes */}
      {nodes.map((position, index) => (
        <mesh
          key={index}
          ref={(el) => (nodesRef.current[index] = el)}
          position={position}
        >
          <icosahedronGeometry args={[index === 5 ? 0.29 : 0.18, 1]} />
          <meshPhysicalMaterial
            color={index % 2 === 0 ? '#00f0ff' : '#7000ff'}
            metalness={0.5}
            roughness={0.2}
            emissive={index % 2 === 0 ? '#00f0ff' : '#7000ff'}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

const artifacts = [ApplicationWindows, PointOfSale, AutomationNetwork];

export default function ServiceObjects({ scroll, reduceMotion }) {
  const group = useRef();
  const activeIndex = useRef(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    const setActive = (event) => {
      activeIndex.current = event.detail;
    };
    window.addEventListener('devcore:service-active', setActive);
    return () => window.removeEventListener('devcore:service-active', setActive);
  }, []);

  useFrame((state, delta) => {
    const phase = scroll.current.phase ?? 0;
    const inServices =
      THREE.MathUtils.smoothstep(phase, 2.65, 3.05) *
      (1 - THREE.MathUtils.smoothstep(phase, 4.35, 4.75));

    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, 0.72, 1.6, delta);
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      -0.02 + scroll.current.pointerY * 0.08,
      1.6,
      delta
    );
    group.current.scale.setScalar(
      THREE.MathUtils.damp(group.current.scale.x, Math.max(0.001, inServices), 2, delta)
    );

    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const active = index === activeIndex.current;
      const desired = active ? 1 : 0.001;
      item.scale.setScalar(THREE.MathUtils.damp(item.scale.x, desired, active ? 2.3 : 3, delta));
      item.rotation.y = THREE.MathUtils.damp(
        item.rotation.y,
        active ? scroll.current.pointerX * 0.07 - 0.12 : item.rotation.y,
        1.7,
        delta
      );
      const time = reduceMotion ? 0 : state.clock.elapsedTime;
      item.position.y = THREE.MathUtils.damp(
        item.position.y,
        Math.sin(time * 0.48) * 0.08,
        1.2,
        delta
      );
    });
  });

  return (
    <group ref={group}>
      {artifacts.map((Artifact, index) => (
        <group
          key={index}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          scale={index === 0 ? 1 : 0.001}
        >
          <Artifact />
        </group>
      ))}
    </group>
  );
}