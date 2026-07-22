import { PromptTemplate } from '@langchain/core/prompts'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { z } from 'zod'
import type { CultureKey, EmotionTag, TranscreatedLine, CulturalRisk, CulturalRiskLevel, CompareResult, GlossaryEntry } from '../types/transcript'
import type { ScriptLine } from '../types/transcript'
import { CULTURES } from '../types/transcript'
import { getMockTranscreation } from './mockService'

const EMOTIONS: EmotionTag[] = [
  'neutral', 'warm familiarity', 'dry irony', 'excited', 'tense',
  'melancholic', 'comedic', 'reverent', 'confrontational', 'playful',
]

const outputParser = StructuredOutputParser.fromZodSchema(
  z.object({
    transcreated_text: z.string().describe('The culturally adapted translation in the target language'),
    emotion_tag: z.enum(EMOTIONS as [EmotionTag, ...EmotionTag[]]).describe('The emotional delivery note for the voice actor'),
    pronunciation_hint: z.string().describe('Romanized pronunciation guide or key word stress for the voice actor'),
    rationale: z.string().describe('Why this cultural adaptation was chosen over a literal translation — cite the specific idiom, slang, or reference adapted'),
    confidence: z.enum(['high', 'medium', 'low']).describe('Confidence level of the transcreation'),
  })
)

const transcreationPrompt = new PromptTemplate({
  template: `You are a transcreation specialist. Adapt the line for {target_culture} — replace idioms/slang/humor with culturally native equivalents. Do NOT translate literally. Match the speaking length.

SOURCE ({source_culture}): "{original_line}"
CONTEXT: {context}

Output ONLY raw valid JSON (no markdown, no prose):
{format_instructions}`,
  inputVariables: ['source_culture', 'target_culture', 'original_line', 'context'],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
})

const HF_API_KEY = import.meta.env.VITE_HF_API_KEY as string | undefined
const HF_MODEL = (import.meta.env.VITE_HF_MODEL as string) || 'meta-llama/Llama-3.1-8B-Instruct'
const HF_API_URL = `https://router.huggingface.co/v1/chat/completions`

async function callGranite(prompt: string, timeoutMs = 15000): Promise<string> {
  if (!HF_API_KEY) {
    throw new Error('NO_KEY')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.7,
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`HF API ${response.status}: ${err}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content ?? ''
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error('HF API Request timed out')
    }
    throw err
  }
}

export async function transcreateLines(
  lines: ScriptLine[],
  sourceCulture: CultureKey,
  targetCulture: CultureKey,
  onLineComplete: (line: TranscreatedLine) => void
): Promise<void> {
  const CONCURRENCY = 2 // 2 concurrent — avoids HF rate limits

  async function processLine(line: ScriptLine, i: number) {
    const context = lines
      .slice(Math.max(0, i - 2), i)
      .map(l => l.text)
      .join('\n') || '(start)'

    let parsed: z.infer<typeof outputParser.schema>
    
    // Try once, retry once on failure with a delay
    for (let attempt = 0; attempt <= 1; attempt++) {
      try {
        if (attempt > 0) await new Promise(r => setTimeout(r, 2000)) // wait 2s before retry
        const formattedPrompt = await transcreationPrompt.format({
          source_culture: sourceCulture,
          target_culture: targetCulture,
          original_line: line.text,
          context,
        })
        const raw = await callGranite(formattedPrompt, 25000)
        let cleanRaw = raw.trim()
        if (cleanRaw.startsWith('```')) {
          cleanRaw = cleanRaw.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
        }
        parsed = await outputParser.parse(cleanRaw)
        break // success — exit retry loop
      } catch (err) {
        if (attempt === 1) {
          // Both attempts failed — use mock with line-index offset to vary the result
          console.error('HF API Error for line', line.index, '(after retry):', err)
          parsed = getMockTranscreation(line.text + line.index, sourceCulture, targetCulture) as any
        }
        // else loop continues to retry
      }
    }

    onLineComplete({
      id: line.id,
      index: line.index,
      startTime: line.startTime,
      endTime: line.endTime,
      originalText: line.text,
      transcreatedText: parsed!.transcreated_text,
      emotionTag: parsed!.emotion_tag as EmotionTag,
      pronunciationHint: parsed!.pronunciation_hint,
      rationale: parsed!.rationale,
      confidence: parsed!.confidence,
      isLoading: false,
    })
  }

  // Process in parallel batches of CONCURRENCY
  for (let i = 0; i < lines.length; i += CONCURRENCY) {
    const batch = lines.slice(i, i + CONCURRENCY)
    await Promise.all(batch.map((line, j) => processLine(line, i + j)))
  }
}

/* ─────────────────────────────────────────────────
   Re-transcreate a single line (for inline edit)
   ───────────────────────────────────────────────── */

