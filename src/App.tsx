import { useEffect, useState } from 'react'

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

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  return (
    <>
      <header className="nav">
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
            <a href="mailto:dominik.knieriemen@gmail.com" className="nav-cta">
              Say hello
            </a>
          </nav>

          <button
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
        <div className="mobile-menu" role="dialog" aria-modal="true">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a
            href="mailto:dominik.knieriemen@gmail.com"
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
          <a href="mailto:dominik.knieriemen@gmail.com" className="btn btn-primary btn-large">
            dominik.knieriemen@gmail.com
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
