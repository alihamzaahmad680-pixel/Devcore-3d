import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const panels = [
  { position: [-2.6, 1.52, -0.7], size: [1.42, 0.98], tint: '#7000ff', angle: -0.12, kind: 0 },
  { position: [2.55, 1.62, -0.3], size: [1.25, 0.86], tint: '#00f0ff', angle: 0.12, kind: 1 },
  { position: [-2.8, -1.2, -0.15], size: [1.18, 0.78], tint: '#00f0ff', angle: 0.12, kind: 2 },
  { position: [2.72, -0.75, -0.62], size: [1.15, 0.84], tint: '#7000ff', angle: -0.15, kind: 3 },
];

function PanelContent({ width, height, tint, kind, focus }) {
  const barsRef = useRef([]);
  const columns = kind === 1 ? [0.32, 0.58, 0.43, 0.76, 0.55, 0.9] : [0.55, 0.34, 0.73, 0.46, 0.87, 0.62];

  const focusObject = (event) => {
    if (event.nativeEvent.target.closest('a, button, input, textarea')) return;
    event.stopPropagation();
    window.dispatchEvent(new CustomEvent('devcore:focus-object', { detail: focus }));
  };

  const showCursor = (event) => {
    if (event.nativeEvent.target.closest('a, button, input, textarea')) return;
    event.stopPropagation();
    document.body.classList.add('cursor-halo--active');
  };

  const resetCursor = (event) => {
    event.stopPropagation();
    document.body.classList.remove('cursor-halo--active');
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    barsRef.current.forEach((bar, idx) => {
      if (bar) {
        const scaleY = Math.sin(t * 2 + idx * 0.8) * 0.2 + 0.8;
        bar.scale.y = scaleY;
      }
    });
  });

  return (
    <group>
      {/* 1. Main Glass Panel Base */}
      <mesh
        position={[0, 0, 0]}
        onClick={focusObject}
        onPointerOver={showCursor}
        onPointerOut={resetCursor}
      >
        <boxGeometry args={[width, height, 0.055]} />
        <meshPhysicalMaterial
          color="#05070c"
          metalness={0.2}
          roughness={0.1}
          transmission={0.6}
          thickness={0.4}
          clearcoat={1}
          transparent
          opacity={0.85}
          emissive={tint}
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Outer Glowing Holographic Edge Ring */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width + 0.04, height + 0.04, 0.02]} />
        <meshBasicMaterial color={tint} transparent opacity={0.3} wireframe />
      </mesh>

      {/* 2. Top Header Bar Accent */}
      <mesh position={[-width * 0.34, height * 0.33, 0.032]}>
        <boxGeometry args={[width * 0.22, 0.035, 0.012]} />
        <meshBasicMaterial color={tint} />
      </mesh>

      {/* Top Status Indicator LED */}
      <mesh position={[width * 0.35, height * 0.33, 0.032]}>
        <circleGeometry args={[0.028, 16]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* 3. Code/Data Line Rows */}
      {[0, 1, 2].map((row) => (
        <group key={row} position={[-width * 0.28, height * 0.13 - row * height * 0.19, 0.033]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width * 0.34, 0.022, 0.01]} />
            <meshBasicMaterial color="#a0a5b5" transparent opacity={0.6} />
          </mesh>
          <mesh position={[width * 0.28, 0, 0]}>
            <boxGeometry args={[width * 0.13, 0.022, 0.01]} />
            <meshBasicMaterial color={row === 1 ? '#7000ff' : tint} />
          </mesh>
        </group>
      ))}

      {/* 4. Animated Visualizer / Graph Bars */}
      {columns.map((value, index) => (
        <mesh
          key={index}
          ref={(el) => (barsRef.current[index] = el)}
          position={[-width * 0.31 + index * width * 0.105, -height * 0.28 + (value * height * 0.12), 0.043]}
        >
          <boxGeometry args={[width * 0.055, value * height * 0.28, 0.014]} />
          <meshStandardMaterial
            color={index === 5 ? '#ffffff' : tint}
            emissive={tint}
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function FloatingPanels({ size, scroll, reduceMotion }) {
  const group = useRef();
  const panelsRef = useRef([]);

  useFrame((state, delta) => {
    const mobile = size.width < 680;
    const pointer = scroll.current;
    const time = reduceMotion ? 0 : state.clock.elapsedTime;

    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, mobile ? 0.15 : 1.75, 1.5, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, mobile ? -1.05 : 0, 1.5, delta);
    const scale = mobile ? 0.69 : 0.92;
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, scale, 1.5, delta));

    panelsRef.current.forEach((panel, index) => {
      if (!panel) return;
      panel.position.y = panels[index].position[1] + Math.sin(time * 0.58 + index * 1.8) * 0.12;
      panel.rotation.y = panels[index].angle + pointer.pointerX * 0.055;
      panel.rotation.x = Math.sin(time * 0.38 + index) * 0.025 + pointer.pointerY * 0.025;
    });
  });

  return (
    <group ref={group}>
      {panels.map((panel, index) => (
        <group
          key={panel.kind}
          ref={(node) => { panelsRef.current[index] = node; }}
          position={panel.position}
          rotation={[0, panel.angle, 0]}
        >
          <PanelContent
            width={panel.size[0]}
            height={panel.size[1]}
            tint={panel.tint}
            kind={panel.kind}
            focus={['web', 'analytics', 'database', 'pos'][panel.kind]}
          />
        </group>
      ))}
    </group>
  );
}