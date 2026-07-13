import React from "react";
import { TextHoverEffect } from "../shared/TextHoverEffect";
import "./Footer.css";

const FooterBackgroundGradient = () => {
  return (
    <div
      className="footer-gradient"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, rgba(15, 15, 17, 0.4) 50%, rgba(212, 160, 23, 0.05) 100%)",
      }}
    />
  );
};

export const Footer = () => {
  return (
    <footer className="footer-container">
      <FooterBackgroundGradient />
      
      <div className="footer-content">
        <div className="footer-links">
          <div className="footer-col">
            <h4>TransCreate</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">API</a>
            <a href="#">IBM Granite</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>

        <div className="footer-text-hover-container">
          <TextHoverEffect text="TRANSCREATE" />
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TransCreate on IBM Granite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
