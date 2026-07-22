import { Play, Loader } from 'lucide-react'
import type { TranscreatedLine, ScriptLine } from '../../types/transcript'
import './LineCard.css'

interface Props {
  line: TranscreatedLine | null
  originalLine: ScriptLine
  isSelected: boolean
  onClick: () => void
  onSpeak: () => void
}

export default function LineCard({ line, originalLine, isSelected, onClick, onSpeak }: Props) {
  // Nothing transcreated yet
  if (!line) {
    return (
      <div className="lc lc--empty" onClick={onClick}>
        <span className="lc__num">{String(originalLine.index).padStart(2, '0')}</span>
        <span className="lc__placeholder">—</span>
      </div>
    )
  }

  // Loading / shimmer state
  if (line.isLoading) {
    return (
      <div className="lc lc--loading">
        <span className="lc__num">{String(line.index).padStart(2, '0')}</span>
        <div className="lc__shimmer-wrap">
          <div className="lc__shimmer lc__shimmer--lg" />
          <div className="lc__shimmer lc__shimmer--sm" />
        </div>
        <Loader size={13} className="spin lc__spinner" />
      </div>
    )
  }

  return (
    <div
      className={`lc ${isSelected ? 'lc--selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <span className="lc__num">{String(line.index).padStart(2, '0')}</span>

      <div className="lc__body">
        <span className="lc__time">{line.startTime} — {line.endTime}</span>

        {/* Main transcreated text */}
        <p className="lc__text">{line.transcreatedText}</p>

        {/* Metadata row */}
        <div className="lc__meta">
          <span className={`lc__conf lc__conf--${line.confidence}`}>{line.confidence}</span>
          <span className="lc__emotion">{line.emotionTag}</span>
        </div>
      </div>

      {/* Play button — only visible on hover */}
      <div className="lc__actions" onClick={e => e.stopPropagation()}>
        <button
          className="lc__play"
          onClick={onSpeak}
          title="Preview pronunciation"
          aria-label="Play pronunciation"
        >
          <Play size={11} />
        </button>
      </div>
    </div>
  )
}
