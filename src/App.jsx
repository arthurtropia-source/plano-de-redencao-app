import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CoursePicker from './components/CoursePicker.jsx'
import CursoLeitura from './components/CursoLeitura.jsx'

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS DE DADOS
// ═══════════════════════════════════════════════════════════════════════════

function useCoursesManifest() {
  const [manifest, setManifest] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    fetch('/data/courses.json')
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(setManifest)
      .catch((e) => setError(e.message))
  }, [])
  return { manifest, error }
}

// lazy-fetch: só busca o JSON da aula quando ela é aberta
function useCourse(id, cursos) {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id || !cursos) { setCourse(null); return }
    const meta = cursos.find((c) => c.id === id)
    if (!meta) { setCourse(null); setError('Aula não encontrada'); return }
    setLoading(true); setError(null); setCourse(null)
    fetch(`/data/courses/${meta.arquivo}`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((d) => { setCourse(d); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })
  }, [id, cursos])

  return { course, loading, error }
}

// ── rota por hash (sem react-router): #/curso/<id> ──────────────────────────
function parseHash() {
  const m = window.location.hash.match(/^#\/curso\/(.+)$/)
  return m ? decodeURIComponent(m[1]) : null
}

// ═══════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  const { manifest, error: manifestError } = useCoursesManifest()
  const [cursoAberto, setCursoAberto] = useState(() => parseHash())

  useEffect(() => {
    const on = () => setCursoAberto(parseHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  useEffect(() => { window.scrollTo(0, 0) }, [cursoAberto])

  const abrir = (id) => { window.location.hash = id ? `#/curso/${id}` : '' }

  const cursos = manifest?.cursos
  const { course, loading, error } = useCourse(cursoAberto, cursos)

  if (manifestError) return (
    <div className="app-loading"><div><span className="ic">⚠</span>Não foi possível carregar as aulas: {manifestError}</div></div>
  )
  if (!manifest) return (
    <div className="app-loading"><div><span className="ic">✦</span>Carregando…</div></div>
  )

  const existe = cursoAberto && cursos.some((c) => c.id === cursoAberto)

  return (
    <AnimatePresence mode="wait">
      {!existe ? (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <CoursePicker
            cursos={cursos}
            onSelect={abrir}
            appNome={manifest.app?.nome}
            appSub={manifest.app?.subtitulo}
          />
        </motion.div>
      ) : (
        <motion.div
          key={cursoAberto}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button type="button" className="voltar-aulas" onClick={() => abrir(null)}>
            ‹ Aulas
          </button>
          {loading && (
            <div className="app-loading"><div><span className="ic">✦</span>Carregando aula…</div></div>
          )}
          {error && (
            <div className="app-loading"><div><span className="ic">⚠</span>Erro: {error}</div></div>
          )}
          {course && <CursoLeitura course={course} />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
