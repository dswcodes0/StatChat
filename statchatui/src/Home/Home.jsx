import React, { useState, useEffect } from "react";
import Stats from "../Stats/Stats";
import "./Home.css";

const GAME_NAMES = {
  APEX: "Apex Legends",
  R6: "Rainbow Six Siege",
};
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
const Home = ({ onStatsChange, stats, isSignedIn }) => {
  const [formData, setFormData] = useState({
    gamertag: "",
    platform: "",
    gameName: "",
  });

  const getUserInfo = async () => {
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
        setFormData({
          gamertag: profileData.gamertag,
          platform: profileData.platform,
          gameName: profileData.gameName,
        });
        const stats = await fetchStats(profileData);
        onStatsChange(stats);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [isSignedIn]); // calls getuserinfo when the page initiallly loads and only when it initially loads.

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

    const stats = await fetchStats(formData);
    setFormData(formData);
    onStatsChange(stats);
    setIsLoading(false);
  };
  const onGamertagChange = (event) => {
    const newGamertag = event.target.value;
    setFormData({
      ...formData,
      gamertag: newGamertag,
    });
  };
  const onPlatformChange = (event) => {
    const newPlatform = event.target.value;
    setFormData({
      ...formData,
      platform: newPlatform,
    });
  };
  const onGameNameChange = (event) => {
    const newGameName = event.target.value;
    setFormData({
      ...formData,
      gameName: newGameName,
    });
  };
  return (
    //FIXME make this more "react" style later
    <div className="container">
      <h4>Enter your platform and username</h4>
      <form onSubmit={handleSubmit}>
        <input
          onChange={onGamertagChange}
          type="text"
          name="gamertag"
          placeholder="Username"
          className="input-field"
          value={formData.gamertag}
        />
        <select
          onChange={onPlatformChange}
          name="platform"
          className="input-field"
          value={formData.platform}
        >
          <option value="">Select Platform</option>
          <option value="Xbox">Xbox</option>
          <option value="PC">PC</option>
          <option value="PS4">PlayStation</option>
        </select>
        <select
          onChange={onGameNameChange}
          name="gameName"
          className="input-field"
          value={formData.gameName}
        >
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
