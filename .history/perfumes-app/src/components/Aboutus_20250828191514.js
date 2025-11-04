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
          Veloura — Capturing the Pure & Natural Essence That Elevates Your Senses.
        </h2>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </p>
      </div>
    </div>
  );
}

export default Aboutus;
