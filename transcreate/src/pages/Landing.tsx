import { Link } from 'react-router-dom'
import { Clapperboard, Mic, Trophy } from 'lucide-react'
import Navbar from '../components/shared/Navbar'
import { GLSLHills } from '../components/shared/GLSLHills'
import MultiOrbitSemiCircle from '../components/shared/MultiOrbitSemiCircle'
import './Landing.css'

const BROKEN_EXAMPLE = [
  { time: '00:00:12,000 → 00:00:14,500', text: '"Ek dum mast scene hai yaar."' },
  { time: '00:00:16,200 → 00:00:19,000', text: '"Bhai, yeh toh bahut bada jugaad hai!"' },
  { time: '00:00:21,500 → 00:00:24,000', text: '"Arrey, seedhi baat, no bakwaas!"' },
]

const GOOD_EXAMPLE = [
  { time: '00:00:12,000 → 00:00:14,500', text: '"Man, this shot is absolutely killer." [excited]', note: 'mast → killer (slang adapted to US casual)' },
  { time: '00:00:16,200 → 00:00:19,000', text: '"Bro, this is one hell of a hack!" [warm familiarity]', note: 'jugaad → hack (cultural equivalent: resourceful fix)' },
  { time: '00:00:21,500 → 00:00:24,000', text: '"Come on, straight talk — no fluff!" [confrontational]', note: 'bakwaas → fluff (register preserved)' },
]

const HOW_STEPS = [
  { num: '01', title: 'Upload your script', body: 'Drop in any .srt, .vtt, or .txt subtitle file. TransCreate reads timestamps, speaker cues, and line breaks automatically.' },
  { num: '02', title: 'Select cultures', body: 'Choose your source culture (where the script was written) and the target culture (your new audience). 20 cultures supported.' },
  { num: '03', title: 'Download the result', body: 'Every line is culturally adapted with an emotion tag and pronunciation guide. Export as a ready-to-use .srt file.' },
]

const TECH = ['IBM Granite 3.3', 'LangChain.js', 'Hugging Face', 'React', 'TypeScript']

const TARGET_USERS = [
  {
    id: '01',
    role: 'Indie Filmmaker',
    icon: <Clapperboard size={24} />,
    tagline: 'Go global without a budget.',
    pain: 'You made a great film — but no distributor will touch it without a dubbed version. Professional studios charge $8,000–$20,000 per episode.',
    gains: ['Full script in 10 min', 'Emotion tags per line', 'Export-ready .srt', '20 cultures'],
    metric: '$0',
    metricLabel: 'vs. $20k at a dubbing studio',
  },
  {
    id: '02',
    role: 'Voice-Over Director',
    icon: <Mic size={24} />,
    tagline: 'Actors deliver on the first take.',
    pain: 'Actors receive a translated script with no cultural context. They mispronounce, mismatch the emotion, and you do 12 retakes.',
    gains: ['Delivery hints on every line', 'Pronunciation guides included', 'Re-transcreate any line instantly', 'Risk flags before rehearsal'],
    metric: '↓ Retakes',
    metricLabel: 'with guided emotion context',
  },
  {
    id: '03',
    role: 'Film Festival Curator',
    icon: <Trophy size={24} />,
    tagline: 'Surface films the language barrier hides.',
    pain: 'Great submissions from non-English markets are declined because the subtitles feel awkward and alienate the jury.',
    gains: ['Side-by-side cultural comparison', 'Glossary for jury context', 'Emotional arc visualised', 'Works on any .srt submission'],
    metric: '20',
    metricLabel: 'source cultures, day one',
  },
]

