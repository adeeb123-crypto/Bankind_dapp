import React from "react";
import "./graphics.css"

function graphics() {

    return(
        <div class="animation-container">
        <div class="y-axis-container">
          <div class="container">
            <div class="flash"></div>
            <div class="coin side">
              <div class="shine" style="transform:rotate(-30deg);"></div>
            </div>
            <div class="side-coin"></div>
            <div class="coin">
              <div class="dai">
                <div class="inner-dai">
                  <div class="inner-inner-dai"></div>
                </div>
                <div class="cutout"></div>
                <div class="dai-shadow"></div>
              </div>
              <div class="shine"></div>
            </div>
          </div>
        </div>
        <div class="shadow"></div>
      </div>
    )
}

export default graphics;