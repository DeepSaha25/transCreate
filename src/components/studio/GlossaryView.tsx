import { useState, useCallback } from 'react'
import { Loader, BookOpen, Download, Sparkles } from 'lucide-react'
import type { ScriptLine, CultureKey, GlossaryEntry } from '../../types/transcript'
import { CULTURES } from '../../types/transcript'
import { generateGlossary } from '../../services/langchainService'
import './GlossaryView.css'

interface Props {
  originalLines: ScriptLine[]
  sourceCulture: CultureKey
}

const QUICK_TARGETS: CultureKey[] = ['en-US', 'en-GB', 'ja-JP', 'es-MX', 'pt-BR']

export default function GlossaryView({ originalLines, sourceCulture }: Props) {
  const [entries, setEntries] = useState<GlossaryEntry[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTargets, setSelectedTargets] = useState<CultureKey[]>(
    QUICK_TARGETS.filter(c => c !== sourceCulture).slice(0, 3)
  )

  const handleGenerate = useCallback(async () => {
    if (originalLines.length === 0 || selectedTargets.length === 0) return
    setIsGenerating(true)
    setEntries([])
    const result = await generateGlossary(originalLines, sourceCulture, selectedTargets)
    setEntries(result)
    setIsGenerating(false)
  }, [originalLines, sourceCulture, selectedTargets])

  const handleExport = useCallback(() => {
    if (entries.length === 0) return
    let md = `# Cultural Glossary — TransCreate\n\n`
    md += `Source Culture: ${sourceCulture}\n\n`
    entries.forEach(entry => {
      md += `## "${entry.originalTerm}"\n`
      md += `**Meaning:** ${entry.meaning}\n\n`
      md += `| Culture | Adapted | Explanation |\n|---|---|---|\n`
      entry.adaptations.forEach(a => {
        md += `| ${a.culture} | ${a.adapted} | ${a.explanation} |\n`
      })
      md += '\n'
    })

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cultural-glossary.md'
    a.click()
    URL.revokeObjectURL(url)
  }, [entries, sourceCulture])

  const toggleTarget = (key: CultureKey) => {
    setSelectedTargets(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div className="studio-content glossary-results" style={{ flex: 1 }}>
        <div className="compare-header-row">
          <span className="compare-culture-label">Adapt for:</span>
          <div className="compare-cultures-selector">
            {CULTURES.filter(c => c.key !== sourceCulture).map(c => (
              <label key={c.key} className="compare-culture-chip">
                <input
                  type="checkbox"
                  checked={selectedTargets.includes(c.key)}
                  onChange={() => toggleTarget(c.key)}
                />
                <span className="compare-culture-chip__label">{c.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Entries */}
        {entries.length === 0 && !isGenerating && (
          <div className="glossary-empty">
            <BookOpen size={36} />
            <p>Click "Generate Glossary" below to extract culturally specific terms from your script.</p>
          </div>
        )}

        {isGenerating && (
          <div className="glossary-loading">
            <Loader size={24} className="spin" />
            <p>Analyzing your script for culturally specific terms...</p>
          </div>
        )}

        <div className="glossary-entries">
          {entries.map((entry, i) => (
            <div key={i} className="glossary-entry">
              <div className="glossary-entry__header">
                <span className="glossary-entry__term">"{entry.originalTerm}"</span>
                <span className="glossary-entry__meaning">{entry.meaning}</span>
              </div>
              <div className="glossary-entry__adaptations">
                {entry.adaptations.map((a, j) => (
                  <div key={j} className="glossary-adaptation">
                    <span className="glossary-adaptation__culture">{a.culture}</span>
                    <span className="glossary-adaptation__adapted">{a.adapted}</span>
                    <span className="glossary-adaptation__explanation">{a.explanation}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="studio-bottom-bar">
        <div className="bottom-bar__left">
          {/* Empty left area to balance the bar */}
        </div>

        <div className="bottom-bar__center">
          <button
            className="bottom-bar__btn bottom-bar__btn--primary"
            onClick={handleGenerate}
            disabled={isGenerating || originalLines.length === 0}
            style={{ padding: '8px 24px', fontSize: 'var(--text-sm)' }}
          >
            {isGenerating ? <Loader size={14} className="spin" /> : <Sparkles size={14} />}
            {isGenerating ? 'Generating...' : 'Generate Glossary'}
          </button>
        </div>

        <div className="bottom-bar__right">
          <button
            className="bottom-bar__btn bottom-bar__btn--ghost"
            onClick={handleExport}
            disabled={entries.length === 0}
          >
            <Download size={13} /> Export .MD
          </button>
        </div>
      </div>
    </div>
  )
}
