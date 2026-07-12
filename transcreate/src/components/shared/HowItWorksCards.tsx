import React from 'react';
import './HowItWorksCards.css';

const steps = [
  { 
    num: '01', 
    title: 'Upload your script', 
    body: 'Drop in any .srt, .vtt, or .txt subtitle file. TransCreate reads timestamps, speaker cues, and line breaks automatically.',
    rotation: -5,
    zIndex: 1,
    offsetY: 20
  },
  { 
    num: '02', 
    title: 'Select cultures', 
    body: 'Choose your source culture (where the script was written) and the target culture (your new audience). 20 cultures supported.',
    rotation: 0,
    zIndex: 2,
    offsetY: -20
  },
  { 
    num: '03', 
    title: 'Download the result', 
    body: 'Every line is culturally adapted with an emotion tag and pronunciation guide. Export as a ready-to-use .srt file.',
    rotation: 5,
    zIndex: 1,
    offsetY: 20
  },
]

export default function HowItWorksCards() {
  return (
    <section className="hiw-section" id="how-it-works">
      <div className="container">
        <div className="hiw-header text-center">
          <span className="section-label" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>How it works</span>
          <h2 className="hiw-headline">Three steps to global distribution</h2>
        </div>

        <div className="hiw-cards-container">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className={`hiw-card hiw-card--${idx + 1}`}
              style={{
                transform: `rotate(${step.rotation}deg) translateY(${step.offsetY}px)`,
                zIndex: step.zIndex
              }}
            >
              <div className="hiw-card__top">
                <div className="hiw-card__num-wrapper">
                  <span className="hiw-card__num">{step.num}</span>
                </div>
                <h3 className="hiw-card__title">{step.title}</h3>
                <p className="hiw-card__body">{step.body}</p>
              </div>

              <div className="hiw-card__visual">
                 <div className="hiw-mockup">
                    {idx === 0 && (
                      <div className="mockup-window">
                        <div className="mockup-window__icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        </div>
                        <div className="mockup-window__text">
                          <span className="mockup-window__title">script_v2.srt</span>
                          <span className="mockup-window__sub">Ready for upload</span>
                        </div>
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="mockup-route">
                        <div className="mockup-route__node">
                          <span className="mockup-route__label">SOURCE</span>
                          <span className="mockup-route__value">US English</span>
                        </div>
                        <div className="mockup-route__divider">
                          <div className="mockup-route__line" />
                          <svg className="mockup-route__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                        </div>
                        <div className="mockup-route__node mockup-route__node--active">
                          <span className="mockup-route__label">TARGET</span>
                          <span className="mockup-route__value">JP Japanese</span>
                        </div>
                      </div>
                    )}
                    {idx === 2 && (
                      <div className="mockup-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        <span>Export transcreated.srt</span>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
