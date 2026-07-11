import React, { useState, useEffect } from "react";
import { 
  Brain, Link, Smile, Atom, FileCode, Zap, 
  BarChart, Activity, ShieldCheck, Route, 
  Server, Paintbrush, Wand2, Database,
  Cpu, Layers, Globe, Code, Box, Smartphone
} from "lucide-react";
import "./MultiOrbitSemiCircle.css";

const ICONS = [
  { url: "https://cdn.simpleicons.org/ibm/ffffff", label: "IBM Granite" },
  { url: "https://cdn.simpleicons.org/langchain/ffffff", label: "LangChain" },
  { url: "https://cdn.simpleicons.org/huggingface", label: "Hugging Face" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", label: "React" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", label: "TypeScript" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg", label: "Vite" },
  { url: "https://cdn.simpleicons.org/chartdotjs/ffffff", label: "Chart.js" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg", label: "Framer Motion" },
  { url: "https://cdn.simpleicons.org/zod/ffffff", label: "Zod" },
  { url: "https://cdn.simpleicons.org/reactrouter/ffffff", label: "React Router" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", label: "Node.js" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg", label: "Vanilla CSS" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", label: "GitHub" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg", label: "HTML5" }
];

function SemiCircleOrbit({ radius, centerX, centerY, count, iconSize, startIndex, speed, direction }: any) {
  return (
    <div 
      className={`orbit-ring ${direction === 'reverse' ? 'orbit-ring--reverse' : ''}`}
      style={{
        width: radius * 2,
        height: radius * 2,
        left: centerX - radius,
        top: centerY - radius,
        animationDuration: `${speed}s`,
      }}
    >
      {Array.from({ length: count }).map((_, index) => {
        // Full 360 degree circle distribution
        const angle = (index / count) * 360;
        
        // Calculate position relative to the orbit-ring's top-left
        const x = radius + radius * Math.cos((angle * Math.PI) / 180);
        const y = radius + radius * Math.sin((angle * Math.PI) / 180);
        
        const itemIndex = (startIndex + index) % ICONS.length;
        const tech = ICONS[itemIndex];

        return (
          <div
            key={index}
            className={`orbit-icon-container ${direction === 'reverse' ? 'orbit-icon-container--reverse' : ''}`}
            style={{
              left: `${x - iconSize / 2}px`,
              top: `${y - iconSize / 2}px`,
              animationDuration: `${speed}s`,
            }}
          >
            <div className="orbit-icon-scaler" style={{ transform: `scaleY(${1 / 0.35})` }}>
              <div 
                className="orbit-icon"
                style={{ width: iconSize, height: iconSize }}
              >
                <img 
                  src={tech.url} 
                  alt={tech.label} 
                  style={{ width: iconSize * 0.55, height: iconSize * 0.55, objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function MultiOrbitSemiCircle() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const baseWidth = Math.min(size.width * 0.9, 900);
  const maxRadius = baseWidth * 0.4; // Maximum radius for the outer orbit
  const scaleY = 0.35; // How flat the oval is
  
  const iconSize =
    size.width < 480
      ? Math.max(32, baseWidth * 0.08)
      : size.width < 768
      ? Math.max(40, baseWidth * 0.07)
      : Math.max(48, baseWidth * 0.05);

  const wrapperHeight = (maxRadius * scaleY) + iconSize * 1.5; // Top half + padding
  const centerX = baseWidth / 2;
  const centerY = maxRadius; // Center vertically in the unscaled diagram

  return (
    <section className="orbit-section" id="built-with">
      <div className="container orbit-section__inner">
        <span className="section-label">Built With</span>
        <h2 className="orbit-section__headline">Powered by modern web tech</h2>
        <p className="orbit-section__sub">
          TransCreate leverages a cutting-edge open-source stack for speed, reliability, and precision.
        </p>

        <div
          className="orbit-diagram-wrapper"
          style={{ 
            width: baseWidth, 
            height: wrapperHeight, 
            overflow: 'hidden', 
            position: 'relative',
            margin: '0 auto' 
          }}
        >
          <div
            className="orbit-diagram"
            style={{ 
              width: baseWidth, 
              height: maxRadius * 2,
              position: 'absolute',
              bottom: -maxRadius + iconSize,
              transform: `scaleY(${scaleY})`,
              transformOrigin: 'center center'
            }}
          >
            {/* Inner orbit */}
            <SemiCircleOrbit radius={maxRadius * 0.35} centerX={centerX} centerY={centerY} count={4} iconSize={iconSize} startIndex={0} speed={25} />
            {/* Middle orbit */}
            <SemiCircleOrbit radius={maxRadius * 0.65} centerX={centerX} centerY={centerY} count={7} iconSize={iconSize} startIndex={4} speed={35} direction="reverse" />
            {/* Outer orbit */}
            <SemiCircleOrbit radius={maxRadius} centerX={centerX} centerY={centerY} count={10} iconSize={iconSize} startIndex={11} speed={45} />
          </div>
        </div>
      </div>
    </section>
  );
}
