import { useState, useCallback } from 'react'
import { Loader, Globe, Sparkles } from 'lucide-react'
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

  return (
    <div className="compare-view">
      {/* Left: Line picker + Culture selector */}
      <div className="compare-sidebar">
        <div className="compare-sidebar__section">
          <h3 className="compare-sidebar__heading">Select Line</h3>
          <div className="compare-sidebar__lines">
            {originalLines.map(line => (
              <button
                key={line.id}
                className={`compare-line-btn ${selectedLine?.id === line.id ? 'compare-line-btn--active' : ''}`}
                onClick={() => { setSelectedLine(line); setResults(new Map()) }}
              >
                <span className="compare-line-btn__index">{String(line.index).padStart(2, '0')}</span>
                <span className="compare-line-btn__text">{line.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="compare-sidebar__section">
          <h3 className="compare-sidebar__heading">Target Cultures</h3>
          <div className="compare-sidebar__cultures">
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
        </div>

        <button
          className="btn btn-primary compare-sidebar__go"
          onClick={handleCompare}
          disabled={!selectedLine || targetCultures.length === 0 || isComparing}
        >
          {isComparing ? <Loader size={14} className="spin" /> : <Sparkles size={14} />}
          {isComparing ? 'Comparing...' : 'Compare Cultures'}
        </button>
      </div>

      {/* Right: Comparison grid */}
      <div className="compare-results">
        {selectedLine && (
          <div className="compare-original">
            <div className="compare-original__label">Original ({sourceCulture})</div>
            <div className="compare-original__text">"{selectedLine.text}"</div>
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
    </div>
  )
}
