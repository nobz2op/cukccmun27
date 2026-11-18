import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import GoldDust from '../components/common/GoldDust'
import ShimmerTitle from '../components/common/ShimmerTitle'
import './Home.css'

const conferenceStart = new Date('2027-01-08T00:00:00+05:30').getTime()
const millisecondsPerDay = 24 * 60 * 60 * 1000
const millisecondsPerHour = 60 * 60 * 1000
const millisecondsPerMinute = 60 * 1000

type CountdownValues = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getCountdownValues(): CountdownValues {
  const remaining = Math.max(0, conferenceStart - Date.now())

  return {
    days: Math.floor(remaining / millisecondsPerDay),
    hours: Math.floor((remaining % millisecondsPerDay) / millisecondsPerHour),
    minutes: Math.floor((remaining % millisecondsPerHour) / millisecondsPerMinute),
    seconds: Math.floor((remaining % millisecondsPerMinute) / 1000),
  }
}

const countdownUnits = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
] as const

function Home() {
  const homeRef = useRef<HTMLElement | null>(null)
  const [countdown, setCountdown] = useState<CountdownValues>(getCountdownValues)

  useEffect(() => {
    const root = homeRef.current
    if (!root) return

    const revealElements = root.querySelectorAll<HTMLElement>('[data-reveal]')
    if (typeof IntersectionObserver === 'undefined') {
      revealElements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            activeObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
    )

    revealElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountdown(getCountdownValues())
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <main className="home-page" ref={homeRef}>
      <GoldDust variant="ambient" />
      <section className="home-hero" aria-labelledby="home-title">
        <GoldDust variant="hero" />
        <div className="home-container home-hero__content">
          <p className="home-eyebrow home-hero__intro home-hero__intro--1">
            Central University of Kerala Capital Centre
          </p>
          <ShimmerTitle
            as="h1"
            id="home-title"
            className="home-hero__intro home-hero__title shimmer-title--hero"
            text="CUKCCMUN'27"
          />
          <p className="home-hero__motto home-hero__intro home-hero__intro--3">
            CAUSA • CONSILIUM • CONCORDIA
          </p>
          <div className="home-divider home-hero__divider home-hero__intro home-hero__intro--4" aria-hidden="true" />
          <p className="home-hero__dates home-hero__intro home-hero__intro--5">
            8th, 9th and 10th January 2027
          </p>
          <p className="home-hero__venue home-hero__intro home-hero__intro--6">
            Central University of Kerala Capital Centre, Pattom, Trivandrum.
          </p>

          <div
            className="home-countdown home-hero__intro home-hero__intro--7"
            aria-label="Countdown to 8 January 2027"
            aria-live="off"
          >
            {countdownUnits.map(({ key, label }) => (
              <div
                className="home-countdown__unit"
                key={key}
                aria-label={`${countdown[key]} ${label.toLowerCase()}`}
              >
                <span className="home-countdown__value" key={countdown[key]}>
                  {String(countdown[key]).padStart(2, '0')}
                </span>
                <span className="home-countdown__label">{label}</span>
              </div>
            ))}
          </div>

          <div className="home-hero__actions home-hero__intro home-hero__intro--8">
            <Link
              className="home-button home-button--primary home-button--register"
              to="/registration"
            >
              Register Now
            </Link>
            <Link className="home-button home-button--secondary" to="/committees">
              View Committees
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="institution-title">
        <div className="home-container">
          <header className="home-section__heading home-reveal" data-reveal>
            <p className="home-eyebrow">Our Institution</p>
            <h2 id="institution-title">About the Institution</h2>
          </header>
          <div className="home-copy home-reveal" data-reveal>
            <p>
              The Central University of Kerala (CUK), Kasaragod, is one of India&apos;s premier
              central universities, established under the Central Universities Act, 2009. Guided
              by the ideal ‘Amrutam tu Vidya’ (knowledge is eternal). CUK promotes academic and
              social commitment, moral values, intellectual honesty, creativity, and holistic
              human development.
            </p>
            <p>
              The Central University of Kerala, Capital Centre (CUKCC), located in
              Thiruvananthapuram, is the university&apos;s satellite campus dedicated to
              International Relations under the School of Global Studies. Situated in Kerala&apos;s
              administrative and diplomatic hub, it provides students with opportunities to
              engage deeply with global affairs, diplomacy, and strategic studies.
            </p>
            <p>
              The Department of International Relations offers undergraduate programmes focusing
              on critical thinking, interdisciplinary knowledge, global governance, diplomacy,
              and security studies. Its location provides valuable exposure to policymakers,
              embassies, and research institutions.
            </p>
            <p>
              Through seminars, conferences, Model UN simulations (MUNs), and collaborations with
              think tanks, CUKCC prepares future diplomats, policy analysts, and global
              strategists. By connecting academic learning with practical diplomacy, the centre
              contributes to CUK&apos;s vision of promoting responsible leadership, global peace,
              and cooperation.
            </p>
          </div>
        </div>
      </section>

      <section
        className="home-section home-section--shaded"
        aria-labelledby="conference-title"
      >
        <div className="home-container home-conference">
          <div className="home-section__heading home-reveal" data-reveal>
            <p className="home-eyebrow">The Conference</p>
            <h2 id="conference-title">About CUKCCMUN&apos;27</h2>
          </div>
          <p className="home-conference__copy home-reveal" data-reveal>
            CUKCCMUN&apos;27 is a Model United Nations conference, hosted by Central University of
            Kerala Capital Centre located in Pattom, Trivandrum. It is the second edition of
            CUKCCMUN. As a college exclusively focused on International Relations, we aspire to
            provide an authentic experience of global politics through Model United Nations, as a
            way to stimulate, promote and encourage a wider practical discourse into international
            relations and international institutions. The conference seeks to offer participants
            an opportunity to critically engage with contemporary geopolitical developments,
            understand the complexities of multilateral diplomacy, and examine the competing
            interests and perspectives that shape the international system.
          </p>
        </div>
      </section>

      <section className="home-section" aria-labelledby="motto-title">
        <div className="home-container">
          <header className="home-section__heading home-reveal" data-reveal>
            <p className="home-eyebrow">Our Guiding Principles</p>
            <h2 id="motto-title">The Conference Motto</h2>
          </header>
          <div className="home-card-grid home-card-grid--three">
            <article className="home-card home-reveal" data-reveal>
              <p className="home-card__latin">01</p>
              <h3>CAUSA</h3>
              <p className="home-card__subtitle">The Cause</p>
              <p>A purpose or issue that demands attention and action.</p>
            </article>
            <article className="home-card home-reveal" data-reveal>
              <p className="home-card__latin">02</p>
              <h3>CONSILIUM</h3>
              <p className="home-card__subtitle">The Council</p>
              <p>A gathering of minds to deliberate, exchange ideas and seek solutions.</p>
            </article>
            <article className="home-card home-reveal" data-reveal>
              <p className="home-card__latin">03</p>
              <h3>CONCORDIA</h3>
              <p className="home-card__subtitle">Harmony</p>
              <p>The unity and mutual understanding achieved through dialogue and cooperation.</p>
            </article>
          </div>
        </div>
      </section>

      <section
        className="home-section home-section--shaded"
        aria-labelledby="venue-title"
      >
        <div className="home-container">
          <header className="home-section__heading home-reveal" data-reveal>
            <p className="home-eyebrow">Find us</p>
            <h2 id="venue-title">VENUE</h2>
          </header>
          <div className="home-venue home-reveal" data-reveal>
            <div className="home-venue__mark" aria-hidden="true">
              <span className="bi bi-geo-alt" />
            </div>
            <div className="home-venue__details">
              <h3>Central University of Kerala Capital Centre</h3>
              <p>Pattom, Marappalam.</p>
              <p className="home-venue__dates">January 8, 9 and 10, 2027</p>
              <a
                className="home-button home-button--secondary"
                href="https://maps.app.goo.gl/aJ28avYybFZmp9PU7"
                target="_blank"
                rel="noreferrer"
                aria-label="View the venue location on Google Maps (opens in a new tab)"
              >
                View Location
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="participate-title">
        <div className="home-container">
          <header className="home-section__heading home-reveal" data-reveal>
            <p className="home-eyebrow">Join the Conference</p>
            <h2 id="participate-title">Who Can Participate</h2>
          </header>
          <div className="home-card-grid home-card-grid--three">
            <article className="home-card home-participant-card home-reveal" data-reveal>
              <span className="bi bi-people home-participant-card__icon" aria-hidden="true" />
              <h3>School Delegation</h3>
            </article>
            <article className="home-card home-participant-card home-reveal" data-reveal>
              <span className="bi bi-mortarboard home-participant-card__icon" aria-hidden="true" />
              <h3>College Delegation</h3>
            </article>
            <article className="home-card home-participant-card home-reveal" data-reveal>
              <span className="bi bi-person home-participant-card__icon" aria-hidden="true" />
              <h3>Individual Delegation</h3>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
