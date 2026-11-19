import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { committees } from '../data/committees'
import { registrationForms } from '../data/registration'
import type { RegistrationForm } from '../data/registration'
import PortfolioMatrix from '../components/committees/PortfolioMatrix'
import './Committees.css'
import './Registration.css'

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void
    }
  }
}

const tallyScriptUrl = 'https://tally.so/widgets/embed.js'

const portfolioSections = [
  { id: 'portfolio-unga', committeeSlug: 'unga' },
  { id: 'portfolio-wls', committeeSlug: 'world-leaders-summit' },
] as const
let tallyScriptPromise: Promise<void> | null = null

function loadTallyScript() {
  if (window.Tally) return Promise.resolve()
  if (tallyScriptPromise) return tallyScriptPromise

  tallyScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = tallyScriptUrl
    script.async = true
    script.onload = () => {
      if (window.Tally) {
        resolve()
      } else {
        reject(new Error('Tally embed script loaded without its API'))
      }
    }
    script.onerror = () => {
      script.remove()
      reject(new Error('Tally embed script failed to load'))
    }
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    tallyScriptPromise = null
    throw error
  })

  return tallyScriptPromise
}

function EmbeddedForm({ form }: { form: RegistrationForm }) {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  )
  const [attempt, setAttempt] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    let isCurrent = true
    const iframe = iframeRef.current
    const preserveIframeTitle = () => {
      if (iframe && iframe.title !== form.iframeTitle) {
        iframe.title = form.iframeTitle
      }
    }
    const titleObserver =
      iframe && typeof MutationObserver !== 'undefined'
        ? new MutationObserver(preserveIframeTitle)
        : null

    preserveIframeTitle()
    if (iframe) {
      titleObserver?.observe(iframe, {
        attributes: true,
        attributeFilter: ['title'],
      })
    }

    loadTallyScript()
      .then(() => {
        if (isCurrent) window.Tally?.loadEmbeds()
      })
      .catch(() => {
        if (isCurrent) setLoadState('error')
      })

    return () => {
      isCurrent = false
      titleObserver?.disconnect()
    }
  }, [attempt, form.iframeTitle])

  return (
    <div className="registration-form">
      {loadState === 'loading' && (
        <p className="registration-form__status" role="status">
          <span className="registration-form__spinner" aria-hidden="true" />
          Loading form…
        </p>
      )}
      {loadState === 'error' && (
        <div className="registration-form__fallback" role="alert">
          <p>
            This form could not be loaded. Check your connection and try again.
          </p>
          <button
            className="registration-form__retry"
            type="button"
            onClick={() => {
              setLoadState('loading')
              setAttempt((currentAttempt) => currentAttempt + 1)
            }}
          >
            Try again
          </button>
        </div>
      )}
      {loadState !== 'error' && (
        <iframe
          key={attempt}
          ref={iframeRef}
          className="registration-form__iframe registration-form__iframe--tally"
          data-tally-src={form.url}
          title={form.iframeTitle}
          loading="lazy"
          width="100%"
          onLoad={() => setLoadState('loaded')}
          onError={() => setLoadState('error')}
        />
      )}
    </div>
  )
}

function Registration() {
  const [expandedPortfolios, setExpandedPortfolios] = useState<
    Record<string, boolean>
  >({})
  const [searchParams] = useSearchParams()
  const requestedFormId = searchParams.get('form')
  const [expandedForms, setExpandedForms] = useState<Record<string, boolean>>(
    () => {
      const initialId = searchParams.get('form')
      return initialId &&
        registrationForms.some((form) => form.id === initialId)
        ? { [initialId]: true }
        : {}
    },
  )

  useEffect(() => {
    if (
      !requestedFormId ||
      !registrationForms.some((form) => form.id === requestedFormId)
    ) {
      return
    }

    document
      .getElementById(`registration-card-${requestedFormId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [requestedFormId])

  const toggleForm = (formId: string) => {
    setExpandedForms((currentForms) => ({
      ...currentForms,
      [formId]: !currentForms[formId],
    }))
  }

  const togglePortfolio = (sectionId: string) => {
    setExpandedPortfolios((currentSections) => ({
      ...currentSections,
      [sectionId]: !currentSections[sectionId],
    }))
  }

  return (
    <main className="registration-page">
      <div className="registration-container">
        <header className="registration-heading">
          <h1>Registration</h1>
          <p>Select a registration form to open it here.</p>
        </header>
        <section className="registration-options" aria-label="Registration forms">
          {registrationForms.map((form) => {
            const isExpanded = Boolean(expandedForms[form.id])
            const panelId = `${form.id}-panel`

            return (
              <article
                className={`registration-card${isExpanded ? ' registration-card--expanded' : ''}`}
                id={`registration-card-${form.id}`}
                key={form.id}
              >
                <h2 className="registration-card__heading">
                  <button
                    className="registration-card__toggle"
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => toggleForm(form.id)}
                  >
                    <span>{form.title}</span>
                    <span className="registration-card__indicator" aria-hidden="true">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>
                </h2>
                <div
                  className="registration-card__panel"
                  id={panelId}
                  hidden={!isExpanded}
                >
                  {isExpanded && (
                    <>
                      <div className="registration-card__panel-header">
                        <span className="registration-card__panel-title">
                          {form.title}
                        </span>
                        <button
                          className="registration-card__close"
                          type="button"
                          aria-label="Close form"
                          onClick={() => toggleForm(form.id)}
                        >
                          ×
                        </button>
                      </div>
                      <EmbeddedForm form={form} />
                    </>
                  )}
                </div>
              </article>
            )
          })}
        </section>

        <section
          className="registration-portfolios"
          aria-labelledby="registration-portfolios-title"
        >
          <h2
            className="registration-portfolios__title"
            id="registration-portfolios-title"
          >
            Explore Portfolios
          </h2>
          <div className="registration-options">
            {portfolioSections.map(({ id, committeeSlug }) => {
              const committee = committees.find(
                (item) => item.slug === committeeSlug,
              )
              if (!committee?.portfolios || !committee.portfolioStyle) {
                return null
              }

              const isExpanded = Boolean(expandedPortfolios[id])
              const panelId = `${id}-panel`

              return (
                <article
                  className={`registration-card${isExpanded ? ' registration-card--expanded' : ''}`}
                  key={id}
                >
                  <h2 className="registration-card__heading">
                    <button
                      className="registration-card__toggle"
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() => togglePortfolio(id)}
                    >
                      <span>{committee.name.toUpperCase()}</span>
                      <span
                        className="registration-card__indicator"
                        aria-hidden="true"
                      >
                        {isExpanded ? '−' : '+'}
                      </span>
                    </button>
                  </h2>
                  <div
                    className="registration-card__panel"
                    id={panelId}
                    hidden={!isExpanded}
                  >
                    {isExpanded && (
                      <PortfolioMatrix
                        portfolios={committee.portfolios}
                        style={committee.portfolioStyle}
                        flags={committee.portfolioFlags}
                        images={committee.portfolioImages}
                        headingId={`${id}-matrix-title`}
                      />
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Registration
