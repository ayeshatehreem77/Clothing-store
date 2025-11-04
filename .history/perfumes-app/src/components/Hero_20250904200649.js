import React from "react";
import Navbar from "./Navbar";


function Hero() {
  return (
    <>
    <div className="hero-section">
      <Navbar />
      <div className="hero-content">
          <div className="col-md-6 left-column">
            <h1 >
              Discover <br/> Your Aura <br /> with Veloura
            </h1>
            <a href="#products" className="btn btn-lg shopnow-btn">
              Shop Now
            </a>
          </div>
      </div>
    </div>
    </>
  );
}

export default Hero;
