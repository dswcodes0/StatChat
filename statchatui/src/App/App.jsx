import React, { useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../Landing/Landing";
import SignUp from "../SignUp/SignUp";
import SignIn from "../SignIn/SignIn";
import Home from "../Home/Home";
import Navbar from "../Navbar/Navbar";
import { appData } from "../Data/index";

import "./App.css";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [data, setData] = useState(appData);
  const onStatsChange = (statData) => {
    const newAppData = { ...data };
    // update newData to have the stats api data
    newAppData.statData = statData;
    setData(newAppData);
  };
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isSignedIn={isSignedIn} />
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
              <Home onStatsChange={onStatsChange} stats={data.statData} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
