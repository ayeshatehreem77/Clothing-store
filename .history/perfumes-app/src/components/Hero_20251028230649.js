import React from "react";
import Navbar from "./Navbar";

function Hero() {
  return (
    <div className="hero-section">
      <Navbar />

      <div className="hero-layout">
        {/* Left Main Image Box */}
        <div className="hero-left">
          <div className="main-image">
            <img src="assets/hero-img1.jpg" alt="" />
          </div>
        </div>

        {/* Right Side Content */}
        <div className="hero-right">
          <div className="hero-text">
            <h2>Fashion</h2>
            <h1>
              New <br /> Arrival
            </h1>
            <button className="shop-btn">Shop Now</button>
          </div>

          {/* Right-side image grid */}
          <div className="image-grid">
            <div className="small-box"></div>
            <div className="small-box"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
