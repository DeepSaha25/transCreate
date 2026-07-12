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
    <div className="glossary-view">
      {/* Header */}
      <div className="glossary-header">
        <div className="glossary-header__left">
          <BookOpen size={20} />
          <div>
            <h2 className="glossary-header__title">Cultural Glossary Generator</h2>
            <p className="glossary-header__desc">
              Auto-extract culturally specific terms from your script and see how each adapts across cultures.
            </p>
          </div>
        </div>
        <div className="glossary-header__actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleExport}
            disabled={entries.length === 0}
          >
            <Download size={14} /> Export .MD
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleGenerate}
            disabled={isGenerating || originalLines.length === 0}
          >
            {isGenerating ? <Loader size={14} className="spin" /> : <Sparkles size={14} />}
            {isGenerating ? 'Generating...' : 'Generate Glossary'}
          </button>
        </div>
      </div>

      {/* Target culture selector */}
      <div className="glossary-targets">
        <span className="glossary-targets__label">Adapt for:</span>
        {CULTURES.filter(c => c.key !== sourceCulture).map(c => (
          <label key={c.key} className="glossary-target-chip">
            <input
              type="checkbox"
              checked={selectedTargets.includes(c.key)}
              onChange={() => toggleTarget(c.key)}
            />
            <span>{c.label}</span>
          </label>
        ))}
      </div>

      {/* Entries */}
      {entries.length === 0 && !isGenerating && (
        <div className="glossary-empty">
          <BookOpen size={36} />
          <p>Click "Generate Glossary" to extract culturally specific terms from your script.</p>
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
  )
}
