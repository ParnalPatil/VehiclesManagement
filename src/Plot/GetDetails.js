import React from "react";
import Navbar from "../Table/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from '../baseurls';
import Plot from "./Plot";
import { useNavigate } from "react-router";

const regions=['Rushi', 'SF bay area', 'anchorage / mat-su', 'auburn', 'bakersfield', 'birmingham', 'chico', 'dothan', 'fairbanks', 'fayetteville', 'flagstaff / sedona', 'florence / muscle shoals', 'fort smith', 'fresno / madera', 'gadsden-anniston', 'gold country', 'hanford-corcoran', 'humboldt county', 'huntsville / decatur', 'imperial county', 'inland empire', 'jonesboro', 'kenai peninsula', 'little rock', 'los angeles', 'mendocino county', 'merced', 'mobile', 'modesto', 'mohave county', 'monterey bay', 'montgomery', 'orange county', 'palm springs', 'phoenix', 'prescott', 'redding', 'reno / tahoe', 'rushi', 'sacramento', 'san diego', 'san luis obispo', 'santa barbara', 'santa maria', 'show low', 'sierra vista', 'siskiyou county', 'southeast alaska', 'stockton', 'texarkana', 'tucson', 'tuscaloosa', 'yuma']

const GetDetails = () => {

  let navigate = useNavigate();

  const [region, setRegion]=useState(null)
  const [price_start, setPriceStart]=useState(null)
  const [price_end, setPriceEnd]=useState(null)

  const token_from_storage = sessionStorage.getItem("token")
 



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
  
  return (<div>
   {token_from_storage && token_from_storage != "" && token_from_storage != undefined ? (<div>
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
    </div>) : (<p> Please login/Signup first</p>)
  }
  </div>
  );
};

export default GetDetails;
