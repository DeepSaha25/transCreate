import { useState, useCallback, useRef } from 'react'
import { Download, Square, Upload, ChevronRight, Loader, Shield, RefreshCw } from 'lucide-react'
import Navbar, { type StudioTab } from '../components/shared/Navbar'
import { CULTURES, type CultureKey, type ScriptLine, type TranscreatedLine, type CulturalRisk } from '../types/transcript'
import { parseSrt, parseTxt } from '../utils/fileParser'
import { exportSrt } from '../utils/exportFile'
import { transcreateLines, scanCulturalRisks, retranscreateOne } from '../services/langchainService'
import { useSpeech } from '../hooks/useSpeech'
import RationaleDrawer from '../components/studio/RationaleDrawer'
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
  const [statusText, setStatusText] = useState('Upload a script or subtitle file to begin')
  const [fileName, setFileName] = useState<string | null>(null)
  const abortRef = useRef(false)
  const { speak, stop } = useSpeech()

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
      setStatusText(`${lines.length} lines loaded — ready to transcreate`)
    }
    reader.readAsText(file)
  }, [])

  const handleTranscreate = useCallback(async () => {
    if (originalLines.length === 0 || isProcessing) return
    abortRef.current = false
    setIsProcessing(true)
    setTranscreated(new Map())
    setStatusText(`Transcreating ${originalLines.length} lines via IBM Granite...`)

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
      setTranscreated(prev => {
        const next = new Map(prev)
        next.set(line.id, line)
        return next
      })
      setStatusText(`Transcreated line ${line.index} of ${originalLines.length}`)
    })

    setIsProcessing(false)
    setStatusText('Transcreation complete — review and export')
  }, [originalLines, sourceCulture, targetCulture, isProcessing])

  const handleStop = useCallback(() => {
    abortRef.current = true
    setIsProcessing(false)
    setStatusText('Stopped. Partial results available.')
  }, [])

  const handleExport = useCallback(() => {
    const lines = Array.from(transcreated.values()).filter(l => !l.isLoading && l.transcreatedText)
    if (lines.length === 0) return
    exportSrt(lines, fileName?.replace(/\.[^.]+$/, '') ?? 'transcreated')
  }, [transcreated, fileName])

  // Cultural Risk Scan
  const handleRiskScan = useCallback(async () => {
    if (originalLines.length === 0 || isScanning) return
    setIsScanning(true)
    setRisks(new Map())
    setStatusText('Scanning for cultural risk...')

    await scanCulturalRisks(originalLines, sourceCulture, (risk) => {
      setRisks(prev => {
        const next = new Map(prev)
        next.set(risk.lineId, risk)
        return next
      })
    })

    setIsScanning(false)
    setStatusText('Risk scan complete')
  }, [originalLines, sourceCulture, isScanning])

  // Inline re-transcreate
  const handleRetranscreate = useCallback(async (lineId: string) => {
    const original = originalLines.find(l => l.id === lineId)
    if (!original) return

    setTranscreated(prev => {
      const next = new Map(prev)
      const existing = next.get(lineId)
      if (existing) next.set(lineId, { ...existing, isLoading: true })
      return next
    })

    const result = await retranscreateOne(original, sourceCulture, targetCulture, editText || undefined)
    setTranscreated(prev => {
      const next = new Map(prev)
      next.set(lineId, result)
      return next
    })
    setEditingLineId(null)
    setEditText('')
  }, [originalLines, sourceCulture, targetCulture, editText])

  const selectedLine = selectedLineId ? transcreated.get(selectedLineId) ?? null : null
  const completedCount = Array.from(transcreated.values()).filter(l => !l.isLoading && l.transcreatedText).length
  const hasScript = originalLines.length > 0

  const getRiskClass = (lineId: string) => {
    const risk = risks.get(lineId)
    if (!risk) return ''
    if (risk.risk === 'critical') return 'risk-critical'
    if (risk.risk === 'caution') return 'risk-caution'
    return 'risk-safe'
  }

  return (
    <div className="studio">
      <Navbar studioTab={activeTab} onTabChange={setActiveTab} hasScript={hasScript} />

      {/* ── Toolbar (only in editor) ── */}
      {activeTab === 'editor' && (
        <div className="studio-toolbar">
          <div className="studio-toolbar__left">
            <div className="culture-select-wrap">
              <label className="culture-select-wrap__label" htmlFor="source-culture">Source</label>
              <select
                id="source-culture" className="select"
                value={sourceCulture}
                onChange={e => setSourceCulture(e.target.value as CultureKey)}
                disabled={isProcessing}
              >
                {CULTURES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>

            <ChevronRight size={16} color="var(--text-faint)" />

            <div className="culture-select-wrap">
              <label className="culture-select-wrap__label" htmlFor="target-culture">Target</label>
              <select
                id="target-culture" className="select"
                value={targetCulture}
                onChange={e => setTargetCulture(e.target.value as CultureKey)}
                disabled={isProcessing}
              >
                {CULTURES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="studio-toolbar__right">
            {/* Risk Scan button */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleRiskScan}
              disabled={!hasScript || isScanning}
              title="Scan for cultural risk"
            >
              {isScanning ? <Loader size={14} className="spin" /> : <Shield size={14} />}
              Risk Scan
            </button>

            {isProcessing ? (
              <button className="btn btn-ghost btn-sm" onClick={handleStop} id="stop-btn">
                <Square size={14} /> Stop
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleTranscreate}
                disabled={originalLines.length === 0}
                id="transcreate-btn"
              >
                Transcreate All
              </button>
            )}
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleExport}
              disabled={completedCount === 0}
              id="export-btn"
            >
              <Download size={14} /> Export .SRT
            </button>
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className="studio-body">
        {/* EDITOR TAB */}
        {activeTab === 'editor' && (
          <>
            {originalLines.length === 0 ? (
              <UploadZone onFileUpload={handleFileUpload} />
            ) : (
              <>
                {/* Left: Original */}
                <div className="studio-panel studio-panel--original">
                  <div className="studio-panel__header">
                    <span className="studio-panel__title">Original Script</span>
                    <span className="badge badge-muted">{originalLines.length} lines</span>
                    {risks.size > 0 && (
                      <span className="badge badge-amber">{risks.size} scanned</span>
                    )}
                    <button
                      className="btn btn-ghost btn-sm studio-panel__reupload"
                      onClick={() => { setOriginalLines([]); setTranscreated(new Map()); setRisks(new Map()); setFileName(null) }}
                      id="reupload-btn"
                    >
                      <Upload size={12} /> Replace
                    </button>
                  </div>
                  <div className="studio-panel__lines">
                    {originalLines.map(line => {
                      const risk = risks.get(line.id)
                      return (
                        <div
                          key={line.id}
                          className={`original-line ${selectedLineId === line.id ? 'original-line--selected' : ''} ${getRiskClass(line.id)}`}
                          onClick={() => setSelectedLineId(line.id)}
                          role="button" tabIndex={0}
                          onKeyDown={e => e.key === 'Enter' && setSelectedLineId(line.id)}
                        >
                          <span className="original-line__index">{String(line.index).padStart(2, '0')}</span>
                          <div className="original-line__body">
                            <span className="original-line__time">{line.startTime} → {line.endTime}</span>
                            <span className="original-line__text">{line.text}</span>
                            {risk && (
                              <div className="original-line__risk">
                                <span className={`risk-badge risk-badge--${risk.risk}`}>{risk.risk}</span>
                                <span className="risk-reason">{risk.reason}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Right: Transcreated */}
                <div className="studio-panel studio-panel--transcreated">
                  <div className="studio-panel__header">
                    <span className="studio-panel__title">Transcreated</span>
                    {isProcessing && (
                      <span className="badge badge-amber processing-badge">
                        <Loader size={10} className="spin" /> Processing
                      </span>
                    )}
                    {!isProcessing && completedCount > 0 && (
                      <span className="badge badge-green">{completedCount}/{originalLines.length} done</span>
                    )}
                  </div>
                  <div className="studio-panel__lines">
                    {originalLines.map(line => {
                      const tc = transcreated.get(line.id)
                      const isEditing = editingLineId === line.id
                      return (
                        <div key={line.id}>
                          <LineCard
                            line={tc ?? null}
                            originalLine={line}
                            isSelected={selectedLineId === line.id}
                            onClick={() => setSelectedLineId(line.id)}
                            onSpeak={() => tc && speak(tc.transcreatedText, targetCulture)}
                            onSpeakStop={stop}
                          />
                          {/* Inline edit controls */}
                          {tc && !tc.isLoading && tc.transcreatedText && (
                            <div className="inline-edit-bar">
                              {isEditing ? (
                                <div className="inline-edit-form">
                                  <input
                                    className="inline-edit-input"
                                    value={editText}
                                    onChange={e => setEditText(e.target.value)}
                                    placeholder="Guide the AI: e.g. 'make it funnier' or 'more formal'"
                                    autoFocus
                                    onKeyDown={e => e.key === 'Enter' && handleRetranscreate(line.id)}
                                  />
                                  <button
                                    className="btn btn-primary btn-xs"
                                    onClick={() => handleRetranscreate(line.id)}
                                  >
                                    <RefreshCw size={10} /> Refine
                                  </button>
                                  <button
                                    className="btn btn-ghost btn-xs"
                                    onClick={() => { setEditingLineId(null); setEditText('') }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="inline-edit-trigger"
                                  onClick={(e) => { e.stopPropagation(); setEditingLineId(line.id); setEditText('') }}
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
              </>
            )}

            {selectedLine && (
              <RationaleDrawer line={selectedLine} onClose={() => setSelectedLineId(null)} />
            )}
          </>
        )}

        {/* COMPARE TAB */}
        {activeTab === 'compare' && hasScript && (
          <CompareView originalLines={originalLines} sourceCulture={sourceCulture} />
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <AnalyticsView originalLines={originalLines} transcreated={transcreated} risks={risks} />
        )}

        {/* GLOSSARY TAB */}
        {activeTab === 'glossary' && hasScript && (
          <GlossaryView originalLines={originalLines} sourceCulture={sourceCulture} />
        )}
      </div>

      {/* ── Status Bar ── */}
      <div className="studio-statusbar">
        <div className="studio-statusbar__left">
          <span className="studio-statusbar__dot" data-active={isProcessing || isScanning} />
          <span className="studio-statusbar__text">{statusText}</span>
        </div>
        <div className="studio-statusbar__right">
          {fileName && <span className="studio-statusbar__file">{fileName}</span>}
          <span className="studio-statusbar__engine">IBM Granite 3.1 · LangChain</span>
        </div>
      </div>
    </div>
  )
}
