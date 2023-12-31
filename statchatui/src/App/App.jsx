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
import { fetchInitialData, checkSignedIn } from "..//Services/api";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [data, setData] = useState(appData);
  const [signedInUserData, setSignedInUserData] = useState({
    gamertag: "",
    platform: "",
    gameName: "",
  });

  const onStatsChange = (statData) => {
    const newAppData = { ...data };
    // update newData to have the stats api data
    newAppData.statData = statData;
    setData(newAppData);
  };

  useEffect(() => {
    async function fetchData() {
      if (isSignedIn) {
        const initialData = await fetchInitialData();
        setSignedInUserData(initialData.profileData);
        const stats = initialData.stats;
        onStatsChange(stats);
      }
    }
    fetchData();
  }, [isSignedIn]);

  useEffect(() => {
    //everytime the page is refreshed this function will fetch to see if req.session.userId exists, if it does, we will set  signed in to true.
    checkSignedIn(setIsSignedIn);
  }, []);

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
              />
            }
          />
          <Route
            path="/Compare"
            element={<Compare signedInUserData={signedInUserData} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
