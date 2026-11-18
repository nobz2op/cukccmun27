import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ShimmerTitle from '../common/ShimmerTitle'
import { siteNavigation } from '../../data/navigation'
import './SiteHeader.css'

type NavigationLinksProps = {
  className: string
  onNavigate?: () => void
}

function NavigationLinks({ className, onNavigate }: NavigationLinksProps) {
  return (
    <ul className={className}>
      {siteNavigation.map(({ label, to }) => (
        <li key={to}>
          <NavLink
            className={({ isActive }) =>
              `site-header__link${isActive ? ' site-header__link--active' : ''}`
            }
            end={to === '/'}
            to={to}
            onClick={onNavigate}
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const menuCloseRef = useRef<HTMLButtonElement>(null)

  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    if (!isMenuOpen) return

    const previousOverflow = document.body.style.overflow
    const menuToggle = menuToggleRef.current
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    menuCloseRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      menuToggle?.focus()
    }
  }, [isMenuOpen])

  useEffect(() => {
    const desktopViewport = window.matchMedia('(min-width: 901px)')
    const closeOnDesktop = () => {
      if (desktopViewport.matches) closeMenu()
    }

    desktopViewport.addEventListener('change', closeOnDesktop)
    return () => desktopViewport.removeEventListener('change', closeOnDesktop)
  }, [])

  return (
    <header className="site-header">
      <div className="site-header__row">
        <div className="site-header__brand">
          <Link
            className="site-header__logo-link"
            to="/"
            aria-label="CUKCCMUN'27 home"
            onClick={closeMenu}
          >
            <img
              className="site-header__logo"
              src="/images/cukccmun-logo.png"
              alt="CUKCCMUN'27 emblem"
            />
          </Link>
          <div className="site-header__identity">
            <ShimmerTitle as="h1" text="CUKCCMUN'27" />
            <p>CAUSA • CONSILIUM • CONCORDIA</p>
          </div>
        </div>

        <nav className="site-header__desktop-navigation" aria-label="Main navigation">
          <NavigationLinks className="site-header__links" />
        </nav>

        <button
          ref={menuToggleRef}
          className={`site-header__menu-toggle${isMenuOpen ? ' site-header__menu-toggle--open' : ''}`}
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div
        className={`site-header__mobile-layer${isMenuOpen ? ' site-header__mobile-layer--open' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <button
          className="site-header__overlay"
          type="button"
          aria-label="Close navigation menu"
          tabIndex={isMenuOpen ? 0 : -1}
          onClick={closeMenu}
        />
        <div
          className="site-header__drawer"
          id="mobile-navigation"
          role="dialog"
          aria-label="Mobile navigation menu"
          aria-modal={isMenuOpen}
          inert={!isMenuOpen}
        >
          <div className="site-header__drawer-heading">
            <p>Menu</p>
            <button
              ref={menuCloseRef}
              className="site-header__drawer-close"
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
            />
          </div>
          <nav aria-label="Mobile navigation">
            <NavigationLinks
              className="site-header__links site-header__drawer-links"
              onNavigate={closeMenu}
            />
          </nav>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
