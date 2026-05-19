import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════

function useTimelineData() {
  const [estacoes, setEstacoes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    fetch('/data/timeline.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => { setEstacoes(d.estacoes); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  return { estacoes, loading, error }
}

function useViewMode() {
  const [globalMode, setGlobalModeState] = useState('resumido')
  const [panelMode,  setPanelMode]       = useState(null)   // override local do painel
  const manualRef = useRef(false)

  useEffect(() => {
    const isPhone = window.matchMedia('(max-width: 768px)').matches
    if (!isPhone) return

    const mq = window.matchMedia('(orientation: landscape)')

    const handler = (e) => {
      // Girar o telefone sempre limpa o override manual
      manualRef.current = false
      setPanelMode(null)
      setGlobalModeState(e.matches ? 'detalhado' : 'resumido')
    }

    setGlobalModeState(mq.matches ? 'detalhado' : 'resumido')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const setGlobalMode = (newMode) => {
    manualRef.current = true
    setGlobalModeState(newMode)
    setPanelMode(null)   // toggle global sobrepõe override do painel
  }

  const setLocalPanelMode = (newMode) => {
    manualRef.current = true
    setPanelMode(newMode)
  }

  const clearPanelMode = () => setPanelMode(null)

  const effectiveMode = panelMode ?? globalMode

  return { effectiveMode, globalMode, setGlobalMode, setLocalPanelMode, clearPanelMode }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const MAIN_COUNT = 12   // criacao…batismo
const CLASSE_MAP = { q: 'q', es: 'es', vi: 'vi', mo: 'mo' }

function classeNo(est) {
  return est.classe_no ? CLASSE_MAP[est.classe_no] || '' : ''
}

// ═══════════════════════════════════════════════════════════════════════════
// LINHA HORIZONTAL (desktop / tablet / landscape)
// ═══════════════════════════════════════════════════════════════════════════

function LinhaHorizontal({ estacoes, aberta, onSelect }) {
  const main   = estacoes.slice(0, MAIN_COUNT)
  const ramos  = estacoes.slice(MAIN_COUNT)          // vida-eterna, morte-eterna

  return (
    <div className="lw">
      <div className="lc">
        {main.map((est, i) => (
          <span key={est.id} style={{ display: 'contents' }}>
            <div
              className={`no ${classeNo(est)} ${aberta === est.id ? 'ativo' : ''}`}
              onClick={() => onSelect(est.id)}
            >
              <div className="no-c">{est.icone}</div>
              <div className="no-lb">{est.nome_curto}</div>
              <div className="no-rf">{est.referencia_curta}</div>
            </div>
            {i < main.length - 1 && <div className="con" />}
          </span>
        ))}

        {/* Bifurcação */}
        <div className="sf">⟶</div>

        {ramos.map((est, i) => (
          <span key={est.id} style={{ display: 'contents' }}>
            <div
              className={`no ${classeNo(est)} ${aberta === est.id ? 'ativo' : ''}`}
              onClick={() => onSelect(est.id)}
            >
              <div className="no-c">{est.icone}</div>
              <div className="no-lb">{est.nome_curto}</div>
              <div className="no-rf">{est.referencia_curta}</div>
            </div>
            {i < ramos.length - 1 && <div className="con" />}
          </span>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LINHA VERTICAL (phone portrait)
// ═══════════════════════════════════════════════════════════════════════════

function LinhaVertical({ estacoes, aberta, onSelect }) {
  const main  = estacoes.slice(0, MAIN_COUNT)
  const ramos = estacoes.slice(MAIN_COUNT)

  return (
    <div className="lv">
      {main.map(est => (
        <div
          key={est.id}
          className={`lv-item ${classeNo(est)} ${aberta === est.id ? 'ativo' : ''}`}
          onClick={() => onSelect(est.id)}
        >
          <div className="lv-ic">{est.icone}</div>
          <div className="lv-txt">
            <div className="lv-nm">{est.nome_curto}</div>
            <div className="lv-rf">{est.referencia_curta}</div>
          </div>
          <div className="lv-seta">›</div>
        </div>
      ))}

      {/* Separador de bifurcação */}
      <div className="lv-bif">
        <div className="lv-bif-line" />
        <div className="lv-bif-label">⟶ escolha</div>
        <div className="lv-bif-line" style={{ background: 'linear-gradient(90deg, transparent, var(--o))' }} />
      </div>

      {ramos.map(est => (
        <div
          key={est.id}
          className={`lv-item ${classeNo(est)} ${aberta === est.id ? 'ativo' : ''}`}
          onClick={() => onSelect(est.id)}
        >
          <div className="lv-ic">{est.icone}</div>
          <div className="lv-txt">
            <div className="lv-nm">{est.nome_curto}</div>
            <div className="lv-rf">{est.referencia_curta}</div>
          </div>
          <div className="lv-seta">›</div>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PAINEL DE DETALHE
// ═══════════════════════════════════════════════════════════════════════════

function PainelDetalhe({ estacao, mode, onModeChange, onClose }) {
  const isDetalhado = mode === 'detalhado'
  const html        = isDetalhado ? estacao.detalhado_html : estacao.resumido_html
  const contentRef  = useRef(null)

  // Scroll para o topo do conteúdo ao mudar de modo ou de estação
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [estacao.id, mode])

  return (
    <motion.div
      className="pw"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className="painel">
        <div className="p-cabec">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="p-titulo">{estacao.titulo_painel}</div>
            <div className="p-sub">{estacao.subtitulo_painel}</div>
          </div>
          <div className="p-dir">
            <button
              className={`bn ${!isDetalhado ? 'at' : ''}`}
              onClick={() => onModeChange('resumido')}
            >
              Resumido
            </button>
            <button
              className={`bn ${isDetalhado ? 'at' : ''}`}
              onClick={() => onModeChange('detalhado')}
            >
              Detalhado
            </button>
            <button className="bf" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Conteúdo HTML do JSON — classes v3 aplicadas via v3-classes.css */}
        <div ref={contentRef} className="painel-content" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// BOTÕES FLUTUANTES
// ═══════════════════════════════════════════════════════════════════════════

function BotoesFlutuantes({ mode, onModeChange }) {
  return (
    <div className="bfl">
      <button
        className={`bfl-item ${mode === 'resumido' ? 'at' : ''}`}
        onClick={() => onModeChange('resumido')}
      >
        <span>◈</span> Resumido
      </button>
      <button
        className={`bfl-item ${mode === 'detalhado' ? 'at' : ''}`}
        onClick={() => onModeChange('detalhado')}
      >
        <span>◉</span> Detalhado
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  const { estacoes, loading, error } = useTimelineData()
  const {
    effectiveMode, globalMode,
    setGlobalMode, setLocalPanelMode, clearPanelMode
  } = useViewMode()

  const [estacaoAberta, setEstacaoAberta] = useState(null)

  // Detecta portrait em phone para decidir layout da linha
  const [isPhonePortrait, setIsPhonePortrait] = useState(() => {
    if (typeof window === 'undefined') return false
    const phone = window.matchMedia('(max-width: 768px)').matches
    const portrait = window.matchMedia('(orientation: portrait)').matches
    return phone && portrait
  })

  useEffect(() => {
    const phoneQ   = window.matchMedia('(max-width: 768px)')
    const orientQ  = window.matchMedia('(orientation: portrait)')

    const update = () => setIsPhonePortrait(phoneQ.matches && orientQ.matches)

    phoneQ.addEventListener('change', update)
    orientQ.addEventListener('change', update)
    return () => {
      phoneQ.removeEventListener('change', update)
      orientQ.removeEventListener('change', update)
    }
  }, [])

  const handleSelectEstacao = (id) => {
    clearPanelMode()                // novo painel herda modo global
    setEstacaoAberta(id)
    // Scroll suave para o painel
    setTimeout(() => {
      document.getElementById('painel-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 80)
  }

  const handleClosePanel = () => {
    setEstacaoAberta(null)
    clearPanelMode()
  }

  const estacaoAtiva = estacoes.find(e => e.id === estacaoAberta)

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="placeholder">
        <div className="ph-ic">✦</div>
        <div className="ph-tx">Carregando...</div>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="placeholder">
        <div className="ph-ic">⚠</div>
        <div className="ph-tx">Erro: {error}</div>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Header ── */}
      <header>
        <div className="t-principal">Plano de Redenção</div>
        <div className="orn">
          <div className="orn-l" />
          <div className="orn-s">✦</div>
          <div className="orn-l" />
        </div>
        <div className="t-sub">De Gênesis ao Apocalipse · Pastor Ricardo</div>
      </header>

      {/* ── Toggle global ── */}
      <div className="tg-bar">
        <span className="tg-label">Resumido</span>
        <label className="tg-sw">
          <input
            type="checkbox"
            checked={globalMode === 'detalhado'}
            onChange={e => setGlobalMode(e.target.checked ? 'detalhado' : 'resumido')}
          />
          <div className="tg-track" />
          <div className="tg-thumb" />
        </label>
        <span className="tg-label">Detalhado</span>
        <span className="tg-hint">(fixar todas as abas)</span>
      </div>

      {/* ── Instrução ── */}
      <div className="instrucao">Clique em qualquer ponto da linha para explorar</div>

      {/* ── Linha do tempo ── */}
      {isPhonePortrait
        ? <LinhaVertical   estacoes={estacoes} aberta={estacaoAberta} onSelect={handleSelectEstacao} />
        : <LinhaHorizontal estacoes={estacoes} aberta={estacaoAberta} onSelect={handleSelectEstacao} />
      }

      {/* ── Painel de detalhe ── */}
      <div id="painel-wrapper">
        <AnimatePresence mode="wait">
          {estacaoAtiva && (
            <PainelDetalhe
              key={estacaoAtiva.id}
              estacao={estacaoAtiva}
              mode={effectiveMode}
              onModeChange={setLocalPanelMode}
              onClose={handleClosePanel}
            />
          )}
        </AnimatePresence>

        {!estacaoAtiva && (
          <div className="pw">
            <div className="painel">
              <div className="placeholder" id="ph">
                <div className="ph-ic">✦</div>
                <div className="ph-tx">Selecione um ponto da linha</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Botões flutuantes ── */}
      <BotoesFlutuantes mode={effectiveMode} onModeChange={setGlobalMode} />

      {/* ── Footer ── */}
      <footer>Plano de Redenção · Pastor Ricardo · Baseado exclusivamente no material do curso</footer>
    </>
  )
}
