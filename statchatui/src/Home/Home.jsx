import React, { useState } from "react";
import Stats from "../Stats/Stats";
const GAME_NAMES = {
  APEX: "Apex",
};
const Home = ({ onStatsChange, stats }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      gamertag: event.target.gamertag.value,
      platform: event.target.platform.value,
      gameName: GAME_NAMES.APEX,
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
      const response = await fetch(
        `${baseUrl}${apiKey}&player=${gamertag}&platform=${platform}`
      );
      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
        onStatsChange(null);
      } else {
        setErrorMessage("");
        onStatsChange(data);
      }
      console.log(data);
      console.log(data.error);
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
        <input type="submit" value="Submit" className="submit-btn" />
        {errorMessage && <p>{errorMessage}</p>}
      </form>
      <Stats statData={stats} errorMessage={errorMessage} />
    </div>
  );
};
export default Home;
