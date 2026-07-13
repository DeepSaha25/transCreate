import Navbar from '../components/shared/Navbar'
import './About.css'

export default function About() {
  return (
    <div className="about">
      <Navbar />
      <div className="container about__content">
        <span className="section-label">IBM July Challenge 2026</span>
        <h1 className="about__title">About TransCreate</h1>

        <section className="about-section">
          <h2>The Problem</h2>
          <p>
            Indie filmmakers, web series creators, and short-film directors spend years producing their work —
            then face a wall when trying to distribute it globally. Professional dubbing and cultural adaptation
            cost between <strong>$5,000–$15,000 per episode</strong>. Without it, their work remains invisible
            outside their home country.
          </p>
          <p>
            Standard translation tools like Google Translate produce word-for-word outputs that destroy the
            humor, emotional resonance, and cultural subtext of a script. A Hindi joke doesn't land when
            rendered literally in American English. A Mexican idiom means nothing when translated into German
            by a machine that doesn't understand cultural context.
          </p>
        </section>

        <div className="divider" />

        <section className="about-section">
          <h2>The Solution: Transcreation</h2>
          <p>
            Transcreation is a professional technique used by global advertising agencies and film studios —
            but historically reserved for those who can afford large localization teams. TransCreate brings
            this capability to individual creators using AI.
          </p>
          <p>
            Instead of translating words, TransCreate translates <em>intent</em>. IBM Granite analyzes the
            emotional tone, cultural references, and comedic structure of each script line, then produces an
            adaptation that feels native to the target culture — as if it were written there from the start.
          </p>
        </section>

        <div className="divider" />

        <section className="about-section">
          <h2>Technical Architecture</h2>
          <div className="about-arch">
            <div className="arch-block">
              <span className="arch-block__label">01 — Input</span>
              <p>User uploads an <code>.srt</code>, <code>.vtt</code>, or <code>.txt</code> script file.
              The parser extracts each line with its timestamp and index.</p>
            </div>
            <div className="arch-block">
              <span className="arch-block__label">02 — LangChain Orchestration</span>
              <p>A <code>PromptTemplate</code> is constructed for each line, incorporating source culture,
              target culture, the original line, and 2-line context window for continuity.
              A <code>StructuredOutputParser</code> with a Zod schema enforces the output format.</p>
            </div>
            <div className="arch-block">
              <span className="arch-block__label">03 — IBM Granite 3.3 Inference</span>
              <p>The formatted prompt is sent to <code>ibm-granite/granite-3.3-8b-instruct</code>
              running on Hugging Face's free Serverless Inference API. No credit card required.</p>
            </div>
            <div className="arch-block">
              <span className="arch-block__label">04 — Structured Output</span>
              <p>Each line returns: <code>transcreated_text</code>, <code>emotion_tag</code>,
              <code>pronunciation_hint</code>, <code>rationale</code>, and <code>confidence</code>.</p>
            </div>
            <div className="arch-block">
              <span className="arch-block__label">05 — Export</span>
              <p>The completed transcreation is exported as a properly formatted <code>.srt</code>
              subtitle file, ready for video editors or voice acting sessions.</p>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section className="about-section">
          <h2>Technologies Used</h2>
          <div className="about-tech-grid">
            {[
              ['IBM Granite 3.3 8B Instruct', 'Core AI model for cultural transcreation — open-source, free on Hugging Face'],
              ['LangChain.js (@langchain/core)', 'PromptTemplate + StructuredOutputParser for reliable AI output formatting'],
              ['Zod', 'Schema validation for structured AI responses'],
              ['Hugging Face Inference API', 'Free serverless endpoint for IBM Granite — no billing required'],
              ['React 18 + TypeScript', 'Type-safe, component-based frontend'],
              ['Vite 5', 'Fast development and production build toolchain'],
              ['Web Speech API', 'Browser-native TTS for voice actor pronunciation preview'],
            ].map(([tech, desc]) => (
              <div className="about-tech-row" key={tech}>
                <code className="about-tech-row__name">{tech}</code>
                <span className="about-tech-row__desc">{desc}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
