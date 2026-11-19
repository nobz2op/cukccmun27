import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { siteNavigation } from '../../data/navigation'
import './SiteFooter.css'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <section className="site-footer__section" aria-labelledby="footer-contact">
          <h2 id="footer-contact">Contact</h2>
          <address>
            <a className="site-footer__contact-item" href="mailto:CUKCCMUN27@gmail.com">
              <Mail size={15} aria-hidden="true" />
              CUKCCMUN27@gmail.com
            </a>
            <a className="site-footer__contact-item" href="tel:7034340055">
              <Phone size={15} aria-hidden="true" />
              7034340055
            </a>
            <a className="site-footer__contact-item" href="tel:9447652912">
              <Phone size={15} aria-hidden="true" />
              9447652912
            </a>
            <span className="site-footer__contact-item">
              <MapPin size={15} aria-hidden="true" />
              CUKCC Campus, Pattom, Marappalam, Trivandrum
            </span>
          </address>
        </section>

        <nav className="site-footer__section" aria-label="Footer navigation">
          <h2>Explore</h2>
          <ul>
            {siteNavigation.map(({ label, to }) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className="site-footer__section" aria-labelledby="footer-connect">
          <h2 id="footer-connect">Connect</h2>
          <a
            className="site-footer__instagram"
            href="https://www.instagram.com/cukccmun_27/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
            <span aria-hidden="true" className="bi bi-instagram" />
          </a>
        </section>
      </div>
    </footer>
  )
}

export default SiteFooter
