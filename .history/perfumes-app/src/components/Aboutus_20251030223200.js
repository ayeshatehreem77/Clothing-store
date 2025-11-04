import React, { useEffect, useRef } from 'react';

function Aboutus() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented:", error);
        });
      }
    }
  }, []);

  return (
    <div id='about' className="aboutus" style={{  }}>
      <div className="right-section">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "auto", borderRadius: "12px", objectFit: "cover" }}
        >
          <source src="/assets/aboutusvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="left-section">
        <p>About Us</p>
        <h2>
         <span>Zarmina</span> — Embracing Timeless Elegance with Every Thread.
        </h2>
        <p>Discover the art of refined craftsmanship and effortless grace. Each Zarmeena creation weaves tradition with modern sophistication, bringing you ensembles that celebrate femininity and individuality. From intricate embroidery to luxurious fabrics, Zarmeena embodies the beauty, confidence, and charm of the contemporary woman.</p>
      </div>
    </div>
  );
}

export default Aboutus;
