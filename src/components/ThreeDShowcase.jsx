import { ArrowUpRight, Check, CircleDot } from 'lucide-react';
import Reveal from './Reveal';

const SYSTEM_FEATURES = ['Sales', 'Inventory', 'Analytics'];

export default function ThreeDShowcase() {
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="showcase section-pad" id="showcase" aria-label="3D System Showcase">
      <div className="page-shell">
        <div className="showcase-top">
          {/* Left Content Column */}
          <Reveal className="showcase-copy">
            <span className="section-index" aria-label="Section index 03">
              03 / MADE TO WORK TOGETHER
            </span>
            <h2>
              One system.<br />
              <span>A clearer picture.</span>
            </h2>
            <p>
              One connected view of sales, inventory and the everyday details
              behind your business.
            </p>

            <ul className="showcase-feature-list">
              {SYSTEM_FEATURES.map((feature) => (
                <li key={feature}>
                  <Check size={15} aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              className="text-link"
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, '#contact')}
            >
              Explore what&apos;s possible <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </Reveal>

          {/* Right Visual / 3D Canvas Stage */}
          <div className="showcase-visual">
            <div className="showcase-visual-bg" aria-hidden="true" />
            
            <div className="showcase-orbit-label showcase-orbit-label--one" aria-hidden="true">
              <CircleDot size={13} />
              <span>LIVE BUSINESS SYSTEM</span>
            </div>
            
            <div className="showcase-orbit-label showcase-orbit-label--two" aria-hidden="true">
              DEVCORE / SYSTEM 01
            </div>
          </div>
        </div>

        {/* Bottom Caption Bar */}
        <Reveal className="showcase-caption">
          <span>CONNECTED BY DESIGN</span>
          <span>
            Web applications <i aria-hidden="true" /> Point of sale <i aria-hidden="true" /> Business operations
          </span>
        </Reveal>
      </div>
    </section>
  );
}