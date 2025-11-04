import React from "react";
import Navbar from "./Navbar";


function Hero() {
  return (
    <div className="hero-section">
      <Navbar />
      <div className="hero-content">
        {/* Left column */}
        <div className="left-column">
          <h2>Fashion</h2>
          <h1>
            New <br /> Arrival
          </h1>
          <a href="#products" className="shopnow-btn">
            Shop Now
          </a>
        </div>

        {/* Right column */}
        <div className="right-column">
          <div className="large-box"></div>
          <div className="small-box"></div>
          <div className="small-box"></div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
