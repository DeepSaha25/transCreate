import { useState, useCallback, useRef } from 'react'
import { Loader, Globe, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ScriptLine, CultureKey, CompareResult } from '../../types/transcript'
import { CULTURES } from '../../types/transcript'
import { compareAcrossCultures } from '../../services/langchainService'
import './CompareView.css'

interface Props {
  originalLines: ScriptLine[]
  sourceCulture: CultureKey
}

const DEFAULT_TARGETS: CultureKey[] = ['en-US', 'en-GB', 'ja-JP', 'es-MX']

export default function CompareView({ originalLines, sourceCulture }: Props) {
  const [selectedLine, setSelectedLine] = useState<ScriptLine | null>(originalLines[0] ?? null)
  const [targetCultures, setTargetCultures] = useState<CultureKey[]>(
    DEFAULT_TARGETS.filter(c => c !== sourceCulture)
  )
  const [results, setResults] = useState<Map<string, CompareResult>>(new Map())
  const [isComparing, setIsComparing] = useState(false)

  const handleCompare = useCallback(async () => {
    if (!selectedLine || targetCultures.length === 0) return
    setIsComparing(true)
    setResults(new Map())

    await compareAcrossCultures(selectedLine, sourceCulture, targetCultures, (key, result) => {
      setResults(prev => {
        const next = new Map(prev)
        next.set(key, result)
        return next
      })
    })
    setIsComparing(false)
  }, [selectedLine, sourceCulture, targetCultures])

  const toggleCulture = (key: CultureKey) => {
    setTargetCultures(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    )
  }

  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="studio-editor">
      <div className="studio-content compare-results">
        <div className="compare-header-row">
          <span className="compare-culture-label">Target Cultures:</span>
          <button className="compare-scroll-btn" onClick={() => scroll('left')}><ChevronLeft size={18} /></button>
          <div className="compare-cultures-selector" ref={scrollRef}>
            {CULTURES.filter(c => c.key !== sourceCulture).map(c => (
              <label key={c.key} className="compare-culture-chip">
                <input
                  type="checkbox"
                  checked={targetCultures.includes(c.key)}
                  onChange={() => toggleCulture(c.key)}
                />
                <span className="compare-culture-chip__label">{c.label}</span>
              </label>
            ))}
          </div>
          <button className="compare-scroll-btn" onClick={() => scroll('right')}><ChevronRight size={18} /></button>
        </div>

        {selectedLine && (
          <div className="compare-original">
            <div className="compare-original__content">
              <span className="compare-original__label">Original ({sourceCulture})</span>
              <div className="compare-original__text">"{selectedLine.text}"</div>
            </div>
            
            <div className="compare-original__actions">
              <select
                className="compare-line-select"
                value={selectedLine.id}
                onChange={e => {
                  const line = originalLines.find(l => l.id === e.target.value)
                  if (line) {
                    setSelectedLine(line)
                    setResults(new Map())
                  }
                }}
              >
                {originalLines.map(line => (
                  <option key={line.id} value={line.id}>
                    Line {String(line.index).padStart(2, '0')}: {line.text.length > 50 ? line.text.substring(0, 50) + '...' : line.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {targetCultures.length === 0 && (
          <div className="compare-empty">Select at least one target culture to compare.</div>
        )}

        <div className="compare-grid">
          {targetCultures.map(key => {
            const result = results.get(key)
            const culture = CULTURES.find(c => c.key === key)
            return (
              <div key={key} className={`compare-card ${result ? 'compare-card--loaded' : ''}`}>
                <div className="compare-card__header">
                  <Globe size={14} />
                  <span className="compare-card__culture">{culture?.label ?? key}</span>
                  <span className="compare-card__native">{culture?.nativeLabel}</span>
                </div>
                <div className="compare-card__body">
                  {isComparing && !result ? (
                    <div className="compare-card__loading">
                      <Loader size={16} className="spin" />
                      <span>Transcreating...</span>
                    </div>
                  ) : result ? (
                    <>
                      <p className="compare-card__text">"{result.text}"</p>
                      <div className="compare-card__meta">
                        <span className="badge badge-amber">{result.emotionTag}</span>
                      </div>
                      <p className="compare-card__rationale">{result.rationale}</p>
                    </>
                  ) : (
                    <div className="compare-card__placeholder">Click "Compare Cultures" to generate</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Horizontal Bottom Bar matching Editor */}
      <div className="studio-bottom-bar">
        <div className="bottom-bar__left">
          {/* Line selector moved to original text box */}
        </div>

        <div className="bottom-bar__center">
          <button
            className="bottom-bar__btn bottom-bar__btn--primary"
            onClick={handleCompare}
            disabled={!selectedLine || targetCultures.length === 0 || isComparing}
            style={{ padding: '8px 24px', fontSize: 'var(--text-sm)' }}
          >
            {isComparing ? <Loader size={14} className="spin" /> : <Sparkles size={14} />}
            {isComparing ? 'Comparing...' : 'Compare Cultures'}
          </button>
        </div>

        <div className="bottom-bar__right">
          {/* Empty right area to balance the bar */}
        </div>
      </div>
    </div>
  )
}
