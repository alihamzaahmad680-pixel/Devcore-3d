import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Clone, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function LoadedModel({ modelUrl, ...props }) {
  const { scene } = useGLTF(modelUrl);
  return <Clone object={scene} {...props} />;
}

function ProceduralIgloo({ motion, ...props }) {
  const pieces = useRef([]);
  const core = useRef();
  const blocks = useMemo(() => {
    const result = [];
    const levels = 5;
    const blocksPerLevel = 12;

    for (let level = 0; level < levels; level += 1) {
      const y = -0.2 + level * 0.34;
      const radius = 1.28 - level * 0.16;

      for (let index = 0; index < blocksPerLevel; index += 1) {
        const angle = (index / blocksPerLevel) * Math.PI * 2 + (level % 2) * 0.13;
        const position = new THREE.Vector3(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius,
        );
        const fracture = position.clone().multiplyScalar(2.15).add(
          new THREE.Vector3(
            Math.sin(index * 9.2 + level) * 0.5,
            Math.cos(index * 3.7 + level) * 0.46,
            Math.cos(index * 6.1 - level) * 0.5,
          ),
        );
        const ringAngle = (result.length / (levels * blocksPerLevel)) * Math.PI * 2;
        const ring = new THREE.Vector3(
          Math.cos(ringAngle) * 2.1,
          Math.sin(ringAngle * 3) * 0.42,
          Math.sin(ringAngle) * 2.1,
        );

        result.push({
          angle,
          position,
          fracture,
          ring,
          size: [0.48, 0.3, 0.2],
        });
      }
    }

    return result;
  }, []);

  useFrame((frame, delta) => {
    const fractureMix = THREE.MathUtils.clamp(motion.fracture, 0, 1);
    const ringMix = THREE.MathUtils.clamp(motion.ring, 0, 1);

    blocks.forEach((block, index) => {
      const mesh = pieces.current[index];
      if (!mesh) return;

      const fractured = block.position.clone().lerp(block.fracture, fractureMix);
      mesh.position.copy(fractured.lerp(block.ring, ringMix));
      mesh.rotation.y = block.angle + ringMix * Math.PI * 0.8;
      mesh.rotation.x = ringMix * Math.sin(block.angle) * 0.35;
    });

    if (core.current) {
      const scale = motion.coreScale + Math.sin(frame.clock.elapsedTime * 1.7) * 0.035;
      core.current.scale.setScalar(scale);
      core.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group {...props}>
      {blocks.map((block, index) => (
        <mesh
          key={index}
          ref={(node) => { pieces.current[index] = node; }}
          position={block.position}
          rotation={[0, block.angle, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={block.size} />
          <meshStandardMaterial
            color={index % 4 === 0 ? '#b9ffff' : '#64dce5'}
            emissive="#087985"
            emissiveIntensity={0.45}
            metalness={0.72}
            roughness={0.24}
          />
        </mesh>
      ))}
      <mesh ref={core} position={[0, 0.35, 0]}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00deef"
          emissiveIntensity={2.4}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

export default function IglooModel({
  modelUrl,
  motion,
  ...props
}) {
  if (modelUrl) {
    return <LoadedModel modelUrl={modelUrl} {...props} />;
  }

  return <ProceduralIgloo motion={motion} {...props} />;
}

IglooModel.preload = (modelUrl) => {
  if (!modelUrl) return;
  useGLTF.preload(modelUrl);
};
