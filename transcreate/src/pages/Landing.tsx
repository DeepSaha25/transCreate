import { Link } from 'react-router-dom'
import { Clapperboard, Mic, Trophy } from 'lucide-react'
import Navbar from '../components/shared/Navbar'
import { GLSLHills } from '../components/shared/GLSLHills'
import MultiOrbitSemiCircle from '../components/shared/MultiOrbitSemiCircle'
import FeaturesCards from '../components/shared/FeaturesCards'
import HowItWorksCards from '../components/shared/HowItWorksCards'
import { Footer } from '../components/layout/Footer'
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
    metric: '↓ 90%',
    metricLabel: 'fewer retakes with guided emotion context',
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

          {/* ── LEFT ── */}
          <div className="hero__copy">
            <span className="hero__eyebrow">IBM Granite · Cultural AI</span>

            <h1 className="hero__headline">
              Film<br />
              scripts that<br />
              feel <span className="gradient-text">native.</span>
            </h1>

            <p className="hero__sub">
              Cultural transcreation.<br />Not translation.
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

          {/* ── RIGHT: Terminal card ── */}
          <div className="hero__visual" aria-hidden="true">
            <div className="tc-preview">
              <div className="tc-preview__chrome">
                <span className="tc-dot tc-dot--red" /><span className="tc-dot tc-dot--yellow" /><span className="tc-dot tc-dot--green" />
                <span className="tc-preview__chrome-label">transcreate · live output</span>
                <span className="tc-pulse" style={{ marginLeft: 'auto' }} />
              </div>

              <div className="tc-preview__body">
                <div className="tc-source-row">
                  <span className="tc-lang">EN</span>
                  <div className="tc-row__content">
                    <p className="tc-source__text">"Man, this shot is absolutely killer."</p>
                  </div>
                </div>

                <div className="tc-outputs">
                  <div className="tc-row tc-row--1">
                    <span className="tc-lang tc-lang--out">ES</span>
                    <div className="tc-row__content">
                      <p className="tc-row__text">"¡Dios mío, este plano es una pasada!"</p>
                      <span className="tc-row__tag">entusiasmado · Latino</span>
                    </div>
                  </div>
                  <div className="tc-row tc-row--2">
                    <span className="tc-lang tc-lang--out">HI</span>
                    <div className="tc-row__content">
                      <p className="tc-row__text">"यार, यह शॉट तो कमाल है!"</p>
                      <span className="tc-row__tag">उत्साहित · India</span>
                    </div>
                  </div>
                  <div className="tc-row tc-row--3">
                    <span className="tc-lang tc-lang--out">JA</span>
                    <div className="tc-row__content">
                      <p className="tc-row__text">"このショット、マジやばくない？"</p>
                      <span className="tc-row__tag">興奮 · Japan</span>
                    </div>
                  </div>
                </div>
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
                <h3 className="proof-card__title">Google Translate</h3>
                <span className="proof-card__subtitle">Literal Translation</span>
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
              <div className="proof-card__glow" />
              <div className="proof-card__header">
                <h3 className="proof-card__title proof-card__title--gold">TransCreate AI</h3>
                <span className="proof-card__subtitle">Powered by IBM Granite 3.3</span>
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

      <FeaturesCards />

      <div className="divider" />

      {/* ── How it works ── */}
      <HowItWorksCards />

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
                <div className="user-card__glow" />
                
                <div className="user-card__header">
                  <div className="user-card__icon-wrapper">
                    <span className="user-card__icon">{user.icon}</span>
                  </div>
                  <div className="user-card__header-text">
                    <span className="user-card__id">{user.id}</span>
                    <h3 className="user-card__role">{user.role}</h3>
                    <p className="user-card__tagline">{user.tagline}</p>
                  </div>
                </div>

                <div className="user-card__body">
                  <div className="user-card__pain-section">
                    <div className="user-card__pain-tag">Current state</div>
                    <p className="user-card__pain">{user.pain}</p>
                  </div>

                  <div className="user-card__gains-section">
                    <div className="user-card__gains-tag">With TransCreate</div>
                    <ul className="user-card__gains">
                      {user.gains.map((g, i) => (
                        <li key={i} className="user-card__gain">
                          <svg className="user-card__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="user-card__footer">
                  <span className="user-card__metric-value">{user.metric}</span>
                  <span className="user-card__metric-label">{user.metricLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Built With ── */}
      <MultiOrbitSemiCircle />

      {/* ── Footer ── */}
      <Footer />
    </div>
  )
}
