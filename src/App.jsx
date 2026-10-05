import { lazy, Suspense } from 'react';
import SmoothScroll from './components/SmoothScroll';
import ContentSections from './components/ui/ContentSections';
import HUDOverlay from './components/ui/HUDOverlay';

const Scene3D = lazy(() => import('./components/3d/Scene3D'));

export default function App() {
  return (
    <>
      <SmoothScroll />
      <Suspense fallback={<div className="scene3d-canvas scene3d-fallback" aria-hidden="true" />}>
        <Scene3D />
      </Suspense>
      <ContentSections />
      <HUDOverlay />
    </>
  );
}
