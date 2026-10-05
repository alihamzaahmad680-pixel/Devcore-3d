const panels = [
  {
    id: 'hero',
    index: '01 / 04',
    label: 'DIGITAL WORLDS / 2026',
    title: <>Worlds made<br /><span>tangible.</span></>,
    description: 'Immersive systems and digital products, shaped with intention and built to move.',
    action: 'ENTER THE SYSTEM',
    href: '#about',
    side: 'left',
  },
  {
    id: 'about',
    index: '02 / 04',
    label: 'SIGNAL / STRUCTURE / SCALE',
    title: <>Ideas take<br />a new <span>shape.</span></>,
    description: 'We turn complex ideas into clear, tactile experiences across the digital frontier.',
    action: 'DISCOVER OUR APPROACH',
    href: '#projects',
    side: 'right',
  },
  {
    id: 'projects',
    index: '03 / 04',
    label: 'SELECTED TRANSMISSIONS',
    title: <>Built to<br /><span>change form.</span></>,
    description: 'Connected interfaces, intelligent tools, and unexpected ways to explore what is possible.',
    action: 'VIEW THE WORK',
    href: '#contact',
    side: 'left',
  },
  {
    id: 'contact',
    index: '04 / 04',
    label: 'NEXT / START HERE',
    title: <>The next<br /><span>world is open.</span></>,
    description: 'Bring us the signal. We will help you turn it into something real.',
    action: 'START A CONVERSATION',
    href: 'mailto:hello@devcore.com',
    side: 'right',
  },
];

export default function ContentSections() {
  return (
    <main id="story" className="story-sections">
      {panels.map((panel) => (
        <section
          key={panel.id}
          id={panel.id}
          className={`story-section story-section--${panel.side}`}
          aria-labelledby={`${panel.id}-heading`}
        >
          <div className="story-grid" aria-hidden="true" />
          <article className="story-card">
            <div className="story-card-meta">
              <span>{panel.label}</span>
              <span>{panel.index}</span>
            </div>
            {panel.id === 'hero' ? (
              <h1 id={`${panel.id}-heading`} className="story-card-title">{panel.title}</h1>
            ) : (
              <h2 id={`${panel.id}-heading`} className="story-card-title">{panel.title}</h2>
            )}
            <p className="story-card-description">{panel.description}</p>
            <a className="story-card-link" href={panel.href}>
              <span>{panel.action}</span>
              <span aria-hidden="true">↗</span>
            </a>
            <div className="story-card-foot">
              <span>DEVCORE / IMMERSIVE SYSTEMS</span>
              <span>COORD. 37°46&apos;49.6&quot;N</span>
            </div>
          </article>
        </section>
      ))}
    </main>
  );
}
