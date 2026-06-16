import { motion } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════════
// CoursePicker — tela inicial: o aluno escolhe qual aula estudar.
// Lê o manifesto (public/data/courses.json) e mostra um card por aula.
// Escopo CSS próprio (.app-home) para nenhum tema de aula vazar.
// ═══════════════════════════════════════════════════════════════════════════

export default function CoursePicker({ cursos, onSelect, appNome, appSub }) {
  return (
    <div className="app-home">
      <header className="home-cab">
        <div className="home-titulo">{appNome}</div>
        <div className="home-orn">
          <span className="home-orn-l" />
          <span className="home-orn-s">✦</span>
          <span className="home-orn-l" />
        </div>
        {appSub && <div className="home-sub">{appSub}</div>}
      </header>

      <div className="home-grid">
        {cursos.map((c, i) => (
          <motion.button
            type="button"
            key={c.id}
            className="curso-card"
            onClick={() => onSelect(c.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: 'easeOut' }}
            style={c.capa?.cor ? { '--card-cor': c.capa.cor } : undefined}
          >
            {c.capa?.icone && <div className="curso-card-ic">{c.capa.icone}</div>}
            <div className="curso-card-txt">
              <div className="curso-card-titulo">{c.titulo}</div>
              {c.subtitulo && <div className="curso-card-sub">{c.subtitulo}</div>}
              {c.periodo && <div className="curso-card-periodo">{c.periodo}</div>}
            </div>
            <div className="curso-card-seta">›</div>
          </motion.button>
        ))}
      </div>

      <footer className="home-rodape">
        Baseado exclusivamente no material de cada curso.
      </footer>
    </div>
  )
}
