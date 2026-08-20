import React from "react";
import "./SmartCityIllustration.css";

function SmartCityIllustration() {
  return (
    <div className="smart-city-illustration">

      <div className="city-sun">
        ☀️
      </div>

      <div className="city-cloud cloud-one">
        ☁️
      </div>

      <div className="city-cloud cloud-two">
        ☁️
      </div>

      <div className="city-buildings">

        <div className="building building-one">
          <div className="building-windows">
            ▪ ▪<br />
            ▪ ▪<br />
            ▪ ▪
          </div>
        </div>

        <div className="building building-two">
          <div className="building-windows">
            ▪ ▪<br />
            ▪ ▪<br />
            ▪ ▪<br />
            ▪ ▪
          </div>
        </div>

        <div className="building building-three">
          <div className="building-windows">
            ▪ ▪<br />
            ▪ ▪<br />
            ▪ ▪
          </div>
        </div>

        <div className="building building-four">
          <div className="building-windows">
            ▪ ▪<br />
            ▪ ▪<br />
            ▪ ▪<br />
            ▪ ▪
          </div>
        </div>

      </div>

      <div className="city-road">

        <div className="road-line"></div>

        <div className="city-car">
          🚗
        </div>

      </div>

      <div className="city-tree tree-one">
        🌳
      </div>

      <div className="city-tree tree-two">
        🌳
      </div>

      <div className="smart-city-title">
        <span>Smart</span> City
      </div>

    </div>
  );
}

export default SmartCityIllustration;