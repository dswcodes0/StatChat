import React, { useState } from "react";
import Stats from "../Stats/Stats";
const GAME_NAMES = {
  APEX: "Apex Legends",
  R6: "Rainbow Six Siege",
};
const Home = ({ onStatsChange, stats }) => {
  const [formData, setFormData] = useState({
    gamertag: "",
    platform: "",
    gameName: "",
  });
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      gamertag: event.target.gamertag.value,
      platform: event.target.platform.value,
      gameName: event.target.gameName.value,
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

    const gamertag = formData.gamertag;
    const platform = formData.platform;
    const apiKey = process.env.REACT_APP_API_KEY;
    const baseUrl = "https://api.mozambiquehe.re/bridge?auth=";

    try {
      let response;
      if (formData.gameName === GAME_NAMES.APEX) {
        response = await fetch(
          `${baseUrl}${apiKey}&player=${gamertag}&platform=${platform}`
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
  };
  return (
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
      <Stats statData={stats} gameNames={GAME_NAMES} formData={formData} />
    </div>
  );
};
export default Home;
