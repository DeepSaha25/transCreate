import { useState, useCallback, useRef, useEffect } from 'react'
import { Download, Square, Upload, Loader, Shield, RefreshCw, ChevronRight } from 'lucide-react'
import Navbar, { type StudioTab } from '../components/shared/Navbar'
import { CULTURES, type CultureKey, type ScriptLine, type TranscreatedLine, type CulturalRisk } from '../types/transcript'
import { parseSrt, parseTxt } from '../utils/fileParser'
import { exportSrt } from '../utils/exportFile'
import { transcreateLines, scanCulturalRisks, retranscreateOne } from '../services/langchainService'
import { useSpeech } from '../hooks/useSpeech'
import LineCard from '../components/studio/LineCard'
import UploadZone from '../components/studio/UploadZone'
import CompareView from '../components/studio/CompareView'
import AnalyticsView from '../components/studio/AnalyticsView'
import GlossaryView from '../components/studio/GlossaryView'
import './Studio.css'

export default function Studio() {
  const [activeTab, setActiveTab] = useState<StudioTab>('editor')
  const [originalLines, setOriginalLines] = useState<ScriptLine[]>([])
  const [transcreated, setTranscreated] = useState<Map<string, TranscreatedLine>>(new Map())
  const [risks, setRisks] = useState<Map<string, CulturalRisk>>(new Map())
  const [sourceCulture, setSourceCulture] = useState<CultureKey>('hi-IN')
  const [targetCulture, setTargetCulture] = useState<CultureKey>('en-US')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null)
  const [editingLineId, setEditingLineId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [statusText, setStatusText] = useState('Ready')
  const [fileName, setFileName] = useState<string | null>(null)
  const abortRef = useRef(false)
  const { speak, voices } = useSpeech()
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('')

  // Automatically reset the voice selection if the target culture changes
  useEffect(() => {
    setSelectedVoiceURI('')
  }, [targetCulture])

  // Filter voices that loosely match the target culture (e.g. 'en' for 'en-US' or 'en-GB')
  const availableVoices = voices.filter(v => v.lang.startsWith(targetCulture.split('-')[0]))

  const hasScript = originalLines.length > 0
  const completedCount = Array.from(transcreated.values()).filter(l => !l.isLoading && l.transcreatedText).length
  const selectedLine = selectedLineId ? transcreated.get(selectedLineId) ?? null : null

  const handleFileUpload = useCallback((file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const lines = ext === 'srt' || ext === 'vtt' ? parseSrt(content) : parseTxt(content)
      setOriginalLines(lines)
      setTranscreated(new Map())
      setRisks(new Map())
      setFileName(file.name)
      setStatusText(`${lines.length} lines loaded`)
    }
    reader.readAsText(file)
  }, [])

  const handleClear = useCallback(() => {
    setOriginalLines([])
    setTranscreated(new Map())
    setRisks(new Map())
    setFileName(null)
    setStatusText('Ready')
    setSelectedLineId(null)
  }, [])

  const handleTranscreate = useCallback(async () => {
    if (!hasScript || isProcessing) return
    abortRef.current = false
    setIsProcessing(true)
    setTranscreated(new Map())
    setStatusText(`Processing ${originalLines.length} lines...`)

    const loadingMap = new Map<string, TranscreatedLine>()
    originalLines.forEach(l => {
      loadingMap.set(l.id, {
        id: l.id, index: l.index, startTime: l.startTime, endTime: l.endTime,
        originalText: l.text, transcreatedText: '', emotionTag: 'neutral',
        pronunciationHint: '', rationale: '', confidence: 'medium', isLoading: true,
      })
    })
    setTranscreated(new Map(loadingMap))

    await transcreateLines(originalLines, sourceCulture, targetCulture, (line) => {
      if (abortRef.current) return
      setTranscreated(prev => { const n = new Map(prev); n.set(line.id, line); return n })
      setStatusText(`${line.index} / ${originalLines.length} lines done`)
    })

    setIsProcessing(false)
    setStatusText('Transcreation complete')
  }, [originalLines, sourceCulture, targetCulture, isProcessing, hasScript])

  const handleStop = useCallback(() => {
    abortRef.current = true
    setIsProcessing(false)
    setStatusText('Stopped')
  }, [])

  const handleExport = useCallback(() => {
    const lines = Array.from(transcreated.values()).filter(l => !l.isLoading && l.transcreatedText)
    if (!lines.length) return
    exportSrt(lines, fileName?.replace(/\.[^.]+$/, '') ?? 'transcreated')
  }, [transcreated, fileName])

  const handleRiskScan = useCallback(async () => {
    if (!hasScript || isScanning) return
    setIsScanning(true)
    setRisks(new Map())
    setStatusText('Scanning for cultural risks...')
    await scanCulturalRisks(originalLines, sourceCulture, (risk) => {
      setRisks(prev => { const n = new Map(prev); n.set(risk.lineId, risk); return n })
    })
    setIsScanning(false)
    setStatusText('Risk scan complete')
  }, [originalLines, sourceCulture, isScanning, hasScript])

  const handleRetranscreate = useCallback(async (lineId: string) => {
    const original = originalLines.find(l => l.id === lineId)
    if (!original) return
    setTranscreated(prev => {
      const n = new Map(prev)
      const ex = n.get(lineId)
      if (ex) n.set(lineId, { ...ex, isLoading: true })
      return n
    })
    const result = await retranscreateOne(original, sourceCulture, targetCulture, editText || undefined)
    setTranscreated(prev => { const n = new Map(prev); n.set(lineId, result); return n })
    setEditingLineId(null)
    setEditText('')
  }, [originalLines, sourceCulture, targetCulture, editText])

  const getRiskClass = (lineId: string) => {
    const r = risks.get(lineId)
    if (!r) return ''
    if (r.risk === 'critical') return 'risk-critical'
    if (r.risk === 'caution') return 'risk-caution'
    return 'risk-safe'
  }

  return (
    <div className="studio">
      <Navbar studioTab={activeTab} onTabChange={setActiveTab} hasScript={hasScript} />

      <div className="studio-body">

        {/* ── EDITOR TAB ── */}
        {activeTab === 'editor' && (
          <div className="studio-editor">

            {/* Full-width content area */}
            <div className="studio-content">
              {!hasScript ? (
                <div className="studio-empty">
                  <UploadZone onFileUpload={handleFileUpload} />
                </div>
              ) : (
                <div className="studio-panels">
                  {/* Blur overlay during processing or scanning */}
                  {(isProcessing || isScanning) && (
                    <div className="studio-panels__overlay">
                      <div className="overlay-status">
                        <Loader size={18} className="spin" color="var(--text-muted)" />
                        <span className="overlay-status__text">
                          {isScanning ? 'Scanning for cultural risks...' : statusText}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="studio-panel">
                    <div className="studio-panel__header">
                      <span className="studio-panel__title">Original</span>
                      <span className="panel-count">{originalLines.length}</span>
                    </div>
                    <div className="studio-panel__scroll">
                      {originalLines.map(line => {
                        const risk = risks.get(line.id)
                        return (
                          <div
                            key={line.id}
                            className={`orig-line ${selectedLineId === line.id ? 'orig-line--active' : ''} ${getRiskClass(line.id)}`}
                            onClick={() => setSelectedLineId(prev => prev === line.id ? null : line.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && setSelectedLineId(line.id)}
                          >
                            <span className="orig-line__num">{String(line.index).padStart(2, '0')}</span>
                            <div className="orig-line__body">
                              <span className="orig-line__time">{line.startTime} — {line.endTime}</span>
                              <p className="orig-line__text">{line.text}</p>
                              {risk && (
                                <div className="orig-line__risk">
                                  <span className={`risk-chip risk-chip--${risk.risk}`}>{risk.risk}</span>
                                  <span className="risk-reason">{risk.reason}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Transcreated */}
                  <div className="studio-panel studio-panel--right">
                    <div className="studio-panel__header">
                      <span className="studio-panel__title">Transcreated</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {availableVoices.length > 0 && (
                          <select 
                            className="voice-select"
                            value={selectedVoiceURI} 
                            onChange={e => setSelectedVoiceURI(e.target.value)}
                            title="Select Voice"
                            style={{ 
                              background: 'var(--bg-elevated)', 
                              color: 'var(--text-secondary)', 
                              border: '1px solid var(--border)', 
                              borderRadius: '4px', 
                              padding: '2px 8px', 
                              fontSize: '11px',
                              maxWidth: '150px'
                            }}
                          >
                            <option value="">Default Voice</option>
                            {availableVoices.map(v => (
                              <option key={v.voiceURI} value={v.voiceURI}>
                                {v.name} ({v.lang})
                              </option>
                            ))}
                          </select>
                        )}
                        {isProcessing && (
                          <span className="panel-status panel-status--processing">
                            <Loader size={11} className="spin" /> Processing
                          </span>
                        )}
                        {!isProcessing && completedCount > 0 && (
                          <span className="panel-count">{completedCount}/{originalLines.length}</span>
                        )}
                      </div>
                    </div>
                    <div className="studio-panel__scroll">
                      {originalLines.map(line => {
                        const tc = transcreated.get(line.id)
                        const isEditing = editingLineId === line.id
                        return (
                          <div key={line.id}>
                            <LineCard
                              line={tc ?? null}
                              originalLine={line}
                              isSelected={selectedLineId === line.id}
                              onClick={() => setSelectedLineId(prev => prev === line.id ? null : line.id)}
                              onSpeak={() => tc && speak(tc.transcreatedText, targetCulture, selectedVoiceURI)}
                            />
                            {tc && !tc.isLoading && tc.transcreatedText && (
                              <div className="retranscreate-bar">
                                {isEditing ? (
                                  <div className="retranscreate-form">
                                    <input
                                      className="retranscreate-input"
                                      value={editText}
                                      onChange={e => setEditText(e.target.value)}
                                      placeholder="Guide the AI — e.g. 'make it more formal'"
                                      autoFocus
                                      onKeyDown={e => e.key === 'Enter' && handleRetranscreate(line.id)}
                                    />
                                    <button className="btn btn-primary btn-sm" onClick={() => handleRetranscreate(line.id)}>
                                      <RefreshCw size={11} /> Refine
                                    </button>
                                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditingLineId(null); setEditText('') }}>
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    className="retranscreate-trigger"
                                    onClick={e => { e.stopPropagation(); setEditingLineId(line.id); setEditText('') }}
                                  >
                                    <RefreshCw size={10} /> Re-transcreate
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Rationale panel — slides in when a line is selected */}
                  {selectedLine && selectedLine.transcreatedText && (
                    <div className="studio-rationale animate-slide-in">
                      <div className="rationale-header">
                        <span className="rationale-header__title">Line Detail</span>
                        <button className="rationale-header__close" onClick={() => setSelectedLineId(null)} aria-label="Close">
                          ✕
                        </button>
                      </div>
                      <div className="rationale-body">
                        <div className="rationale-block">
                          <p className="rationale-block__label">Original</p>
                          <p className="rationale-block__text rationale-block__text--orig">{selectedLine.originalText}</p>
                        </div>
                        <div className="rationale-block">
                          <p className="rationale-block__label">Transcreated</p>
                          <p className="rationale-block__text rationale-block__text--new">{selectedLine.transcreatedText}</p>
                          <div className="rationale-chips">
                            <span className={`conf-chip conf-chip--${selectedLine.confidence}`}>{selectedLine.confidence} confidence</span>
                            <span className="emotion-chip">{selectedLine.emotionTag}</span>
                          </div>
                        </div>
                        {selectedLine.rationale && (
                          <div className="rationale-block">
                            <p className="rationale-block__label">Why this adaptation</p>
                            <p className="rationale-block__body">{selectedLine.rationale}</p>
                          </div>
                        )}
                        {selectedLine.pronunciationHint && (
                          <div className="rationale-block">
                            <p className="rationale-block__label">Pronunciation guide</p>
                            <code className="rationale-block__code">{selectedLine.pronunciationHint}</code>
                          </div>
                        )}
                        <div className="rationale-block">
                          <p className="rationale-block__label">Timing</p>
                          <code className="rationale-block__code">{selectedLine.startTime} — {selectedLine.endTime}</code>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Horizontal bottom bar — spans full width */}
            <div className="studio-bottom-bar">
              <div className="bottom-bar__left">
                <div className="bottom-bar__field">
                  <span className="bottom-bar__label">Source</span>
                  <select
                    className="bottom-bar__select"
                    value={sourceCulture}
                    onChange={(e) => setSourceCulture(e.target.value as CultureKey)}
                  >
                    {CULTURES.map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronRight size={14} className="bottom-bar__separator" />
                  <select
                    className="bottom-bar__select"
                    value={targetCulture}
                    onChange={(e) => setTargetCulture(e.target.value as CultureKey)}
                  >
                    {CULTURES.filter(c => c.key !== sourceCulture).map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {hasScript && completedCount > 0 && (
                  <div className="bottom-bar__progress">
                    <div className="bottom-bar__progress-track">
                      <div
                        className="bottom-bar__progress-bar"
                        style={{ width: `${(completedCount / originalLines.length) * 100}%` }}
                      />
                    </div>
                    <span className="bottom-bar__progress-text">{completedCount}/{originalLines.length}</span>
                  </div>
                )}
              </div>

              <div className="bottom-bar__center">
                <button
                  className="bottom-bar__btn bottom-bar__btn--ghost"
                  onClick={handleRiskScan}
                  disabled={!hasScript || isScanning || isProcessing}
                  id="risk-scan-btn"
                >
                  {isScanning ? <Loader size={13} className="spin" /> : <Shield size={13} />}
                  Risk Scan
                </button>

                {isProcessing ? (
                  <button className="bottom-bar__btn bottom-bar__btn--danger" onClick={handleStop} id="stop-btn">
                    <Square size={13} /> Stop
                  </button>
                ) : (
                  <button
                    className="bottom-bar__btn bottom-bar__btn--primary"
                    onClick={handleTranscreate}
                    disabled={!hasScript}
                    id="transcreate-btn"
                    style={{ padding: '8px 24px', fontSize: 'var(--text-sm)' }}
                  >
                   Transcreate All
                  </button>
                )}
              </div>

              <div className="bottom-bar__right">
                <button
                  className="bottom-bar__btn bottom-bar__btn--ghost"
                  onClick={handleExport}
                  disabled={completedCount === 0}
                  id="export-btn"
                >
                  <Download size={13} /> Export .SRT
                </button>

                {hasScript && (
                  <button
                    className="bottom-bar__btn bottom-bar__btn--ghost"
                    onClick={handleClear}
                    id="clear-btn"
                  >
                    <Upload size={13} /> Replace
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {/* OTHER TABS */}
        {activeTab !== 'editor' && (
          <div className="studio-main">
            {activeTab === 'compare' && hasScript && (
              <CompareView originalLines={originalLines} sourceCulture={sourceCulture} />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsView originalLines={originalLines} transcreated={transcreated} risks={risks} />
            )}
            {activeTab === 'glossary' && hasScript && (
              <GlossaryView originalLines={originalLines} sourceCulture={sourceCulture} />
            )}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="studio-statusbar">
        <div className="statusbar-left">
          <span className={`statusbar-dot ${isProcessing || isScanning ? 'statusbar-dot--active' : ''}`} />
          <span className="statusbar-text">{statusText}</span>
        </div>
        <div className="statusbar-right">
          {fileName && <span className="statusbar-file">{fileName}</span>}
          <span className="statusbar-engine">IBM Granite 3.1</span>
        </div>
      </div>
    </div>
  )
}
