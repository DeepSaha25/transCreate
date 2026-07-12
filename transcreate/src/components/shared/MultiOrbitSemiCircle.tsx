import React, { useState, useEffect } from "react";
import { 
  Brain, Link, Smile, Atom, FileCode, Zap, 
  BarChart, Activity, ShieldCheck, Route, 
  Server, Paintbrush, Wand2, Database,
  Cpu, Layers, Globe, Code, Box, Smartphone
} from "lucide-react";
import "./MultiOrbitSemiCircle.css";

const ICONS = [
  { url: "https://cdn.simpleicons.org/ibm/white", label: "IBM Granite" },
  { url: "https://cdn.simpleicons.org/langchain/white", label: "LangChain" },
  { url: "https://cdn.simpleicons.org/huggingface", label: "Hugging Face" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", label: "React" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", label: "TypeScript" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg", label: "Vite" },
  { url: "https://cdn.simpleicons.org/chartdotjs/white", label: "Chart.js" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg", label: "Framer Motion" },
  { url: "https://cdn.simpleicons.org/zod/white", label: "Zod" },
  { url: "https://cdn.simpleicons.org/reactrouter/white", label: "React Router" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", label: "Node.js" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg", label: "Vanilla CSS" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", label: "GitHub" },
  { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg", label: "HTML5" }
];

function SemiCircleOrbit({ radius, centerX, centerY, count, iconSize, startIndex }: any) {
  return (
    <>
      {/* Semi-circle glow background */}
      <div className="orbit-glow-wrapper">
        <div className="orbit-glow" />
      </div>

      {/* Orbit icons */}
      {Array.from({ length: count }).map((_, index) => {
        const angle = (index / (count - 1)) * 180;
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);
        
        const itemIndex = (startIndex + index) % ICONS.length;
        const tech = ICONS[itemIndex];

        // Tooltip positioning — above or below based on angle
        const tooltipAbove = angle > 90;

        return (
          <div
            key={index}
            className="orbit-icon-container"
            style={{
              left: `${centerX + x - iconSize / 2}px`,
              top: `${centerY - y - iconSize / 2}px`,
              zIndex: 5,
            }}
          >
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

            {/* Tooltip */}
            <div
              className={`orbit-tooltip ${tooltipAbove ? "orbit-tooltip--above" : "orbit-tooltip--below"}`}
            >
              {tech.label}
              <div className="orbit-tooltip-arrow"></div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function MultiOrbitSemiCircle() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const baseWidth = Math.min(size.width * 0.9, 800);
  const centerX = baseWidth / 2;
  const centerY = baseWidth * 0.55; // slightly lower center to fit semi-circle

  const iconSize =
    size.width < 480
      ? Math.max(32, baseWidth * 0.08)
      : size.width < 768
      ? Math.max(40, baseWidth * 0.07)
      : Math.max(48, baseWidth * 0.06);

  return (
    <section className="orbit-section" id="built-with">
      <div className="container orbit-section__inner">
        <span className="section-label">Built With</span>
        <h2 className="orbit-section__headline">Powered by modern web tech</h2>
        <p className="orbit-section__sub">
          TransCreate leverages a cutting-edge open-source stack for speed, reliability, and precision.
        </p>

        <div
          className="orbit-diagram"
          style={{ width: baseWidth, height: baseWidth * 0.6 }}
        >
          {/* Inner orbit - 5 items */}
          <SemiCircleOrbit radius={baseWidth * 0.25} centerX={centerX} centerY={centerY} count={5} iconSize={iconSize} startIndex={0} />
          {/* Middle orbit - 7 items */}
          <SemiCircleOrbit radius={baseWidth * 0.40} centerX={centerX} centerY={centerY} count={7} iconSize={iconSize} startIndex={5} />
          {/* Outer orbit - 9 items */}
          <SemiCircleOrbit radius={baseWidth * 0.55} centerX={centerX} centerY={centerY} count={9} iconSize={iconSize} startIndex={12} />
        </div>
      </div>
    </section>
  );
}
