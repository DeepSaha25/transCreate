import type { TranscreatedLine } from '../types/transcript'

/**
 * Export transcreated lines as an SRT file and trigger browser download
 */
export function exportSrt(lines: TranscreatedLine[], filename = 'transcreated'): void {
  const blocks = lines.map(line => {
    return `${line.index}\n${line.startTime} --> ${line.endTime}\n${line.transcreatedText}`
  })

  const content = blocks.join('\n\n')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.srt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Export as plain text script
 */
export function exportTxt(lines: TranscreatedLine[], filename = 'transcreated'): void {
  const content = lines.map(l => `[${l.startTime}]\n${l.transcreatedText}`).join('\n\n')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
