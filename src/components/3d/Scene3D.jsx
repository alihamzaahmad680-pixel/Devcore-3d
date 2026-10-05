import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import IglooModel from './IglooModel';

gsap.registerPlugin(ScrollTrigger);

const Effects = lazy(() => import('./Effects'));
const MODEL_URL = import.meta.env.VITE_IGLOO_MODEL_URL;

function ScrollRig({ motionState }) {
  const { camera, size } = useThree();
  const reducedMotion = useReducedMotion();
  const rig = useRef();
  const pointerField = useRef();
  const character = useRef();
  const characterMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#eafcff',
      emissive: '#00c8d8',
      emissiveIntensity: 0.55,
      metalness: 0.5,
      roughness: 0.28,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
    [],
  );

  useEffect(() => {
    const state = motionState.current;
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#story',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .to(state, {
        fracture: 1,
        cameraZ: 3.1,
        cameraY: 0.25,
        fov: 31,
        rotationX: 0.55,
        coreScale: 1.55,
        duration: 1,
        ease: 'none',
      })
      .to(state, {
        ring: 1,
        cameraZ: 5.3,
        cameraY: 2.2,
        cameraX: -0.35,
        fov: 35,
        rotationX: -0.22,
        rotationY: Math.PI * 1.2,
        duration: 1,
        ease: 'none',
      })
      .to(state, {
        character: 1,
        cameraX: 2.5,
        cameraY: 2.55,
        cameraZ: 5.4,
        fov: 38,
        rotationX: 0.08,
        rotationY: Math.PI * 2,
        duration: 1,
        ease: 'none',
      });

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, [motionState]);

  useFrame((frame, delta) => {
    const state = motionState.current;
    const isMobile = size.width < 768;
    const damping = reducedMotion ? 20 : 4;
    const targetX = reducedMotion ? 0 : frame.pointer.x;
    const targetY = reducedMotion ? 0 : frame.pointer.y;

    if (rig.current) {
      rig.current.scale.setScalar(isMobile ? 0.76 : 1);
      rig.current.rotation.x = state.rotationX;
      rig.current.rotation.y = state.rotationY + (reducedMotion ? 0 : frame.clock.elapsedTime * 0.11);
      rig.current.position.y = (isMobile ? 0.82 : 0)
        + (reducedMotion ? 0 : Math.sin(frame.clock.elapsedTime * 0.7) * 0.06);
    }

    if (pointerField.current) {
      pointerField.current.position.x = THREE.MathUtils.damp(
        pointerField.current.position.x,
        targetX * 0.9,
        damping,
        delta,
      );
      pointerField.current.position.y = THREE.MathUtils.damp(
        pointerField.current.position.y,
        targetY * 0.65,
        damping,
        delta,
      );
    }

    if (character.current) {
      character.current.scale.setScalar(THREE.MathUtils.damp(
        character.current.scale.x,
        state.character,
        5,
        delta,
      ));
      characterMaterial.opacity = state.character;
    }

    camera.position.set(
      isMobile ? state.cameraX * 0.58 : state.cameraX,
      state.cameraY,
      state.cameraZ * (isMobile ? 1.12 : 1),
    );
    camera.fov = isMobile ? Math.max(state.fov, 48) : state.fov;
    camera.lookAt(isMobile ? state.cameraX * 0.06 : state.cameraX * 0.12, 0.15, 0);
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <Suspense fallback={null}>
        <Effects />
      </Suspense>
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        position={[-4, 7, 5]}
        intensity={3.2}
        color="#ffffff"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[4, 1, -4]} intensity={2.6} color="#00ffff" />
      <pointLight position={[0, 2, 3]} intensity={22} distance={12} color="#00ffff" />
      <pointLight position={[-4, -2, -2]} intensity={18} distance={10} color="#7777ff" />

      <group ref={rig}>
        <Float
          speed={reducedMotion ? 0 : 1.2}
          rotationIntensity={reducedMotion ? 0 : 0.08}
          floatIntensity={reducedMotion ? 0 : 0.12}
        >
          <Suspense fallback={<IglooModel modelUrl={null} motion={motionState.current} />}>
            <IglooModel modelUrl={MODEL_URL} motion={motionState.current} />
          </Suspense>
        </Float>

        <group ref={character} position={[2.05, -0.25, 0]}>
          <mesh position={[0, -0.25, 0]} material={characterMaterial}>
            <capsuleGeometry args={[0.32, 0.8, 6, 12]} />
          </mesh>
          <mesh position={[0, 0.55, 0]} material={characterMaterial}>
            <sphereGeometry args={[0.25, 24, 24]} />
          </mesh>
          <mesh position={[0, -0.87, 0]} material={characterMaterial}>
            <cylinderGeometry args={[0.66, 0.82, 0.16, 48]} />
            <meshStandardMaterial
              color="#061216"
              emissive="#00d9e8"
              emissiveIntensity={2.2}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>

      <group ref={pointerField}>
        <Sparkles
          count={95}
          scale={[13, 9, 8]}
          size={2.2}
          speed={0.18}
          opacity={0.62}
          color="#9ffaff"
        />
      </group>

    </>
  );
}

export default function Scene3D() {
  const motionState = useRef({
    fracture: 0,
    ring: 0,
    character: 0,
    cameraX: 0,
    cameraY: 0,
    cameraZ: 6.2,
    fov: 39,
    rotationX: 0,
    rotationY: 0,
    coreScale: 1,
  });

  return (
    <div className="scene3d-canvas" aria-hidden="true">
      <Canvas
        shadows="basic"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.2], fov: 39, near: 0.1, far: 80 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        eventSource={typeof document === 'undefined' ? undefined : document.body}
        eventPrefix="client"
      >
        <ScrollRig motionState={motionState} />
      </Canvas>
    </div>
  );
}
