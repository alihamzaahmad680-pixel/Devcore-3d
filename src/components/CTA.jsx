import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';

export default function CTA({
  index = "06 / YOUR NEXT CHAPTER",
  headingLine1 = "Ready to build",
  headingLine2 = "what's next?",
  description = "Let's create a digital solution that moves your business forward.",
  buttonText = "Start a conversation",
  email = "hello@devcore.com",
  subject = "Let's build what's next",
  signature = "GOOD SYSTEMS MAKE\nGREAT THINGS POSSIBLE."
}) {
  return (
    <section className="cta section-pad" id="contact">
      <div className="cta-grid" aria-hidden="true" />
      <div className="cta-glow" aria-hidden="true" />
      <Reveal className="cta-content page-shell">
        <span className="section-index">{index}</span>
        <h2>
          {headingLine1}
          <br />
          <span>{headingLine2}</span>
        </h2>
        <p>{description}</p>
        <a 
          className="button button--primary button--cta" 
          href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}
        >
          {buttonText} <ArrowUpRight size={17} />
        </a>
        <span className="cta-signature">
          {signature.split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              {idx < signature.split('\n').length - 1 && <br />}
            </span>
          ))}
        </span>
      </Reveal>
    </section>
  );
}