export async function retranscreateOne(
  line: ScriptLine,
  sourceCulture: CultureKey,
  targetCulture: CultureKey,
  userHint?: string
): Promise<TranscreatedLine> {
  try {
    const prompt = `You are a professional transcreation specialist. Translate the EMOTIONAL INTENT, not the literal words.

SOURCE CULTURE: ${sourceCulture}
TARGET CULTURE: ${targetCulture}
ORIGINAL LINE: "${line.text}"
${userHint ? `USER GUIDANCE: The creator wants this to feel like: "${userHint}"` : ''}

${outputParser.getFormatInstructions()}`

    const raw = await callGranite(prompt)
    let cleanRaw = raw.trim()
    if (cleanRaw.startsWith('```json')) {
      cleanRaw = cleanRaw.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanRaw.startsWith('```')) {
      cleanRaw = cleanRaw.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    const parsed = await outputParser.parse(cleanRaw)
    return {
      id: line.id, index: line.index, startTime: line.startTime, endTime: line.endTime,
      originalText: line.text, transcreatedText: parsed.transcreated_text,
      emotionTag: parsed.emotion_tag as EmotionTag, pronunciationHint: parsed.pronunciation_hint,
      rationale: parsed.rationale, confidence: parsed.confidence, isLoading: false,
    }
  } catch (err) {
    console.error('Retranscreation error:', err)
    const fallback = getMockTranscreation(line.text, sourceCulture, targetCulture)
    return {
      id: line.id, index: line.index, startTime: line.startTime, endTime: line.endTime,
      originalText: line.text, transcreatedText: fallback.transcreated_text,
      emotionTag: fallback.emotion_tag as EmotionTag, pronunciationHint: fallback.pronunciation_hint,
      rationale: fallback.rationale, confidence: fallback.confidence, isLoading: false,
    }
  }
}

/* ─────────────────────────────────────────────────
   Cultural Risk Scanner
   ───────────────────────────────────────────────── */



const riskParser = StructuredOutputParser.fromZodSchema(
  z.object({
    risk: z.enum(['critical', 'caution', 'safe']).describe('Risk level for cultural mismatch'),
    reason: z.string().describe('Brief reason why this line is culturally risky'),
    flagged_terms: z.array(z.string()).describe('Specific words/phrases that are culturally sensitive'),
  })
)

export async function scanCulturalRisks(
  lines: ScriptLine[],
  sourceCulture: CultureKey,
  onResult: (risk: CulturalRisk) => void
): Promise<void> {
  for (const line of lines) {
    try {
      const prompt = `Analyze this script line for cultural translation risk. Identify slang, idioms, humor, religious references, or culturally specific phrases that would NOT translate literally to other languages.

SOURCE CULTURE: ${sourceCulture}
LINE: "${line.text}"

Risk levels:
- "critical": Contains idioms, puns, humor, or references that will definitely be misunderstood in other cultures
- "caution": Contains colloquial tone or mild cultural specificity that needs care
- "safe": Factual or neutral dialogue that translates cleanly across cultures

${riskParser.getFormatInstructions()}`

      const raw = await callGranite(prompt)
      let cleanRaw = raw.trim()
      if (cleanRaw.startsWith('```json')) {
        cleanRaw = cleanRaw.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanRaw.startsWith('```')) {
        cleanRaw = cleanRaw.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      const parsed = await riskParser.parse(cleanRaw)
      onResult({
        lineId: line.id,
        risk: parsed.risk as CulturalRiskLevel,
        reason: parsed.reason,
        flaggedTerms: parsed.flagged_terms,
      })
    } catch (err) {
      console.error('Risk scan error:', err)
      // Heuristic fallback: mark lines with exclamation marks, question marks, or short punchy lines as caution
      const hasSlang = /(!{2,}|\?{2,}|\.{3,}|yaar|bhai|dude|bro|mate|lol|omg)/i.test(line.text)
      onResult({
        lineId: line.id,
        risk: hasSlang ? 'caution' : 'safe',
        reason: hasSlang ? 'Contains informal/colloquial expressions' : 'Appears culturally neutral',
        flaggedTerms: [],
      })
    }
    await new Promise(r => setTimeout(r, 300))
  }
}

/* ─────────────────────────────────────────────────
   Multi-Culture Comparison
   ───────────────────────────────────────────────── */

const compareParser = StructuredOutputParser.fromZodSchema(
  z.object({
    transcreated_text: z.string(),
    emotion_tag: z.enum(EMOTIONS as [EmotionTag, ...EmotionTag[]]),
    rationale: z.string(),
  })
)

export async function compareAcrossCultures(
  line: ScriptLine,
  sourceCulture: CultureKey,
  targetCultures: CultureKey[],
  onResult: (cultureKey: CultureKey, result: CompareResult) => void
): Promise<void> {
  const cultureMap = new Map(CULTURES.map(c => [c.key, c.label]))
  for (const target of targetCultures) {
    try {
      const prompt = `Transcreate this line for a ${cultureMap.get(target)} audience. Translate the emotional intent, not literal words.

SOURCE (${sourceCulture}): "${line.text}"
TARGET CULTURE: ${target}

${compareParser.getFormatInstructions()}`

      const raw = await callGranite(prompt)
      let cleanRaw = raw.trim()
      if (cleanRaw.startsWith('```json')) {
        cleanRaw = cleanRaw.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanRaw.startsWith('```')) {
        cleanRaw = cleanRaw.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      const parsed = await compareParser.parse(cleanRaw)
      onResult(target, {
        cultureKey: target,
        cultureLabel: cultureMap.get(target) ?? target,
        text: parsed.transcreated_text,
        emotionTag: parsed.emotion_tag as EmotionTag,
        rationale: parsed.rationale,
      })
    } catch (err) {
      console.error(`Compare error (${target}):`, err)
      const fallback = getMockTranscreation(line.text, sourceCulture, target)
      onResult(target, {
        cultureKey: target,
        cultureLabel: cultureMap.get(target) ?? target,
        text: fallback.transcreated_text,
        emotionTag: fallback.emotion_tag as EmotionTag,
        rationale: fallback.rationale,
      })
    }
    await new Promise(r => setTimeout(r, 300))
  }
}

/* ─────────────────────────────────────────────────
   Cultural Glossary Generator
   ───────────────────────────────────────────────── */

const glossaryParser = StructuredOutputParser.fromZodSchema(
  z.object({
    entries: z.array(z.object({
      original_term: z.string(),
      meaning: z.string(),
      adaptations: z.array(z.object({
        culture: z.string(),
        adapted: z.string(),
        explanation: z.string(),
      })),
    })),
  })
)

export async function generateGlossary(
  lines: ScriptLine[],
  sourceCulture: CultureKey,
  targetCultures: CultureKey[]
): Promise<GlossaryEntry[]> {
  const cultureMap = new Map(CULTURES.map(c => [c.key, c.label]))
  const targetLabels = targetCultures.map(t => cultureMap.get(t) ?? t).join(', ')
  const allText = lines.map(l => l.text).join('\n')

  try {
    const prompt = `Extract all culturally specific terms (slang, idioms, humor, colloquialisms, cultural references) from this ${cultureMap.get(sourceCulture)} script and show how each would be adapted for the following cultures: ${targetLabels}.

SCRIPT:
${allText}

For each term found, provide:
1. The original term
2. Its meaning in the source culture
3. How it would be adapted for EACH target culture, with an explanation

${glossaryParser.getFormatInstructions()}`

    const raw = await callGranite(prompt)
    let cleanRaw = raw.trim()
    if (cleanRaw.startsWith('```json')) {
      cleanRaw = cleanRaw.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanRaw.startsWith('```')) {
      cleanRaw = cleanRaw.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    const parsed = await glossaryParser.parse(cleanRaw)
    return parsed.entries.map(e => ({
      originalTerm: e.original_term,
      meaning: e.meaning,
      adaptations: e.adaptations,
    }))
  } catch (err) {
    console.error('Glossary generation error:', err)
    // Return a rich, realistic fallback glossary for demo mode when API fails
    const mockGlossary: GlossaryEntry[] = [
      {
        originalTerm: 'yaar',
        meaning: 'Buddy, friend, mate (informal address with warmth)',
        adaptations: targetCultures.map(c => {
          const culture = cultureMap.get(c) ?? c
          if (c === 'en-US') return { culture, adapted: 'man / dude', explanation: 'Captures the casual, warm intimacy of the Hindi term.' }
          if (c === 'en-GB') return { culture, adapted: 'mate', explanation: 'The quintessential British equivalent for close informal address.' }
          if (c === 'ja-JP') return { culture, adapted: 'お前 (omae) / なあ (naa)', explanation: 'Used between close friends, carrying similar intimate weight.' }
          if (c === 'es-MX') return { culture, adapted: 'güey / compa', explanation: 'Very common Mexican slang for a close friend.' }
          return { culture, adapted: 'buddy', explanation: 'A universal casual adaptation.' }
        })
      },
      {
        originalTerm: 'bhai',
        meaning: 'Brother (used to show respect or deep camaraderie)',
        adaptations: targetCultures.map(c => {
          const culture = cultureMap.get(c) ?? c
          if (c === 'en-US') return { culture, adapted: 'bro', explanation: 'Matches the familial affection applied to non-family members.' }
          if (c === 'ko-KR') return { culture, adapted: '형 (hyung)', explanation: 'Exact cultural match for a younger male addressing an older male friend.' }
          if (c === 'es-MX') return { culture, adapted: 'hermano / carnal', explanation: '"Carnal" captures the exact "blood brother" street slang equivalent.' }
          return { culture, adapted: 'bro', explanation: 'Safest equivalent.' }
        })
      },
      {
        originalTerm: 'jugaad',
        meaning: 'A flexible, innovative hack or workaround',
        adaptations: targetCultures.map(c => {
          const culture = cultureMap.get(c) ?? c
          if (c === 'en-US') return { culture, adapted: 'lifehack / MacGyvering', explanation: '"MacGyvering" implies creating a brilliant solution from limited resources.' }
          if (c === 'pt-BR') return { culture, adapted: 'gambiarra', explanation: 'The exact Brazilian equivalent for a makeshift, clever hack.' }
          if (c === 'fr-FR') return { culture, adapted: 'système D', explanation: 'French term for resourcefulness and finding quick workarounds.' }
          return { culture, adapted: 'clever hack', explanation: 'Descriptive translation since no direct equivalent exists.' }
        })
      }
    ]
    return mockGlossary
  }
}
