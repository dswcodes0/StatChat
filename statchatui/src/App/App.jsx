import React, { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../Landing/Landing";
import SignUp from "../SignUp/SignUp";
import SignIn from "../SignIn/SignIn";
import Home from "../Home/Home";
import Navbar from "../Navbar/Navbar";
import Compare from "..//Compare//Compare";
import { appData } from "../Data/index";
import "./App.css";

const GAME_NAMES = {
  APEX: "Apex Legends",
  R6: "Rainbow Six Siege",
};

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [data, setData] = useState(appData);
  const [signedInUserData, setSignedInUserData] = useState({
    gamertag: "",
    platform: "",
    gameName: "",
  });
  async function fetchStats(formData) {
    const apexApiKey = process.env.REACT_APP_API_KEY;
    const baseUrl = "https://api.mozambiquehe.re/bridge?auth=";
    if (
      formData.gamertag === "" ||
      formData.platform === "" ||
      formData.gameName === ""
    ) {
      return null;
    }
    try {
      let response;
      if (formData.gameName === GAME_NAMES.APEX) {
        response = await fetch(
          `${baseUrl}${apexApiKey}&player=${formData.gamertag}&platform=${formData.platform}`
        );
      } else if (formData.gameName === GAME_NAMES.R6) {
        response = await fetch(
          `https://api.henrikdev.xyz/r6/v1/profile/${formData.platform.toLowerCase()}/${
            formData.gamertag
          }`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  useEffect(() => {
    async function fetchData() {
      try {
        if (isSignedIn) {
          const profileResponse = await fetch(
            `http://localhost:3002/users/profile`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const profileData = await profileResponse.json();
          setSignedInUserData(profileData);
          const stats = await fetchStats(profileData);
          onStatsChange(stats);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
    fetchData();
  }, [isSignedIn]);

  useEffect(() => {
    //everytime the page is refreshed this function will fetch to see if req.session.userId exists, if it does, we will set  signed in to true.
    const checkSignedIn = async () => {
      try {
        const response = await fetch("http://localhost:3002/users/check", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setIsSignedIn(data.isSignedIn);
      } catch (error) {
        console.error("Error checking user sign-in status:", error);
      }
    };
    checkSignedIn();
  }, []);

  const onStatsChange = (statData) => {
    const newAppData = { ...data };
    // update newData to have the stats api data
    newAppData.statData = statData;
    setData(newAppData);
  };
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route
            path="/SignIn"
            element={<SignIn setIsSignedIn={setIsSignedIn} />}
          />
          <Route
            path="/Home"
            element={
              <Home
                onStatsChange={onStatsChange}
                stats={data.statData}
                isSignedIn={isSignedIn}
                setSignedInUserData={signedInUserData}
                signedInUserData={signedInUserData}
                fetchStats={fetchStats}
              />
            }
          />
          <Route
            path="/Compare"
            element={
              <Compare
                fetchStats={fetchStats}
                signedInUserData={signedInUserData}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
