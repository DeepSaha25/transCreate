import { useCallback, useRef, useState, useEffect } from 'react'

interface UseSpeechReturn {
  speak: (text: string, lang?: string, voiceURI?: string) => void
  stop: () => void
  isSpeaking: () => boolean
  voices: SpeechSynthesisVoice[]
}

export function useSpeech(): UseSpeechReturn {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (!window.speechSynthesis) return
    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices())
    }
    updateVoices() // initial load
    window.speechSynthesis.onvoiceschanged = updateVoices
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const speak = useCallback((text: string, lang = 'en-US', voiceURI?: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.95
    utterance.pitch = 1

    if (voiceURI) {
      // Refresh voices from window in case state is stale
      const availableVoices = window.speechSynthesis.getVoices()
      const selected = availableVoices.find(v => v.voiceURI === voiceURI)
      if (selected) {
        utterance.voice = selected
      }
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  const isSpeaking = useCallback(() => {
    return window.speechSynthesis?.speaking ?? false
  }, [])

  return { speak, stop, isSpeaking, voices }
}
