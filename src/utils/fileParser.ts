import type { ScriptLine } from '../types/transcript'

/**
 * Parse an SRT subtitle file into ScriptLine array
 */
export function parseSrt(content: string): ScriptLine[] {
  const lines: ScriptLine[] = []
  // Normalize line endings
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  const blocks = normalized.split(/\n{2,}/)

  for (const block of blocks) {
    const parts = block.trim().split('\n')
    if (parts.length < 3) continue

    const index = parseInt(parts[0].trim(), 10)
    if (isNaN(index)) continue

    const timeParts = parts[1]?.split(' --> ')
    if (!timeParts || timeParts.length !== 2) continue

    const startTime = timeParts[0].trim()
    const endTime = timeParts[1].trim()
    const text = parts.slice(2).join(' ').replace(/<[^>]*>/g, '').trim()

    if (!text) continue

    lines.push({
      id: `line-${index}`,
      index,
      startTime,
      endTime,
      text,
    })
  }

  return lines
}

/**
 * Parse a plain text script file (one line per subtitle)
 */
export function parseTxt(content: string): ScriptLine[] {
  const lines: ScriptLine[] = []
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  const parts = normalized.split('\n').filter(l => l.trim().length > 0)

  parts.forEach((text, i) => {
    lines.push({
      id: `line-${i + 1}`,
      index: i + 1,
      startTime: formatTime(i * 4),
      endTime: formatTime(i * 4 + 3),
      text: text.trim(),
    })
  })

  return lines
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${pad(h)}:${pad(m)}:${pad(s)},000`
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}
