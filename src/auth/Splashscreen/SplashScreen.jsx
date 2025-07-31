import React from "react";
import "./SplashScreen.css";

const SplashScreen = () => {
  return (
    <div className="splash-container">
      <div className="splash-box">
        {/* <img src="/logo.png" alt="WINCITY Logo" className="splash-logo" /> */}
        <p className="splash-title">GAMEHUB</p>
        <p className="splash-loading">⏳ Loading</p>
      </div>
    </div>
  );
};

export default SplashScreen;
