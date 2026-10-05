import { Gauge, PanelsTopLeft, ShieldCheck, Sparkles } from 'lucide-react';
import Reveal from './Reveal';

const REASONS = [
  {
    number: '01',
    title: 'Scalable solutions',
    text: 'Room to grow, without starting over.',
    icon: Gauge,
  },
  {
    number: '02',
    title: 'Modern technology',
    text: 'The right tools for long-term momentum.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Reliable systems',
    text: 'Dependable experiences, day after day.',
    icon: ShieldCheck,
  },
  {
    number: '04',
    title: 'Business-first thinking',
    text: 'Built around your people and processes.',
    icon: PanelsTopLeft,
  },
];

export default function WhyDevcore() {
  return (
    <section className="why section-pad" id="about" aria-label="Why Choose Devcore">
      <div className="page-shell">
        {/* Section Heading */}
        <Reveal className="section-heading why-heading">
          <div>
            <span className="section-index" aria-label="Section index 04">
              04 / WHY DEVCORE
            </span>
            <h2>
              Built for<br />
              <span>real business.</span>
            </h2>
          </div>
          <p>
            Thoughtful engineering.<br />
            A practical point of view.
          </p>
        </Reveal>

        {/* Reasons Grid */}
        <ol className="why-grid">
          {REASONS.map(({ number, title, text, icon: Icon }, index) => (
            <li key={number} className="why-item-wrapper">
              <Reveal className="why-item" delay={index * 0.07}>
                <div className="why-item-top">
                  <span className="why-number">{number}</span>
                  <Icon size={19} strokeWidth={1.4} aria-hidden="true" />
                </div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <span className="why-item-line" aria-hidden="true" />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}