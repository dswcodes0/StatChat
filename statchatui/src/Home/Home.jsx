import React, { useState } from "react";
import Stats from "../Stats/Stats";
import "./Home.css";

const GAME_NAMES = {
  APEX: "Apex Legends",
  R6: "Rainbow Six Siege",
};
const Home = ({ onStatsChange, stats }) => {
  //FIXME initial state should store user's info from the database if it already exists
  const [formData, setFormData] = useState({
    gamertag: "",
    platform: "",
    gameName: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); //sets the state to true before the api call is displaying the stats

    const gamertag = event.target.gamertag.value;
    const platform = event.target.platform.value;
    let gameName = event.target.gameName.value;

    //i did this because the api requires the apex legends xbox field to be X1 instead of Xbox, but for r6, it needs to stay xbox
    if (gameName === GAME_NAMES.APEX && platform === "Xbox") {
      gameName = "X1";
    }

    const formData = {
      gamertag,
      platform,
      gameName,
    };

    try {
      await fetch(`http://localhost:3002/users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
        //this includes any cookies or credentials the server might need to validate the user, without this, the user will not be identified in the post request and will not update the correct user in the database
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }

    const apexApiKey = process.env.REACT_APP_API_KEY;
    const baseUrl = "https://api.mozambiquehe.re/bridge?auth=";

    try {
      let response;
      if (formData.gameName === GAME_NAMES.APEX) {
        response = await fetch(
          `${baseUrl}${apexApiKey}&player=${gamertag}&platform=${platform}`
        );
      } else if (formData.gameName === GAME_NAMES.R6) {
        response = await fetch(
          `https://api.henrikdev.xyz/r6/v1/profile/${platform.toLowerCase()}/${gamertag}`
        );
      }
      const data = await response.json();
      onStatsChange(data);
      setFormData(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setIsLoading(false);
  };
  return (
    //FIXME make this more "react" style later
    <div className="container">
      <h4>Enter your platform and username</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="gamertag"
          placeholder="Username"
          className="input-field"
        />
        <select name="platform" className="input-field">
          <option value="">Select Platform</option>
          <option value="Xbox">Xbox</option>
          <option value="PC">PC</option>
          <option value="PS4">PlayStation</option>
        </select>
        <select name="gameName" className="input-field">
          <option value={GAME_NAMES.APEX}>Apex Legends</option>
          <option value={GAME_NAMES.R6}>Rainbow Six Siege</option>
        </select>
        <input type="submit" value="Submit" className="submit-btn" />
      </form>

      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <Stats statData={stats} gameNames={GAME_NAMES} formData={formData} />
      )}
    </div>
  );
};
export default Home;
