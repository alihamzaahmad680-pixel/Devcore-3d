import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Noise,
} from '@react-three/postprocessing';
import * as THREE from 'three';

export default function Effects() {
  return (
    <>
      <color attach="background" args={['#05070c']} />
      <fog attach="fog" args={['#05070c', 10, 36]} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.5} luminanceThreshold={0.8} mipmapBlur />
        <DepthOfField focusDistance={0.018} focalLength={0.025} bokehScale={1.25} height={480} />
        <ChromaticAberration offset={new THREE.Vector2(0.00045, 0.00075)} />
        <Noise opacity={0.025} />
      </EffectComposer>
    </>
  );
}
