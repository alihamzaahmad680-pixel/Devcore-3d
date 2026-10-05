import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import steps from '../data/process';

export default function Process() {
  return (
    <section className="process section-pad" id="process" aria-label="Our Process">
      <div className="page-shell">
        {/* Section Heading */}
        <Reveal className="section-heading process-heading">
          <div>
            <span className="section-index" aria-label="Section index 05">
              05 / HOW WE WORK
            </span>
            <h2>
              From idea<br />
              <span>to solution.</span>
            </h2>
          </div>
          <ArrowRight
            className="process-heading-arrow"
            size={23}
            strokeWidth={1.2}
            aria-hidden="true"
          />
        </Reveal>

        {/* Process Steps Ordered List */}
        <ol className="process-grid">
          {steps.map((step, index) => {
            // Support both tuple format [number, title, description] and object format { number, title, description }
            const number = Array.isArray(step) ? step[0] : step.number;
            const title = Array.isArray(step) ? step[1] : step.title;
            const description = Array.isArray(step) ? step[2] : step.description;

            return (
              <li key={number} className="process-step-wrapper">
                <Reveal className="process-step" delay={index * 0.09}>
                  <div className="process-step-top">
                    <span className="process-step-num">{number}</span>
                    <span className="process-step-node" aria-hidden="true" />
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  
                  {index < steps.length - 1 && (
                    <ArrowRight
                      className="process-step-arrow"
                      size={16}
                      aria-hidden="true"
                    />
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}