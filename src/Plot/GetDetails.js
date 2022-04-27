import React from "react";
import Navbar from "../Table/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from '../baseurls';
import Plot from "./Plot";
import { useNavigate } from "react-router";

const regions = ["auburn", "birmingham", "dothan"];

const GetDetails = () => {

  let navigate = useNavigate();

  const [region, setRegion]=useState(null)
  const [price_start, setPriceStart]=useState(null)
  const [price_end, setPriceEnd]=useState(null)

  const submitHandler = (e) => {
      e.preventDefault()
      if (Number(price_end)===0){
        setPriceEnd(999999999999999999999999)
      }
      const body={
          region: region,
          price_start: Number(price_start),
          price_end: Number(price_end)
      }
      console.log(body);


      axios.post(baseUrl + '/plot', body)
        .then((res) => {
            console.log("res.data: ",res.data)
            localStorage.setItem("manufacture-link", res.data.manufacturer)
            localStorage.setItem("years-link", res.data.years)
            localStorage.setItem("pie-link", res.data.pie)
            navigate('/plots')
            
        })
        .catch(err => console.error(`Error: ${err}`))
  };

  useEffect(() => {
    let region_option = "<option value='0'>SelectStation</option>";

    for (let i = 0; i < regions.length; i++) {
      region_option +=
        "<option value='" + regions[i] + "'>" + regions[i] + "</option>";
    }
    document.getElementById("region-select").innerHTML = region_option;
  }, [document.getElementById("region-select")]);

  return (
    <div>
      <Navbar />
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3>Enter fields to filter data else keep blank</h3>
        </div>{" "}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form>
            <div>
              <div className="mt-2 mb-2">
                <label htmlFor="birthday">Select Region: </label>
                <span> </span>
                <select
                  className="custom-select"
                  id="region-select"
                  onChange={(e) => {
                    setRegion(e.target.value)
                  }}
                ></select>
              </div>

   
              <div className="mt-2 mb-2">
                <label htmlFor="birthday">Price Range From</label>
                <span> </span>
                <input type='number' onChange={(e)=>{setPriceStart(e.target.value)}}></input>
              </div>
 
              <div className="mt-2 mb-2">
                <label htmlFor="birthday">Price Range To</label>
                <span> </span>
                <input type='number' onChange={(e)=>{setPriceEnd(e.target.value)}}></input>
              </div>
              <br/>
              <div className="form-check"></div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={submitHandler}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetDetails;
