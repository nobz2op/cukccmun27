import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import type { PortfolioFlag, PortfolioStyle } from '../../data/committees'

type PortfolioMatrixProps = {
  portfolios: string[]
  style: PortfolioStyle
  flags?: Record<string, PortfolioFlag>
  images?: Record<string, string>
  headingId?: string
}

type PortfolioTileProps = {
  name: string
  style: PortfolioStyle
  image?: string
  imageType?: 'flag' | 'portrait'
  portfolioIndex: number
  isSelected: boolean
  isClone: boolean
  animationKey: number
  onSelect: (
    event: ReactMouseEvent<HTMLButtonElement>,
    portfolioIndex: number,
  ) => void
}

function PortfolioTile({
  name,
  style,
  image,
  imageType,
  portfolioIndex,
  isSelected,
  isClone,
  animationKey,
  onSelect,
}: PortfolioTileProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const artworkLabel = style === 'flag' ? 'Flag artwork pending' : 'Character artwork pending'
  const hasImage = Boolean(image && !imageFailed)

  return (
    <li
      className={[
        'portfolio-matrix__item',
        `portfolio-matrix__item--${style === 'flag' ? 'flags' : 'characters'}`,
        isSelected ? 'portfolio-matrix__item--selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-portfolio-index={portfolioIndex}
      aria-hidden={isClone || undefined}
    >
      <button
        className="portfolio-matrix__slide"
        type="button"
        aria-label={name}
        aria-pressed={isSelected}
        tabIndex={isClone ? -1 : undefined}
        onClick={(event) =>
          onSelect(event, Number(event.currentTarget.parentElement?.dataset.portfolioIndex))
        }
      >
        <span
          className="portfolio-tile"
          style={{
            animationName:
              isSelected && animationKey > 0
                ? animationKey % 2 === 0
                  ? 'portfolio-select-pop-a'
                  : 'portfolio-select-pop-b'
                : 'none',
          }}
        >
          <span
            className={[
              'portfolio-tile__art',
              style === 'character' ? 'portfolio-tile__art--character' : '',
              hasImage && imageType === 'flag' ? 'portfolio-tile__art--flag' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          >
            {hasImage ? (
              <img
                className={
                  imageType === 'portrait'
                    ? 'portfolio-tile__portrait'
                    : 'portfolio-tile__flag'
                }
                src={image}
                alt=""
                draggable={false}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <span className="portfolio-tile__pixel-art">
                <span className="portfolio-tile__pixel portfolio-tile__pixel--one" />
                <span className="portfolio-tile__pixel portfolio-tile__pixel--two" />
                <span className="portfolio-tile__pixel portfolio-tile__pixel--three" />
                <span className="portfolio-tile__pixel portfolio-tile__pixel--four" />
              </span>
            )}
          </span>
          {!hasImage && <span className="portfolio-tile__placeholder">{artworkLabel}</span>}
          <span className="portfolio-tile__name">{name}</span>
        </span>
      </button>
    </li>
  )
}

function PortfolioMatrix({
  portfolios,
  style,
  flags,
  images,
  headingId = 'portfolio-matrix-title',
}: PortfolioMatrixProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isPointerInteracting, setIsPointerInteracting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden,
  )
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [setWidth, setSetWidth] = useState(0)
  const [recenterVersion, setRecenterVersion] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const offsetRef = useRef(0)
  const setWidthRef = useRef(0)
  const recenterRef = useRef<{ start: number; target: number; startedAt: number | null } | null>(
    null,
  )
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    startOffset: number
    portfolioIndex: number | null
    slide: HTMLElement | null
  } | null>(null)
  const suppressClickRef = useRef(false)
  const suppressClickTimeoutRef = useRef<number | null>(null)
  const initializedRef = useRef(false)
  const portfolioCount = portfolios.length
  const selectedName = portfolios[selectedIndex] ?? ''
  const isAutoplayPaused =
    isHovered || isFocused || isPointerInteracting || !isDocumentVisible

  const normalizeOffset = useCallback(
    (offset: number) => {
      if (setWidth <= 0) {
        return offset
      }

      while (offset < 0) offset += setWidth
      while (offset >= setWidth * 2) offset -= setWidth
      return offset
    },
    [setWidth],
  )

  const updateOffset = useCallback(
    (offset: number) => {
      offsetRef.current = normalizeOffset(offset)
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
      }
    },
    [normalizeOffset],
  )

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(preference.matches)
    updatePreference()
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const updateVisibility = () => setIsDocumentVisible(!document.hidden)
    document.addEventListener('visibilitychange', updateVisibility)
    updateVisibility()
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  useEffect(
    () => () => {
      if (suppressClickTimeoutRef.current !== null) {
        window.clearTimeout(suppressClickTimeoutRef.current)
      }
    },
    [],
  )

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || portfolioCount === 0) return

    const measure = () => {
      const firstSlide = track.children[0] as HTMLElement | undefined
      const nextSetFirstSlide = track.children[portfolioCount] as HTMLElement | undefined
      if (!firstSlide || !nextSetFirstSlide) return

      const firstRect = firstSlide.getBoundingClientRect()
      const nextSetRect = nextSetFirstSlide.getBoundingClientRect()
      const viewportRect = viewport.getBoundingClientRect()
      const nextWidth = nextSetRect.left - firstRect.left
      if (nextWidth <= 0) return

      const previousWidth = setWidthRef.current

      if (!initializedRef.current) {
        const centeredOffset =
          style === 'character'
            ? (viewport.clientWidth - firstSlide.offsetWidth) / 2
            : 0
        offsetRef.current =
          nextSetRect.left - viewportRect.left - centeredOffset
        initializedRef.current = true
      } else if (previousWidth > 0) {
        offsetRef.current = (offsetRef.current / previousWidth) * nextWidth
      }

      setWidthRef.current = nextWidth

      setSetWidth((current) => (current === nextWidth ? current : nextWidth))
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(track)
    return () => observer.disconnect()
  }, [portfolioCount, style])

  useEffect(() => {
    if (
      setWidth <= 0 ||
      portfolioCount < 2 ||
      !isDocumentVisible ||
      isPointerInteracting ||
      (!recenterRef.current && (isAutoplayPaused || prefersReducedMotion))
    ) {
      return
    }

    let frame = 0
    let previousTime: number | null = null
    const speed = style === 'flag' ? 22 : 14

    const animate = (time: number) => {
      const elapsed = previousTime === null ? 0 : Math.min(time - previousTime, 40)
      previousTime = time
      const recenter = recenterRef.current

      if (recenter && isDocumentVisible && !isPointerInteracting) {
        if (recenter.startedAt === null) recenter.startedAt = time
        const progress = Math.min((time - recenter.startedAt) / 360, 1)
        const eased = 1 - (1 - progress) ** 3
        updateOffset(recenter.start + (recenter.target - recenter.start) * eased)
        if (progress === 1) {
          recenterRef.current = null
          if (isAutoplayPaused || prefersReducedMotion) return
        }
      } else if (!recenter && !isAutoplayPaused && !prefersReducedMotion) {
        updateOffset(offsetRef.current + (speed * elapsed) / 1000)
      }

      frame = window.requestAnimationFrame(animate)
    }

    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [
    isAutoplayPaused,
    isDocumentVisible,
    isPointerInteracting,
    portfolioCount,
    prefersReducedMotion,
    recenterVersion,
    setWidth,
    style,
    updateOffset,
  ])

  const centerSlide = useCallback((slide: HTMLElement) => {
    const viewport = viewportRef.current
    if (!viewport) return
    const slideCenter = slide.getBoundingClientRect().left + slide.offsetWidth / 2
    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2
    const start = offsetRef.current
    recenterRef.current = {
      start,
      target: start + slideCenter - viewportCenter,
      startedAt: null,
    }
    setRecenterVersion((current) => current + 1)
  }, [])

  const selectPortfolio = useCallback(
    (index: number, slide?: HTMLElement) => {
      setSelectedIndex(index)
      setAnimationKey((current) => current + 1)
      if (slide) centerSlide(slide)
    },
    [centerSlide],
  )

  const handleCardSelect = (
    event: ReactMouseEvent<HTMLButtonElement>,
    portfolioIndex: number,
  ) => {
    if (suppressClickRef.current) {
      event.preventDefault()
      suppressClickRef.current = false
      if (suppressClickTimeoutRef.current !== null) {
        window.clearTimeout(suppressClickTimeoutRef.current)
        suppressClickTimeoutRef.current = null
      }
      return
    }

    selectPortfolio(portfolioIndex, event.currentTarget.parentElement ?? undefined)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const slide = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-portfolio-index]',
    )
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offsetRef.current,
      portfolioIndex: slide ? Number(slide.dataset.portfolioIndex) : null,
      slide,
    }
    setIsDragging(true)
    setIsPointerInteracting(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const distanceX = event.clientX - drag.startX
    if (Math.abs(distanceX) > 4) {
      updateOffset(drag.startOffset - distanceX)
    }
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const distanceX = event.clientX - drag.startX
    const distanceY = event.clientY - drag.startY
    const didDrag = Math.abs(distanceX) >= 8 && Math.abs(distanceX) > Math.abs(distanceY)
    if (didDrag) {
      suppressClickRef.current = true
      suppressClickTimeoutRef.current = window.setTimeout(() => {
        suppressClickRef.current = false
        suppressClickTimeoutRef.current = null
      }, 0)

      if (style === 'character') {
        const viewport = viewportRef.current
        const track = trackRef.current
        if (viewport && track) {
          const center = viewport.getBoundingClientRect().left + viewport.clientWidth / 2
          const nearest = Array.from(track.children)
            .map((child) => child as HTMLElement)
            .reduce<HTMLElement | null>((closest, child) => {
              if (!closest) return child
              const childDistance = Math.abs(
                child.getBoundingClientRect().left + child.offsetWidth / 2 - center,
              )
              const closestDistance = Math.abs(
                closest.getBoundingClientRect().left + closest.offsetWidth / 2 - center,
              )
              return childDistance < closestDistance ? child : closest
            }, null)
          if (nearest) {
            const index = Number(nearest.dataset.portfolioIndex)
            if (index >= 0) selectPortfolio(index, nearest)
          }
        }
      }
    } else if (drag.portfolioIndex !== null && drag.slide) {
      selectPortfolio(drag.portfolioIndex, drag.slide)
      suppressClickRef.current = true
      suppressClickTimeoutRef.current = window.setTimeout(() => {
        suppressClickRef.current = false
        suppressClickTimeoutRef.current = null
      }, 0)
    }

    dragRef.current = null
    setIsDragging(false)
    setIsPointerInteracting(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handlePointerCancel = () => {
    dragRef.current = null
    setIsDragging(false)
    setIsPointerInteracting(false)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveSelection(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveSelection(1)
    }
  }

  const moveSelection = (direction: -1 | 1) => {
    const index = (selectedIndex + direction + portfolioCount) % portfolioCount
    const track = trackRef.current
    if (track) {
      const candidates = Array.from(track.children)
        .map((child) => child as HTMLElement)
        .filter((child) => Number(child.dataset.portfolioIndex) === index)
      const viewport = viewportRef.current
      if (viewport && candidates.length > 0) {
        const center = viewport.getBoundingClientRect().left + viewport.clientWidth / 2
        const nearest = candidates.reduce((closest, child) =>
          Math.abs(child.getBoundingClientRect().left + child.offsetWidth / 2 - center) <
          Math.abs(closest.getBoundingClientRect().left + closest.offsetWidth / 2 - center)
            ? child
            : closest,
        )
        selectPortfolio(index, nearest)
        return
      }
    }
    selectPortfolio(index)
  }

  if (portfolioCount === 0) return null

  const slides = Array.from({ length: 3 }, (_, copyIndex) =>
    portfolios.map((name, portfolioIndex) => ({
      name,
      portfolioIndex,
      copyIndex,
    })),
  ).flat()

  return (
    <section
      className={`portfolio-matrix portfolio-matrix--${style === 'flag' ? 'flags' : 'characters'}`}
      aria-labelledby={headingId}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocused(false)
        }
      }}
    >
      <header className="portfolio-matrix__header">
        <div>
          <h2 id={headingId}>Portfolio Matrix</h2>
          <p>
            {style === 'flag'
              ? 'Select a portfolio from the continuously moving flag strip.'
              : 'Choose a portfolio using the arrows, swipe or drag the carousel, or select a neighboring card.'}
          </p>
        </div>
      </header>
      <div
        ref={viewportRef}
        className={`portfolio-matrix__viewport${isDragging ? ' portfolio-matrix__viewport--dragging' : ''}`}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${style === 'flag' ? 'Flag' : 'Character'} portfolio selection`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <ul ref={trackRef} className="portfolio-matrix__track">
          {slides.map(({ name, portfolioIndex, copyIndex }) => {
            const flag = flags?.[name]?.image
            const image = flag ?? images?.[name]
            const imageType = flag ? 'flag' : image ? 'portrait' : undefined

            return (
              <PortfolioTile
                key={`${copyIndex}-${portfolioIndex}-${name}`}
                name={name}
                style={style}
                image={image}
                imageType={imageType}
                portfolioIndex={portfolioIndex}
                isSelected={portfolioIndex === selectedIndex}
                isClone={copyIndex !== 1}
                animationKey={animationKey}
                onSelect={handleCardSelect}
              />
            )
          })}
        </ul>
      </div>
      <div className="portfolio-matrix__controls">
        <button
          className="committee-action portfolio-matrix__arrow"
          type="button"
          aria-label="Previous portfolio"
          onClick={() => moveSelection(-1)}
        >
          <span aria-hidden="true">←</span> Previous
        </button>
        <p className="portfolio-matrix__count" aria-live="polite">
          <span className="portfolio-matrix__announcement">Selected portfolio: {selectedName}. </span>
          {selectedIndex + 1} / {portfolioCount}
        </p>
        <button
          className="committee-action portfolio-matrix__arrow"
          type="button"
          aria-label="Next portfolio"
          onClick={() => moveSelection(1)}
        >
          Next <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}

export default PortfolioMatrix
