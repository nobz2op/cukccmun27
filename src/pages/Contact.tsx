import { AtSign, Mail, MapPin, Phone } from 'lucide-react'
import { contactDetails } from '../data/contact'
import './Contact.css'

function Contact() {
  return (
    <main className="contact-page">
      <div className="contact-container">
        <header className="contact-heading">
          <h1>Contact</h1>
          <p>Get in touch with the CUKCCMUN&apos;27 team.</p>
        </header>

        <div className="contact-grid">
          <section className="contact-card" aria-labelledby="contact-email">
            <Mail
              className="contact-card__icon contact-card__icon--email"
              aria-hidden="true"
            />
            <div className="contact-card__content">
              <h2 id="contact-email">Email</h2>
              <a href={`mailto:${contactDetails.email}`}>
                {contactDetails.email}
              </a>
            </div>
          </section>

          <section className="contact-card" aria-labelledby="contact-phone">
            <Phone
              className="contact-card__icon contact-card__icon--phone"
              aria-hidden="true"
            />
            <div className="contact-card__content">
              <h2 id="contact-phone">Contact Numbers</h2>
              <ul className="contact-card__phone-list">
                {contactDetails.phoneNumbers.map((number) => (
                  <li key={number}>
                    <a href={`tel:${number}`}>{number}</a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="contact-card" aria-labelledby="contact-venue">
            <MapPin
              className="contact-card__icon contact-card__icon--venue"
              aria-hidden="true"
            />
            <div className="contact-card__content">
              <h2 id="contact-venue">Venue</h2>
              <address>
                {contactDetails.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <a
                className="contact-card__action"
                href={contactDetails.mapsUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="View the CUKCC Campus location on Google Maps (opens in a new tab)"
              >
                <MapPin
                  className="contact-card__action-icon"
                  aria-hidden="true"
                  size={18}
                />
                View Location
              </a>
            </div>
          </section>

          <section className="contact-card" aria-labelledby="contact-social">
            <AtSign
              className="contact-card__icon contact-card__icon--instagram"
              aria-hidden="true"
            />
            <div className="contact-card__content">
              <h2 id="contact-social">Instagram</h2>
              <a
                href={contactDetails.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Visit the official CUKCCMUN'27 Instagram profile (opens in a new tab)"
              >
                @cukccmun_27
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Contact
