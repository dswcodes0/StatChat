import React, { useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../Landing/Landing";
import SignUp from "../SignUp/SignUp";
import SignIn from "../SignIn/SignIn";
import Home from "../Home/Home";
import Stats from "../Stats/Stats";
import { appData } from "../Data/index";

import "./App.css";

function App() {
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
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route
            path="/Home"
            element={
              <Home onStatsChange={onStatsChange} stats={data.statData} />
            }
          />
          <Route path="/Stats" element={<Stats statData={data.statData} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
