import { ArrowDownRight } from 'lucide-react';
import Reveal from './Reveal';

export default function Intro() {
  return (
    <section className="intro section-pad" id="intro" aria-label="About Devcore">
      <div className="page-shell intro-layout">
        <Reveal className="section-meta">
          <span className="section-index" aria-label="Section index 01">
            01 / THE DEVCORE APPROACH
          </span>
          <ArrowDownRight size={20} strokeWidth={1.4} aria-hidden="true" />
        </Reveal>

        <Reveal className="intro-main">
          <h2>
            Technology that<br className="hidden sm:inline" />
            <span>moves business forward.</span>
          </h2>
          <div className="intro-bottom">
            <p className="intro-description">
              Connected systems. Less busywork. Better ways to serve your customers and grow.
            </p>
            <div className="intro-note">
              <span className="intro-note-mark" aria-hidden="true">D.</span>
              <span>
                Thoughtful by design.<br />
                Dependable by default.
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}