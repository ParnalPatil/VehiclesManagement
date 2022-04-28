import React from "react";
import Navbar from "../Table/Navbar";

const Plot = () => {
  // const data = localStorage.getItem('manufacture-link')
  // console.log(data)

  const token_from_storage = sessionStorage.getItem("token");

  return (
    <div>
      {token_from_storage &&
      token_from_storage != "" &&
      token_from_storage != undefined ? (
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
                  src={localStorage.getItem("manufacture-link")}
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
                  src={localStorage.getItem("years-link")}
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
                <img src={localStorage.getItem("pie-link")}></img>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <p>PLease login/Signup first</p>
      )}
    </div>
  );
};

export default Plot;
