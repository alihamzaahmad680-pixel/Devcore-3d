import { ArrowUpRight } from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const footerLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const handleScrollToTop = (e) => {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer">
      <div className="page-shell">

        {/* =========================
            FOOTER MAIN
        ========================= */}
        <div className="footer-main">

          {/* =========================
              BRAND COLUMN
          ========================= */}
          <div className="footer-brand">
            <a className="brand" href="#home">
              
              <span
                className="brand-mark"
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
              </span>

              <span>DEVCORE</span>
            </a>

            <p>
              Web applications
              <br />
              &amp; POS solutions.
            </p>
          </div>


          {/* =========================
              NAVIGATION COLUMN
          ========================= */}
          <nav
            className="footer-nav"
            aria-label="Footer navigation"
          >
            <span className="footer-label">
              EXPLORE
            </span>

            <ul className="footer-links-list">
              {footerLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>


          {/* =========================
              SOCIAL / CONTACT COLUMN
          ========================= */}
          <div className="footer-social">

            <span className="footer-label">
              SAY HELLO
            </span>


            {/* Email */}
            <a
              className="footer-email"
              href="mailto:hello@devcore.com"
            >
              <span>
                hello@devcore.com
              </span>

              <ArrowUpRight size={14} />
            </a>


            {/* Social Links */}
            <div className="social-links">

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedinIn size={16} />
              </a>


              {/* GitHub */}
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                <FaGithub size={16} />
              </a>

            </div>

          </div>

        </div>


        {/* =========================
            FOOTER BOTTOM
        ========================= */}
        <div className="footer-bottom">

          <span>
            © {new Date().getFullYear()} DEVCORE.
            {' '}BUILT FOR WHAT&apos;S NEXT.
          </span>


          {/* Back To Top */}
          <a
            href="#top"
            onClick={handleScrollToTop}
            className="back-to-top"
          >
            BACK TO TOP ↑
          </a>

        </div>

      </div>
    </footer>
  );
}