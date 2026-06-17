import { useEffect, useRef } from 'react'

// ═══════════════════════════════════════════════════════════════════════════
// CursoLeitura — renderiza uma aula no formato de leitura contínua
//   • hero (HTML próprio da aula)
//   • nav fixa por âncoras
//   • seções: `raw_html` (verbatim, ex.: Ósio) OU estrutura {kicker,titulo,...}
//   • "Aprofundar ▼" via delegação de eventos (sem onclick inline)
//   • fade-in via IntersectionObserver
// Conteúdo vem do JSON da aula → dangerouslySetInnerHTML (ver CLAUDE.md).
// ═══════════════════════════════════════════════════════════════════════════

function SecaoEstruturada({ sec }) {
  const classe = ['section', sec.section_class].filter(Boolean).join(' ')
  return (
    <section id={sec.id} className={classe}>
      <div className="container fade-in">
        {sec.kicker && <div className="section-label">{sec.kicker}</div>}
        {sec.titulo && <h2 className="section-title">{sec.titulo}</h2>}
        {sec.intro && <p className="section-intro">{sec.intro}</p>}
        {sec.body_html && (
          <div dangerouslySetInnerHTML={{ __html: sec.body_html }} />
        )}
        {sec.expand_html && (
          <>
            <button type="button" className="expand-btn">
              Aprofundar <span className="arrow">▼</span>
            </button>
            <div className="expand-panel">
              <div
                className="expand-inner"
                dangerouslySetInnerHTML={{ __html: sec.expand_html }}
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default function CursoLeitura({ course }) {
  const rootRef = useRef(null)

  // ── "Aprofundar": um único listener delegado cobre os botões inline
  //    (Ósio) e os gerados pelo renderer (Redenção). Usa scrollHeight em vez
  //    do max-height fixo do arquivo-fonte (que cortava painéis altos).
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const onClick = (e) => {
      const btn = e.target.closest('.expand-btn')
      if (!btn || !root.contains(btn)) return
      const panel = btn.nextElementSibling
      if (!panel || !panel.classList.contains('expand-panel')) return
      const isOpen = btn.classList.toggle('open')
      panel.classList.toggle('open', isOpen)
      panel.style.maxHeight = isOpen ? panel.scrollHeight + 'px' : '0px'
    }

    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [course.id])

  // ── fade-in na entrada (respeita prefers-reduced-motion)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const els = root.querySelectorAll('.fade-in')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      els.forEach((el) => el.classList.add('visible'))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('visible')
            obs.unobserve(en.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [course.id])

  const scrollToAnchor = (anchor) => {
    rootRef.current
      ?.querySelector(`#${CSS.escape(anchor)}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={rootRef} className={`curso-leitura curso-${course.tema}`}>
      {course.hero_html && (
        <div dangerouslySetInnerHTML={{ __html: course.hero_html }} />
      )}

      {course.nav?.length > 0 && (
        <nav className="sticky-nav">
          {course.nav.map((n) => (
            <a
              key={n.anchor}
              href={`#${n.anchor}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToAnchor(n.anchor)
              }}
            >
              {n.label}
            </a>
          ))}
        </nav>
      )}

      {course.secoes?.map((sec, i) =>
        sec.raw_html ? (
          <div
            key={sec.id || `sec-${i}`}
            dangerouslySetInnerHTML={{ __html: sec.raw_html }}
          />
        ) : (
          <SecaoEstruturada key={sec.id || `sec-${i}`} sec={sec} />
        )
      )}

      {course.footer_html && (
        <div dangerouslySetInnerHTML={{ __html: course.footer_html }} />
      )}
    </div>
  )
}
