import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');

  // 1. Handle Scroll Header Background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Lock Body Scroll & Keyboard Escape Handler
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  // 3. Track Active Section on Scroll via IntersectionObserver
  useEffect(() => {
    const sectionIds = links.map((link) => link.href);
    const sections = sectionIds
      .map((id) => document.querySelector(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    closeMenu();

    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`site-header${scrolled ? ' site-header--scrolled' : ''}${
        menuOpen ? ' site-header--open' : ''
      }`}
    >
      <nav className="nav-shell page-shell" aria-label="Main navigation">
        {/* Brand Logo */}
        <a
          className="brand"
          href="#home"
          aria-label="Devcore home"
          onClick={(e) => handleNavClick(e, '#home')}
        >
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>DEVCORE</span>
        </a>

        {/* Navigation Links */}
        <div
          id="primary-navigation"
          className={`nav-links${menuOpen ? ' nav-links--open' : ''}`}
        >
          {links.map(({ label, href }) => {
            const isActive = activeSection === href;
            return (
              <a
                key={label}
                href={href}
                className={isActive ? 'nav-link--active' : ''}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => handleNavClick(e, href)}
              >
                {label}
              </a>
            );
          })}
          <a
            className="nav-mobile-cta"
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            Get started <ArrowUpRight size={15} />
          </a>
        </div>

        {/* Desktop CTA */}
        <a
          className="nav-cta"
          href="#contact"
          onClick={(e) => handleNavClick(e, '#contact')}
        >
          Get started <ArrowUpRight size={15} />
        </a>

        {/* Mobile Toggle Button */}
        <button
          className="menu-toggle"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Drawer Overlay Backdrop */}
      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}