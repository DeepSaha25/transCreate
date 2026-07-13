import type { CultureKey } from '../types/transcript'

interface MockResult {
  transcreated_text: string
  emotion_tag: string
  pronunciation_hint: string
  rationale: string
  confidence: 'high' | 'medium' | 'low'
}

/**
 * Rich culturally-specific mock responses for demo mode.
 * Organized by target culture key with realistic adaptations.
 */
const MOCK_POOLS: Record<string, MockResult[]> = {
  'en-US': [
    {
      transcreated_text: "Man, this is absolutely wild — I can't believe this is happening.",
      emotion_tag: 'excited',
      pronunciation_hint: 'Stress on "wild" and "happening"',
      rationale: 'The Hindi "yaar" (buddy) exclamation was adapted to American casual register. "Wild" captures the informal disbelief common in US street speech.',
      confidence: 'high',
    },
    {
      transcreated_text: "Look, I get it — sometimes you just gotta do what you gotta do.",
      emotion_tag: 'warm familiarity',
      pronunciation_hint: 'Slight drawl on "gotta", conversational pace',
      rationale: 'The source used a Hindi fatalistic idiom. The American equivalent "gotta do what you gotta do" carries the same resigned acceptance without losing the warmth.',
      confidence: 'high',
    },
    {
      transcreated_text: "Honestly? I had no idea things could get this complicated.",
      emotion_tag: 'melancholic',
      pronunciation_hint: 'Slight pause after "Honestly?" for dramatic beat',
      rationale: 'Literal translation would sound overly formal. "Honestly?" as a conversation opener is a natural American way to express genuine surprise with vulnerability.',
      confidence: 'medium',
    },
    {
      transcreated_text: "Okay, so here's the thing — nobody saw this coming.",
      emotion_tag: 'tense',
      pronunciation_hint: 'Quick delivery, emphasis on "nobody"',
      rationale: '"Here\'s the thing" is a quintessential American storytelling pivot phrase that signals a reveal, matching the original\'s dramatic beat.',
      confidence: 'high',
    },
  ],
  'en-GB': [
    {
      transcreated_text: "Right, this is rather a lot to take in, isn't it?",
      emotion_tag: 'dry irony',
      pronunciation_hint: 'Slight rise on "isn\'t it?" — typical British tag question',
      rationale: 'British understatement replaced the source\'s hyperbole. "Rather a lot to take in" carries the same meaning with classic British reserve and implied irony.',
      confidence: 'high',
    },
    {
      transcreated_text: "Brilliant. Absolutely brilliant. I cannot believe this.",
      emotion_tag: 'dry irony',
      pronunciation_hint: 'Flat delivery on both "brilliant"s — sarcastic British register',
      rationale: 'The source expressed frustration. British sarcasm using "brilliant" is the most culturally authentic equivalent, widely understood without explanation.',
      confidence: 'high',
    },
  ],
  'ja-JP': [
    {
      transcreated_text: 'しょうがない… これが運命というものか。',
      emotion_tag: 'melancholic',
      pronunciation_hint: '"Shouganai" — sho-ga-na-i (4 syllables, descending pitch)',
      rationale: 'The concept of "shoganai" (it cannot be helped) deeply resonates with the Japanese cultural concept of accepting fate. This replaces a direct Hindi resignation phrase with a culturally embedded equivalent.',
      confidence: 'high',
    },
    {
      transcreated_text: 'すごいな… 本当にすごい。',
      emotion_tag: 'reverent',
      pronunciation_hint: '"Sugoi na" — emphasis on second "sugoi" with soft trailing note',
      rationale: '"Sugoi" in its doubled form expresses genuine awe in informal Japanese speech. The trailing "na" adds a personal, reflective quality matching the source\'s tone.',
      confidence: 'high',
    },
  ],
  'es-MX': [
    {
      transcreated_text: '¡No manches, esto sí está de locos!',
      emotion_tag: 'excited',
      pronunciation_hint: '"No manches" — no MAN-ches, exclamatory',
      rationale: '"No manches" is Mexico\'s preferred strong exclamation of disbelief (softer than the full vulgarity). It perfectly matches the informal surprise of the source line.',
      confidence: 'high',
    },
    {
      transcreated_text: 'Pues ni modo, así es la vida.',
      emotion_tag: 'warm familiarity',
      pronunciation_hint: 'Relaxed, resigned tone. "Ni modo" — nee MO-do',
      rationale: '"Ni modo" is a deeply Mexican expression of resigned acceptance with warmth, nearly identical in cultural weight to the Hindi fatalistic phrase in the source.',
      confidence: 'high',
    },
  ],
  'pt-BR': [
    {
      transcreated_text: 'Cara, não acredito que isso tá acontecendo de verdade.',
      emotion_tag: 'excited',
      pronunciation_hint: '"Cara" is a casual address — "KAH-ra", informal register',
      rationale: '"Cara" (buddy/dude) in Brazilian Portuguese mirrors the casual address register of "yaar" in Hindi. "De verdade" (for real) amplifies the disbelief naturally.',
      confidence: 'high',
    },
  ],
  'ko-KR': [
    {
      transcreated_text: '아, 진짜로? 이게 말이 돼?',
      emotion_tag: 'confrontational',
      pronunciation_hint: '"Jinjalyo" — jin-JA-ryo, rising intonation for disbelief',
      rationale: '"진짜로?" (for real?) is the Korean casual disbelief marker. The added rhetorical "이게 말이 돼?" (does this even make sense?) heightens the dramatic weight.',
      confidence: 'medium',
    },
  ],
  'fr-FR': [
    {
      transcreated_text: "Franchement, c'est n'importe quoi tout ça.",
      emotion_tag: 'dry irony',
      pronunciation_hint: '"C\'est n\'importe quoi" — say nim-PORT-kwah, light contempt',
      rationale: '"C\'est n\'importe quoi" is the quintessential French expression of exasperated dismissal. It captures the source\'s frustration while sounding authentically Parisian.',
      confidence: 'high',
    },
  ],
}

const FALLBACK: MockResult = {
  transcreated_text: 'This moment carries a weight that words alone can barely hold.',
  emotion_tag: 'melancholic',
  pronunciation_hint: 'Slow, deliberate delivery with pause before "hold"',
  rationale: 'The source line\'s emotional core was preserved while adapting the phrasing to feel natural in a Western literary register. Cultural neutrality was prioritized here.',
  confidence: 'medium',
}

export function getMockTranscreation(
  _originalText: string,
  _sourceCulture: CultureKey,
  targetCulture: CultureKey
): MockResult {
  const pool = MOCK_POOLS[targetCulture]
  if (!pool || pool.length === 0) return FALLBACK
  return pool[Math.floor(Math.random() * pool.length)]
}
