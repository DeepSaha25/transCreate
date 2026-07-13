export type EmotionTag =
  | 'neutral'
  | 'warm familiarity'
  | 'dry irony'
  | 'excited'
  | 'tense'
  | 'melancholic'
  | 'comedic'
  | 'reverent'
  | 'confrontational'
  | 'playful'

export type RiskLevel = 'high' | 'medium' | 'low'

export interface ScriptLine {
  id: string
  index: number
  startTime: string
  endTime: string
  text: string
}

export interface TranscreatedLine {
  id: string
  index: number
  startTime: string
  endTime: string
  originalText: string
  transcreatedText: string
  emotionTag: EmotionTag
  pronunciationHint: string
  rationale: string
  confidence: 'high' | 'medium' | 'low'
  isLoading: boolean
  error?: string
}

export type CultureKey =
  | 'hi-IN'   // Hindi – India
  | 'bn-IN'   // Bengali – India
  | 'mr-IN'   // Marathi – India
  | 'ta-IN'   // Tamil – India
  | 'te-IN'   // Telugu – India
  | 'en-US'   // English – USA
  | 'en-GB'   // English – UK
  | 'en-AU'   // English – Australia
  | 'es-MX'   // Spanish – Mexico
  | 'es-ES'   // Spanish – Spain
  | 'pt-BR'   // Portuguese – Brazil
  | 'fr-FR'   // French – France
  | 'de-DE'   // German – Germany
  | 'ja-JP'   // Japanese – Japan
  | 'ko-KR'   // Korean – South Korea
  | 'zh-CN'   // Chinese – Mainland
  | 'ar-EG'   // Arabic – Egypt
  | 'ru-RU'   // Russian
  | 'it-IT'   // Italian
  | 'tr-TR'   // Turkish

export interface CultureOption {
  key: CultureKey
  label: string
  nativeLabel: string
  region: string
}

export type CulturalRiskLevel = 'critical' | 'caution' | 'safe'

export interface CulturalRisk {
  lineId: string
  risk: CulturalRiskLevel
  reason: string
  flaggedTerms: string[]
}

export interface CompareResult {
  cultureKey: CultureKey
  cultureLabel: string
  text: string
  emotionTag: EmotionTag
  rationale: string
}

export interface GlossaryEntry {
  originalTerm: string
  meaning: string
  adaptations: { culture: string; adapted: string; explanation: string }[]
}

export interface AnalyticsData {
  totalLines: number
  completedLines: number
  avgConfidence: number
  emotionDistribution: Record<string, number>
  riskDistribution: Record<CulturalRiskLevel, number>
  wordCountOriginal: number
  wordCountTranscreated: number
  estimatedCostSaved: number
}

export const CULTURES: CultureOption[] = [
  { key: 'hi-IN',  label: 'Hindi',              nativeLabel: 'हिन्दी',     region: 'India' },
  { key: 'bn-IN',  label: 'Bengali',             nativeLabel: 'বাংলা',       region: 'India' },
  { key: 'mr-IN',  label: 'Marathi',             nativeLabel: 'मराठी',      region: 'India' },
  { key: 'ta-IN',  label: 'Tamil',               nativeLabel: 'தமிழ்',       region: 'India' },
  { key: 'te-IN',  label: 'Telugu',              nativeLabel: 'తెలుగు',      region: 'India' },
  { key: 'en-US',  label: 'English (US)',         nativeLabel: 'English',     region: 'USA' },
  { key: 'en-GB',  label: 'English (UK)',         nativeLabel: 'English',     region: 'UK' },
  { key: 'en-AU',  label: 'English (Australia)',  nativeLabel: 'English',     region: 'Australia' },
  { key: 'es-MX',  label: 'Spanish (Mexico)',     nativeLabel: 'Español',     region: 'Mexico' },
  { key: 'es-ES',  label: 'Spanish (Spain)',      nativeLabel: 'Español',     region: 'Spain' },
  { key: 'pt-BR',  label: 'Portuguese (Brazil)',  nativeLabel: 'Português',   region: 'Brazil' },
  { key: 'fr-FR',  label: 'French',               nativeLabel: 'Français',    region: 'France' },
  { key: 'de-DE',  label: 'German',               nativeLabel: 'Deutsch',     region: 'Germany' },
  { key: 'ja-JP',  label: 'Japanese',             nativeLabel: '日本語',       region: 'Japan' },
  { key: 'ko-KR',  label: 'Korean',               nativeLabel: '한국어',       region: 'S. Korea' },
  { key: 'zh-CN',  label: 'Chinese (Simplified)', nativeLabel: '中文',         region: 'China' },
  { key: 'ar-EG',  label: 'Arabic (Egypt)',       nativeLabel: 'العربية',     region: 'Egypt' },
  { key: 'ru-RU',  label: 'Russian',              nativeLabel: 'Русский',     region: 'Russia' },
  { key: 'it-IT',  label: 'Italian',              nativeLabel: 'Italiano',    region: 'Italy' },
  { key: 'tr-TR',  label: 'Turkish',              nativeLabel: 'Türkçe',      region: 'Turkey' },
]
