import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const nodes = [
  [-3.2, 0.1, -0.6], [-2.6, 1.8, -0.55], [-1.4, 2.45, -0.9],
  [0.2, 2.15, -1.2], [2.2, 1.8, -0.8], [3.3, 0.7, -0.55],
  [3, -1.15, -0.8], [1.25, -2.1, -1], [-1.2, -2, -0.8], [-3, -1, -0.4],
];
const links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0], [1, 8], [2, 7], [3, 6]];

export default function ConnectionLines({ scroll, reduceMotion }) {
  const groupRef = useRef();
  const pulsesGroup = useRef();
  const linesMaterialRef = useRef([]);

  const { lineGeometries, nodeVectors } = useMemo(() => {
    const vectors = nodes.map((n) => new THREE.Vector3(...n));
    const geoms = links.map(([from, to]) => {
      const p1 = vectors[from];
      const p2 = vectors[to];
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.z += 0.2; 
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(24);
      return new THREE.BufferGeometry().setFromPoints(points);
    });
    return { lineGeometries: geoms, nodeVectors: vectors };
  }, []);

  const packets = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      linkIndex: i % links.length,
      speed: 0.4 + Math.random() * 0.5,
      offset: Math.random(),
      size: 0.04 + Math.random() * 0.03,
      color: i % 2 === 0 ? '#00f0ff' : '#7000ff'
    }));
  }, []);

  useFrame((state) => {
    const t = reduceMotion ? 0 : state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (scroll.current?.pointerX || 0) * 0.15, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (scroll.current?.pointerY || 0) * 0.1, 0.05);
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    }

    if (pulsesGroup.current) {
      pulsesGroup.current.children.forEach((mesh, idx) => {
        const pkt = packets[idx];
        const progress = (t * pkt.speed + pkt.offset) % 1;
        const [fromIdx, toIdx] = links[pkt.linkIndex];
        const p1 = nodeVectors[fromIdx];
        const p2 = nodeVectors[toIdx];

        mesh.position.x = THREE.MathUtils.lerp(p1.x, p2.x, progress);
        mesh.position.y = THREE.MathUtils.lerp(p1.y, p2.y, progress);
        mesh.position.z = THREE.MathUtils.lerp(p1.z, p2.z, progress) + Math.sin(progress * Math.PI) * 0.2;

        const pulseScale = 1 + Math.sin(progress * Math.PI * 2) * 0.3;
        mesh.scale.setScalar(pulseScale);
      });
    }
  });

  return (
    <group ref={groupRef} position={[1.15, 0, -0.3]}>
      {lineGeometries.map((geometry, index) => (
        <line key={index} geometry={geometry}>
          <lineBasicMaterial
            ref={(el) => (linesMaterialRef.current[index] = el)}
            color={index % 2 === 0 ? '#00f0ff' : '#8a2be2'}
            transparent
            opacity={index < 10 ? 0.35 : 0.2}
            linewidth={2}
          />
        </line>
      ))}

      {nodes.map((position, index) => (
        <group key={index} position={position}>
          {/* Inner Glowing Core */}
          <mesh>
            <sphereGeometry args={[index % 3 === 0 ? 0.045 : 0.03, 16, 16]} />
            <meshBasicMaterial color={index % 2 === 0 ? '#00f0ff' : '#b7a8fa'} />
          </mesh>

          {/* Outer Cyber Pulse Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.06, 0.075, 16]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? '#00f0ff' : '#7000ff'}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>

          <pointLight
            color={index % 2 === 0 ? '#00f0ff' : '#7000ff'}
            intensity={0.6}
            distance={0.8}
          />
        </group>
      ))}

      {/* Multi-Stream Traveling Energy Packets */}
      <group ref={pulsesGroup}>
        {packets.map((pkt, i) => (
          <mesh key={i}>
            <sphereGeometry args={[pkt.size, 16, 16]} />
            <meshBasicMaterial color={pkt.color} />
            <pointLight color={pkt.color} intensity={1.2} distance={1.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}