import { Warp } from "@paper-design/shaders-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Cultural Transcreation",
    description: "IBM Granite rewrites dialogue so it resonates in the target culture — idioms, humour, and register all preserved.",
    icon: (
      <svg width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: "Emotion Tagging",
    description: "Every line is scored for tone — angry, playful, melancholic. Voice directors get metadata, not guesswork.",
    icon: (
      <svg width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  },
  {
    title: "20+ Languages",
    description: "From Hindi and Mandarin to Swahili and Portuguese — one upload, twenty culturally-authentic outputs.",
    icon: (
      <svg width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
      </svg>
    ),
  },
  {
    title: "SRT / VTT Export",
    description: "Download production-ready subtitle files the moment transcreation is done. No formatting, no waiting.",
    icon: (
      <svg width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
];

const shaderConfigs = [
  { proportion:0.38, softness:0.9,  distortion:0.16, swirl:0.70, swirlIterations:10, shape:"checks" as const, shapeScale:0.09, colors:["hsl(38,92%,12%)","hsl(43,96%,28%)","hsl(48,100%,42%)","hsl(35,80%,20%)"] },
  { proportion:0.42, softness:1.1,  distortion:0.20, swirl:0.85, swirlIterations:12, shape:"dots"   as const, shapeScale:0.11, colors:["hsl(35,80%,10%)","hsl(44,90%,25%)","hsl(50,100%,45%)","hsl(40,70%,18%)"] },
  { proportion:0.35, softness:0.95, distortion:0.18, swirl:0.80, swirlIterations:9,  shape:"checks" as const, shapeScale:0.10, colors:["hsl(42,88%,14%)","hsl(46,95%,32%)","hsl(52,100%,50%)","hsl(38,75%,22%)"] },
  { proportion:0.44, softness:1.0,  distortion:0.22, swirl:0.75, swirlIterations:14, shape:"dots"   as const, shapeScale:0.12, colors:["hsl(36,85%,11%)","hsl(42,92%,26%)","hsl(49,98%,44%)","hsl(37,78%,19%)"] },
];

export default function FeaturesCards() {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features-header">
          <span className="section-label">Why TransCreate</span>
          <h2 className="features-headline">
            Four ways to get 10x more<br />from TransCreate
          </h2>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const cfg = shaderConfigs[index];
            return (
              <div key={index} className="feat-card">
                <div className="feat-card__shader">
                  <Warp
                    style={{ width:"100%", height:"100%" }}
                    proportion={cfg.proportion}
                    softness={cfg.softness}
                    distortion={cfg.distortion}
                    swirl={cfg.swirl}
                    swirlIterations={cfg.swirlIterations}
                    shape={cfg.shape}
                    shapeScale={cfg.shapeScale}
                    scale={1}
                    rotation={0}
                    speed={0.6}
                    colors={cfg.colors}
                  />
                </div>
                <div className="feat-card__body">
                  <div className="feat-card__icon">{feature.icon}</div>
                  <h3 className="feat-card__title">{feature.title}</h3>
                  <p className="feat-card__desc">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
