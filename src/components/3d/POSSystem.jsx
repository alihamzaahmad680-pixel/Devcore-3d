import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const bars = [0.2, 0.32, 0.25, 0.48, 0.38, 0.7, 0.53, 0.82, 0.64, 0.91, 0.73, 1];

function BarChart() {
  const barsRef = useRef([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    barsRef.current.forEach((bar, idx) => {
      if (bar) {
        const pulse = Math.sin(time * 2 + idx * 0.5) * 0.15 + 0.85;
        bar.scale.y = pulse;
      }
    });
  });

  return (
    <group position={[-0.93, -0.49, 0.17]}>
      {bars.map((height, index) => (
        <mesh
          key={index}
          ref={(el) => (barsRef.current[index] = el)}
          position={[index * 0.153, height * 0.37 - 0.2, 0]}
        >
          <boxGeometry args={[0.075, height * 0.74, 0.022]} />
          <meshStandardMaterial
            color={index > 8 ? '#00f0ff' : '#7000ff'}
            emissive={index > 8 ? '#00f0ff' : '#7000ff'}
            emissiveIntensity={index > 8 ? 0.8 : 0.3}
            roughness={0.2}
          />
        </mesh>
      ))}
      <mesh position={[0.83, 0.37, -0.012]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
    </group>
  );
}

function ScreenInterface() {
  return (
    <group>
      <mesh position={[0, 0, 0.14]}>
        <planeGeometry args={[3.08, 2.02]} />
        <meshBasicMaterial color="#05070c" />
      </mesh>
      <mesh position={[-1.36, 0.89, 0.16]}>
        <boxGeometry args={[0.045, 0.14, 0.015]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh position={[-1.17, 0.89, 0.16]}>
        <boxGeometry args={[0.35, 0.035, 0.015]} />
        <meshBasicMaterial color="#a0a5b5" />
      </mesh>
      <mesh position={[0.95, 0.89, 0.16]}>
        <circleGeometry args={[0.027, 16]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh position={[-0.95, 0.57, 0.16]}>
        <boxGeometry args={[0.77, 0.035, 0.015]} />
        <meshBasicMaterial color="#303545" />
      </mesh>
      <mesh position={[-0.95, 0.38, 0.16]}>
        <boxGeometry args={[0.49, 0.11, 0.02]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.95, 0.12, 0.16]}>
        <boxGeometry args={[0.73, 0.025, 0.015]} />
        <meshBasicMaterial color="#505565" />
      </mesh>
      <mesh position={[0.53, 0.35, 0.16]}>
        <boxGeometry args={[1.02, 0.66, 0.025]} />
        <meshBasicMaterial color="#0a0e17" />
      </mesh>
      <mesh position={[0.53, 0.56, 0.18]}>
        <boxGeometry args={[0.51, 0.024, 0.012]} />
        <meshBasicMaterial color="#7000ff" />
      </mesh>
      <BarChart />
      <mesh position={[-0.96, -0.74, 0.16]}>
        <boxGeometry args={[0.74, 0.28, 0.025]} />
        <meshBasicMaterial color="#0e1320" />
      </mesh>
      <mesh position={[-0.96, -0.71, 0.18]}>
        <boxGeometry args={[0.37, 0.025, 0.012]} />
        <meshBasicMaterial color="#505565" />
      </mesh>
      <mesh position={[-0.96, -0.79, 0.18]}>
        <boxGeometry args={[0.49, 0.025, 0.012]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh position={[-0.12, -0.74, 0.16]}>
        <boxGeometry args={[0.74, 0.28, 0.025]} />
        <meshBasicMaterial color="#0e1320" />
      </mesh>
      <mesh position={[-0.12, -0.71, 0.18]}>
        <boxGeometry args={[0.33, 0.025, 0.012]} />
        <meshBasicMaterial color="#505565" />
      </mesh>
      <mesh position={[-0.12, -0.79, 0.18]}>
        <boxGeometry args={[0.45, 0.025, 0.012]} />
        <meshBasicMaterial color="#7000ff" />
      </mesh>
      <mesh position={[0.71, -0.74, 0.16]}>
        <boxGeometry args={[0.74, 0.28, 0.025]} />
        <meshBasicMaterial color="#0e1320" />
      </mesh>
      <mesh position={[0.71, -0.71, 0.18]}>
        <boxGeometry args={[0.36, 0.025, 0.012]} />
        <meshBasicMaterial color="#505565" />
      </mesh>
      <mesh position={[0.71, -0.79, 0.18]}>
        <boxGeometry args={[0.47, 0.025, 0.012]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
    </group>
  );
}

export default function POSSystem({ size, scroll }) {
  const group = useRef();

  const activate = (event) => {
    if (event.nativeEvent.target.closest('a, button, input, textarea')) return;
    event.stopPropagation();
    window.dispatchEvent(new CustomEvent('devcore:focus-object', { detail: 'pos' }));
  };

  const setPointerState = (event, hovering) => {
    if (event.nativeEvent.target.closest('a, button, input, textarea')) return;
    event.stopPropagation();
    document.body.classList.toggle('cursor-halo--active', hovering);
  };

  useFrame((state, delta) => {
    const mobile = size.width < 680;
    const pointer = scroll.current;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, mobile ? 0 : 1.75 + pointer.pointerX * 0.1, 2, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, mobile ? -1.15 : -0.08 + pointer.pointerY * 0.06, 2, delta);
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, mobile ? 0.72 : 0.96, 2, delta));
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -0.14 + pointer.pointerX * 0.055, 2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.pointerY * 0.035, 2, delta);
  });

  return (
    <group ref={group}>
      {/* Outer Shell Frame */}
      <mesh
        position={[0, 0, -0.02]}
        onClick={activate}
        onPointerOver={(event) => setPointerState(event, true)}
        onPointerOut={(event) => setPointerState(event, false)}
      >
        <boxGeometry args={[3.42, 2.38, 0.16]} />
        <meshPhysicalMaterial
          color="#0b0f19"
          metalness={0.8}
          roughness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Screen Glass Bezel */}
      <mesh position={[0, 0, 0.065]}>
        <boxGeometry args={[3.25, 2.2, 0.02]} />
        <meshPhysicalMaterial
          color="#05070c"
          metalness={0.3}
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>

      <ScreenInterface />

      {/* Stand Base Hardware */}
      <mesh position={[0, -1.31, -0.03]}>
        <boxGeometry args={[0.66, 0.48, 0.15]} />
        <meshStandardMaterial color="#121824" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.56, 0.02]}>
        <boxGeometry args={[1.35, 0.1, 0.55]} />
        <meshStandardMaterial color="#0e1320" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Interactive HTML UI Overlay */}
      <Html transform position={[0, 0, 0.17]} distanceFactor={5.4} style={{ pointerEvents: 'none' }}>
        <div className="pos-screen-ui p-4 bg-[#05070c]/90 text-white rounded-lg border border-[#00f0ff]/30 shadow-2xl font-mono text-xs w-[320px]">
          <div className="pos-ui-heading flex justify-between items-center pb-2 border-b border-white/10 text-[#00f0ff]">
            <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" /> DEVCORE POS</span>
            <span className="text-[10px] text-gray-400">ALL STORES ⌄</span>
          </div>
          <div className="pos-ui-summary my-3">
            <small className="text-gray-400 text-[10px] block">TODAY'S SALES</small>
            <strong className="text-xl font-bold text-white">$24,680<span className="text-sm text-[#00f0ff]">.50</span></strong>
            <em className="text-[10px] text-emerald-400 not-italic block mt-0.5">↗ 12.8% vs last week</em>
          </div>
          <div className="pos-ui-metrics grid grid-cols-3 gap-2 py-2 border-t border-b border-white/10 text-center">
            <div><small className="text-gray-400 text-[9px] block">ORDERS</small><b className="text-white text-xs">384</b></div>
            <div><small className="text-gray-400 text-[9px] block">PRODUCTS</small><b className="text-white text-xs">1,248</b></div>
            <div><small className="text-gray-400 text-[9px] block">IN STOCK</small><b className="text-[#00f0ff] text-xs">96.4%</b></div>
          </div>
          <div className="pos-ui-footer flex justify-between items-center pt-2 text-[9px] text-gray-400">
            <span className="flex items-center gap-1"><i className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> LIVE SYNC</span>
            <span>MON — SUN</span>
          </div>
        </div>
      </Html>

      {/* Peripheral Payment Reader */}
      <mesh position={[1.28, -1.29, 0.27]} rotation={[-0.12, -0.14, -0.05]}>
        <boxGeometry args={[0.65, 0.82, 0.055]} />
        <meshStandardMaterial color="#121824" metalness={0.75} roughness={0.3} />
      </mesh>
      <mesh position={[1.28, -1.29, 0.302]}>
        <planeGeometry args={[0.53, 0.68]} />
        <meshBasicMaterial color="#05070c" />
      </mesh>
      <mesh position={[1.28, -1.1, 0.318]}>
        <boxGeometry args={[0.31, 0.045, 0.012]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((column) => (
          <mesh key={`${row}-${column}`} position={[1.16 + column * 0.12, -1.27 - row * 0.12, 0.318]}>
            <circleGeometry args={[0.022, 10]} />
            <meshBasicMaterial color={row === 2 && column === 2 ? '#7000ff' : '#404555'} />
          </mesh>
        ))
      )}

      {/* Back Glow Light Envelope */}
      <mesh position={[0, 0, -0.135]}>
        <boxGeometry args={[3.54, 2.48, 0.025]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}