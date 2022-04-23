import React from "react";
import Navbar from "../Table/Navbar";

const Plot = () => {
  return (
    <div>
      <Navbar />
      <div>
        <ul>
          <h2>1) Vehicles Distribution by Manufacturer</h2>
          <li
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="https://s3.us-east-2.amazonaws.com/vehicles-plot/manufacturer.png"
              width="1200"
              height="700"
            ></img>
          </li>
          <h2>2) Vehicles Distribution by Year</h2>
          <li
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="https://s3.us-east-2.amazonaws.com/vehicles-plot/years.png"
              width="1200"
              height="600"
            ></img>
          </li>
          <h2>3) Vehicles Size Distribution</h2>
          <li
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src="https://s3.us-east-2.amazonaws.com/vehicles-plot/pie.png"></img>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Plot;
