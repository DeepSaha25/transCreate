import { Play, Square, Loader } from 'lucide-react'
import type { TranscreatedLine, ScriptLine } from '../../types/transcript'
import './LineCard.css'

interface Props {
  line: TranscreatedLine | null
  originalLine: ScriptLine
  isSelected: boolean
  onClick: () => void
  onSpeak: () => void
  onSpeakStop: () => void
}

const CONFIDENCE_BADGE: Record<string, string> = {
  high: 'badge-green',
  medium: 'badge-amber',
  low: 'badge-muted',
}

export default function LineCard({ line, originalLine, isSelected, onClick, onSpeak, onSpeakStop }: Props) {
  if (!line) {
    return (
      <div className="line-card line-card--empty" onClick={onClick}>
        <span className="line-card__index">{String(originalLine.index).padStart(2, '0')}</span>
        <div className="line-card__empty-body">
          <span className="line-card__empty-text">Awaiting transcreation</span>
        </div>
      </div>
    )
  }

  if (line.isLoading) {
    return (
      <div className="line-card line-card--loading" onClick={onClick}>
        <span className="line-card__index">{String(line.index).padStart(2, '0')}</span>
        <div className="line-card__body">
          <div className="line-card__shimmer" />
          <div className="line-card__shimmer line-card__shimmer--short" />
        </div>
        <Loader size={14} className="spin line-card__loader" />
      </div>
    )
  }

  return (
    <div
      className={`line-card ${isSelected ? 'line-card--selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <span className="line-card__index">{String(line.index).padStart(2, '0')}</span>
      <div className="line-card__body">
        <span className="line-card__time">{line.startTime} → {line.endTime}</span>
        <span className="line-card__text">{line.transcreatedText}</span>
        <div className="line-card__meta">
          <span className={`badge ${CONFIDENCE_BADGE[line.confidence]}`}>{line.confidence}</span>
          <span className="line-card__emotion">[{line.emotionTag}]</span>
        </div>
      </div>
      <div className="line-card__actions" onClick={e => e.stopPropagation()}>
        <button
          className="line-card__speak-btn"
          onMouseDown={onSpeak}
          onMouseUp={onSpeakStop}
          onMouseLeave={onSpeakStop}
          title="Preview pronunciation"
          aria-label="Play pronunciation preview"
        >
          <Play size={12} />
        </button>
      </div>
    </div>
  )
}
