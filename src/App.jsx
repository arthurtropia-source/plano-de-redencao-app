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
// GAVETA DE NAVEGAÇÃO
// ═══════════════════════════════════════════════════════════════════════════

function GavetaNavegacao({ estacoes, aberta, onClose, onSelect }) {
  const main  = estacoes.slice(0, MAIN_COUNT)
  const ramos = estacoes.slice(MAIN_COUNT)

  useEffect(() => {
    if (!aberta) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [aberta, onClose])

  useEffect(() => {
    document.body.style.overflow = aberta ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [aberta])

  return (
    <AnimatePresence>
      {aberta && (
        <>
          <motion.div
            className="gav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="gav"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <div className="gav-cab">
              <div className="gav-titulo">Estações</div>
              <button className="bf" onClick={onClose}>✕</button>
            </div>
            <div className="gav-lista">
              {main.map(est => (
                <div
                  key={est.id}
                  className={`lv-item ${classeNo(est)}`}
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
              <div className="lv-bif">
                <div className="lv-bif-line" />
                <div className="lv-bif-label">⟶ escolha</div>
                <div className="lv-bif-line" style={{ background: 'linear-gradient(90deg, transparent, var(--o))' }} />
              </div>
              {ramos.map(est => (
                <div
                  key={est.id}
                  className={`lv-item ${classeNo(est)}`}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
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

function BotoesFlutuantes({ mode, onModeChange, onOpenNav }) {
  return (
    <div className="bfl">
      <button className="bfl-item" onClick={onOpenNav}>
        <span>☰</span> Estações
      </button>
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
  const [gavetaAberta,  setGavetaAberta]  = useState(false)

  const handleSelectEstacao = (id) => {
    clearPanelMode()
    setEstacaoAberta(id)
    setGavetaAberta(false)
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
                <div className="ph-tx">Selecione uma estação</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Gaveta de navegação ── */}
      <GavetaNavegacao
        estacoes={estacoes}
        aberta={gavetaAberta}
        onClose={() => setGavetaAberta(false)}
        onSelect={handleSelectEstacao}
      />

      {/* ── Botões flutuantes ── */}
      <BotoesFlutuantes
        mode={effectiveMode}
        onModeChange={setGlobalMode}
        onOpenNav={() => setGavetaAberta(true)}
      />

      {/* ── Footer ── */}
      <footer>Plano de Redenção · Pastor Ricardo · Baseado exclusivamente no material do curso</footer>
    </>
  )
}