const PRODUCTIVITY_TIPS = [
  {
    step: '01',
    title: 'Scan risk before you book the studio',
    body: 'Risk Scan colour-codes every line red, amber, or green. Know what needs attention before the session starts.',
    tag: 'Pre-production',
    color: '#c2410c',
  },
  {
    step: '02',
    title: 'Compare cultures before you decide',
    body: 'See the same line adapted for multiple audiences simultaneously. Pick the version that fits your deal.',
    tag: 'Creative',
    color: '#d97706',
  },
  {
    step: '03',
    title: 'Refine one line, not the whole script',
    body: 'Type a hint ("more urgent") and Re-transcreate just that line. Five seconds, not five hours.',
    tag: 'On-set',
    color: '#16a34a',
  },
  {
    step: '04',
    title: 'Send the Glossary to post-production',
    body: 'Export a Markdown glossary so sound editors understand every cultural adaptation and don\'t accidentally undo it.',
    tag: 'Post-production',
    color: '#0ea5e9',
  },
]

const STATS = [
  { value: '$8,000+', label: 'Average professional dubbing cost per episode' },
  { value: '$0', label: 'Cost to run TransCreate on IBM Granite free tier' },
  { value: '20', label: 'Target cultures supported in v1' },
]

export default function Landing() {
  return (
    <div className="landing">
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero hero--fullscreen">
        <GLSLHills />
        <div className="hero__overlay" />

        <div className="hero__stage hero__stage--split">

          {/* ── LEFT: Copy ── */}
          <div className="hero__copy">
            <span className="hero__eyebrow">IBM Granite · Cultural AI</span>

            <h1 className="hero__headline">
              Film scripts<br />
              that feel<br />
              <span className="gradient-text">native.</span>
            </h1>

            <p className="hero__sub">
              Emotion-tagged. Culture-matched. Export-ready.<br />
              Transcreation for indie filmmakers at $0.
            </p>

            <div className="hero__ctas">
              <Link to="/studio" className="btn btn-primary btn-lg" id="hero-cta-primary">
                Open Studio — free
              </Link>
              <a href="#how-it-works" className="btn btn-ghost btn-lg" id="hero-cta-secondary">
                How it works
              </a>
            </div>

            <div className="stat-row">
              {STATS.map(s => (
                <div key={s.label} className="stat-block">
                  <span className="stat-block__value">{s.value}</span>
                  <span className="stat-block__label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: 3D Subtitle Card Stack ── */}
          <div className="hero__visual" aria-hidden="true">
            <div className="card-stage">

              {/* floating film-reel ring */}
              <div className="reel-ring" />
              <div className="reel-ring reel-ring--2" />

              {/* subtitle cards */}
              <div className="sub-card sub-card--1">
                <span className="sub-card__time">00:01:24,000</span>
                <p className="sub-card__line">"Man, this shot is absolutely killer."</p>
                <span className="sub-card__tag">excited · US casual</span>
              </div>

              <div className="sub-card sub-card--2">
                <span className="sub-card__time">00:01:24,000</span>
                <p className="sub-card__line">"¡Dios mío, este plano es una pasada!"</p>
                <span className="sub-card__tag">entusiasmado · ES Latino</span>
              </div>

              <div className="sub-card sub-card--3">
                <span className="sub-card__time">00:01:24,000</span>
                <p className="sub-card__line">"यार, यह शॉट तो कमाल है!"</p>
                <span className="sub-card__tag">उत्साहित · HI India</span>
              </div>

              {/* centre badge */}
              <div className="translate-badge">
                <span className="translate-badge__icon">TC</span>
                <span className="translate-badge__label">20 cultures</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      <div className="divider" />

      {/* ── Problem / Proof Section ── */}
      <section className="proof-section">
        <div className="container">
          <span className="section-label">The Problem</span>
          <h2 className="proof-section__headline">
            Literal translation kills the soul of your film
          </h2>
          <p className="proof-section__sub">
            This is the same three-line script — localized from Hindi to English (US). One is what you get from Google Translate. One is what TransCreate delivers.
          </p>

          <div className="proof-grid">
            {/* Bad example */}
            <div className="proof-card proof-card--bad">
              <div className="proof-card__header">
                <span className="badge badge-muted">Google Translate (literal)</span>
              </div>
              <div className="proof-lines">
                {BROKEN_EXAMPLE.map((line, i) => (
                  <div className="proof-line" key={i}>
                    <span className="proof-line__time">{line.time}</span>
                    <span className="proof-line__text proof-line__text--bad">{line.text}</span>
                  </div>
                ))}
              </div>
              <p className="proof-card__verdict">Confusing to a US audience. Idioms untouched. Cultural context lost.</p>
            </div>

            {/* Good example */}
            <div className="proof-card proof-card--good">
              <div className="proof-card__header">
                <span className="badge badge-amber">TransCreate — IBM Granite 3.3</span>
              </div>
              <div className="proof-lines">
                {GOOD_EXAMPLE.map((line, i) => (
                  <div className="proof-line" key={i}>
                    <span className="proof-line__time">{line.time}</span>
                    <span className="proof-line__text proof-line__text--good">{line.text}</span>
                    <span className="proof-line__note">{line.note}</span>
                  </div>
                ))}
              </div>
              <p className="proof-card__verdict">Sounds like it was written for the US audience from the start.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── How it works ── */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <span className="section-label">How it works</span>
          <h2 className="how-section__headline">Three steps to global distribution</h2>
          <div className="how-steps">
            {HOW_STEPS.map(step => (
              <div className="how-step" key={step.num}>
                <span className="how-step__num">{step.num}</span>
                <h3 className="how-step__title">{step.title}</h3>
                <p className="how-step__body">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="how-cta">
            <Link to="/studio" className="btn btn-primary btn-lg" id="how-cta-btn">Start transcreating</Link>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Who is it for ── */}
      <section className="users-section" id="who-its-for">
        <div className="container">
          <span className="section-label">Who it's for</span>
          <h2 className="users-section__headline">Built for every creative in the pipeline</h2>
          <p className="users-section__sub">From the filmmaker who shot the footage to the voice director who records the dub — TransCreate fits every stage of the multilingual production workflow.</p>

          <div className="users-grid">
            {TARGET_USERS.map(user => (
              <div className="user-card" key={user.id}>
                <div className="user-card__top">
                  <div className="user-card__icon">{user.icon}</div>
                  <div>
                    <div className="user-card__id">{user.id}</div>
                    <h3 className="user-card__role">{user.role}</h3>
                    <p className="user-card__tagline">{user.tagline}</p>
                  </div>
                </div>

                <p className="user-card__pain">
                  <span className="user-card__pain-label">The Problem →</span> {user.pain}
                </p>

                <ul className="user-card__gains">
                  {user.gains.map((g, i) => (
                    <li key={i} className="user-card__gain">
                      <span className="user-card__gain-dot" />
                      {g}
                    </li>
                  ))}
                </ul>

                <div className="user-card__metric">
                  <span className="user-card__metric-value">{user.metric}</span>
                  <span className="user-card__metric-label">{user.metricLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Productivity Tips ── */}
      <section className="tips-section" id="productivity">
        <div className="container">
          <span className="section-label">Maximise your workflow</span>
          <h2 className="tips-section__headline">Four ways to get 10× more from TransCreate</h2>

          <div className="tips-grid">
            {PRODUCTIVITY_TIPS.map(tip => (
              <div className="tip-card" key={tip.step}>
                <div className="tip-card__accent" style={{ background: tip.color }} />
                <div className="tip-card__header">
                  <span className="tip-card__tag" style={{ color: tip.color, borderColor: `${tip.color}55`, background: `${tip.color}14` }}>{tip.tag}</span>
                  <span className="tip-card__step">{tip.step}</span>
                </div>
                <h3 className="tip-card__title">{tip.title}</h3>
                <p className="tip-card__body">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Built With ── */}
      <MultiOrbitSemiCircle />

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container footer__inner">
          <span className="footer__brand">TransCreate</span>
          <span className="footer__meta">IBM July Challenge 2026 · Creative Industries</span>
        </div>
      </footer>
    </div>
  )
}
