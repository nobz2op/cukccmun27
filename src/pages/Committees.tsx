import { Link, useParams } from 'react-router-dom'
import { committees } from '../data/committees'
import PortfolioMatrix from '../components/committees/PortfolioMatrix'
import './Committees.css'

function CommitteeCard({
  slug,
  name,
  abbreviation,
  image,
  description,
  agenda,
}: (typeof committees)[number]) {
  return (
    <article className="committee-card" aria-labelledby={`committee-${slug}`}>
      <img className="committee-card__image" src={image} alt={`${name} emblem`} />
      <div className="committee-card__content">
        <p className="committee-card__abbreviation">{abbreviation}</p>
        <h2 id={`committee-${slug}`}>{name}</h2>
        <p className="committee-card__description">{description}</p>
        {agenda && (
          <p className="committee-card__information">Agenda: {agenda}</p>
        )}
        <Link className="committee-action" to={`/committees/${slug}`}>
          View Portfolio Matrix
        </Link>
      </div>
    </article>
  )
}

export function CommitteeDetail() {
  const { slug } = useParams()
  const committee = committees.find((item) => item.slug === slug)

  if (!committee) {
    return (
      <main className="committees-page">
        <div className="committees-container committee-detail">
          <h1>Committee not found</h1>
          <p>The requested committee could not be found.</p>
          <Link className="committee-action" to="/committees">
            Back to Committees
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="committees-page">
      <div className="committees-container committee-detail">
        <Link className="committee-detail__back" to="/committees">
          Back to Committees
        </Link>
        <article className="committee-detail__content">
          <img
            className="committee-detail__image"
            src={committee.image}
            alt={`${committee.name} emblem`}
          />
          <div>
            <p className="committee-card__abbreviation">{committee.abbreviation}</p>
            <h1>{committee.name}</h1>
            <dl className="committee-detail__information">
              <div>
                <dt>Description</dt>
                <dd>{committee.description}</dd>
              </div>
              <div>
                <dt>Tagline</dt>
                <dd>{committee.tagline}</dd>
              </div>
              {committee.agenda && (
                <div>
                  <dt>Agenda</dt>
                  <dd>{committee.agenda}</dd>
                </div>
              )}
            </dl>
          </div>
        </article>
        {committee.portfolios && committee.portfolioStyle && (
          <PortfolioMatrix
            portfolios={committee.portfolios}
            style={committee.portfolioStyle}
            flags={committee.portfolioFlags}
            images={committee.portfolioImages}
          />
        )}
      </div>
    </main>
  )
}

function Committees() {
  return (
    <main className="committees-page">
      <div className="committees-container">
        <header className="committees-heading">
          <h1>Committees</h1>
          <p>
            Explore the committees at CUKCCMUN&apos;27, their agendas, and the
            portfolios available in each committee.
          </p>
        </header>
        <section className="committee-grid" aria-label="Conference committees">
          {committees.map((committee) => (
            <CommitteeCard key={committee.slug} {...committee} />
          ))}
        </section>
      </div>
    </main>
  )
}

export default Committees
