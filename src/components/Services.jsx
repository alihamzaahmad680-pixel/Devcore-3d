import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';
import services from '../data/services';

export default function Services() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const tabListRef = useRef(null);

  const service = services[active] || services[0];
  const Visual = service?.visual || ArrowRight;
  const Icon = service?.icon || ArrowRight;

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('devcore:service-active', { detail: active })
    );
  }, [active]);

  // Handle ARIA keyboard navigation across tabs
  const handleKeyDown = (e, index) => {
    let nextIndex = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (index + 1) % services.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (index - 1 + services.length) % services.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = services.length - 1;
    }

    if (nextIndex !== null) {
      setActive(nextIndex);
      const targetTab = tabListRef.current?.querySelector(
        `[id="service-tab-${nextIndex}"]`
      );
      targetTab?.focus();
    }
  };

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className={`services section-pad accent-${service?.accent || 'default'}`}
      id="services"
      aria-label="Services offered by Devcore"
    >
      <div className="page-shell">
        <Reveal className="section-heading services-heading">
          <div>
            <span className="section-index" aria-label="Section index 02">
              02 / WHAT WE DO
            </span>
            <h2>
              Solutions built around<br />
              <span>your business.</span>
            </h2>
          </div>
          <p>
            Purpose-built digital tools.<br />
            Nothing off the shelf.
          </p>
        </Reveal>

        <div className="services-layout" id="solutions">
          {/* Tab Navigation List */}
          <div
            ref={tabListRef}
            className="service-list"
            role="tablist"
            aria-label="Devcore services"
          >
            {services.map((item, index) => {
              const ItemIcon = item.icon;
              const isActive = active === index;

              return (
                <button
                  key={item.number || index}
                  id={`service-tab-${index}`}
                  className={`service-row${isActive ? ' service-row--active' : ''}`}
                  type="button"
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  aria-selected={isActive}
                  aria-controls="service-detail"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => setActive(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  <span className="service-number">{item.number}</span>
                  <span className="service-row-content">
                    <span className="service-title">{item.title}</span>
                    <span className="service-description">
                      {item.description}
                    </span>
                  </span>
                  <span className="service-icon" aria-hidden="true">
                    <ItemIcon size={19} strokeWidth={1.5} />
                  </span>
                  <ArrowRight className="service-arrow" size={17} aria-hidden="true" />
                </button>
              );
            })}
          </div>

          {/* Tab Panel / Detailed Feature Preview */}
          <div
            id="service-detail"
            className="service-feature"
            role="tabpanel"
            aria-labelledby={`service-tab-${active}`}
          >
            <div className="service-feature-top">
              <span className="service-feature-tag">
                <span className="eyebrow-dot" aria-hidden="true" /> {service.tag}
              </span>
              <span className="service-feature-number">{service.number}</span>
            </div>

            <div className="service-art" aria-hidden="true">
              <div className="service-art-orbit service-art-orbit--outer" />
              <div className="service-art-orbit service-art-orbit--inner" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="service-art-icon"
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.7, rotate: -18 }
                  }
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, scale: 1, rotate: 0 }
                  }
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.75, rotate: 18 }
                  }
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Visual size={44} strokeWidth={1.1} />
                </motion.div>
              </AnimatePresence>
              <span className="service-art-cross service-art-cross--one">+</span>
              <span className="service-art-cross service-art-cross--two">+</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${active}-copy`}
                className="service-feature-copy"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <p>{service.detail}</p>
                <a
                  href="#contact"
                  aria-label={`Discuss ${service.title}`}
                  onClick={(e) => handleSmoothScroll(e, '#contact')}
                >
                  <ArrowRight size={18} />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}