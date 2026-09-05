import { useEffect, useRef, useState } from 'react'

const CONTACT_EMAIL = 'dominik.knieriemen@gmail.com'

const NAV_LINKS = [
  { href: '#work', label: 'What I do' },
  { href: '#contact', label: 'Contact' },
]

const SERVICES = [
  {
    title: 'Product engineering',
    description:
      'Turning fuzzy ideas into shipped software — from first prototype to something real users depend on.',
  },
  {
    title: 'Web apps & APIs',
    description:
      'Fast, accessible interfaces backed by clean, well-modeled APIs. No unnecessary layers, no dead weight.',
  },
  {
    title: 'Automation & tooling',
    description:
      'Scripts, pipelines, and internal tools that quietly remove the busywork so the real work moves faster.',
  },
]

const DESKTOP_BREAKPOINT = '(min-width: 721px)'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null)

  // Keep the mobile overlay's top offset in sync with the header's real
  // height instead of a hardcoded pixel value.
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const setNavHeight = () => {
      document.documentElement.style.setProperty('--nav-height', `${header.offsetHeight}px`)
    }
    setNavHeight()
    const observer = new ResizeObserver(setNavHeight)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  // Close the overlay if the viewport grows past the mobile breakpoint
  // (e.g. rotating a tablet) so it can't get stuck open with no visible
  // way to dismiss it.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_BREAKPOINT)
    const handleChange = () => setMenuOpen(false)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''

    if (!menuOpen) return

    firstMenuLinkRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <>
      <header className="nav" ref={headerRef}>
        <div className="nav-inner">
          <a href="#top" className="wordmark" onClick={() => setMenuOpen(false)}>
            dominik<span className="accent-dot">.</span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a href={`mailto:${CONTACT_EMAIL}`} className="nav-cta">
              Say hello
            </a>
          </nav>

          <button
            ref={toggleRef}
            className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              ref={index === 0 ? firstMenuLinkRef : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="nav-cta"
            onClick={() => setMenuOpen(false)}
          >
            Say hello
          </a>
        </div>
      )}

      <main id="top">
        <section className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <p className="eyebrow">Dominik Knieriemen</p>
          <h1>
            I build software that <span className="accent">quietly works</span>.
          </h1>
          <p className="hero-sub">
            Software engineer focused on clean, dependable products — from the first line of
            code to the version people actually rely on.
          </p>
          <div className="hero-actions">
            <a href="#work" className="btn btn-primary">
              What I do
            </a>
            <a href="#contact" className="btn btn-ghost">
              Get in touch
            </a>
          </div>
        </section>

        <section id="work" className="work">
          <h2>What I do</h2>
          <div className="work-grid">
            {SERVICES.map((service) => (
              <article key={service.title} className="work-card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="contact">
          <h2>Let's talk</h2>
          <p>
            Have a project, an idea, or just want to say hi? My inbox is open.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-primary btn-large">
            {CONTACT_EMAIL}
          </a>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Dominik Knieriemen</span>
      </footer>
    </>
  )
}

export default App
