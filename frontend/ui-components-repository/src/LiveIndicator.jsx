// LiveIndicator.js
import React from "react";
import "./LiveIndicator.css"; // Import CSS for styles

const LiveIndicator = () => {
  return (
    <div className="live-container">
      <span className="blinking-dot"></span>
      <span className="live-text">Live</span>
    </div>
  );
};

export default LiveIndicator;
