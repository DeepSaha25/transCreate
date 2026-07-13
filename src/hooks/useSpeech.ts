import { useCallback, useRef } from 'react'

interface UseSpeechReturn {
  speak: (text: string, lang?: string) => void
  stop: () => void
  isSpeaking: () => boolean
}

export function useSpeech(): UseSpeechReturn {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback((text: string, lang = 'en-US') => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.95
    utterance.pitch = 1
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  const isSpeaking = useCallback(() => {
    return window.speechSynthesis?.speaking ?? false
  }, [])

  return { speak, stop, isSpeaking }
}
