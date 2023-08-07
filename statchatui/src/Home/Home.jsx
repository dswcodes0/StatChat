import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Stats from "../Stats/Stats";
import "./Home.css";
import StatsForm from "../StatsForm/StatsForm";
import { GAME_NAMES } from "../Data/GameNames";

const Home = ({
  onStatsChange,
  stats,
  isSignedIn,
  signedInUserData,
  fetchStats,
}) => {
  const [formData, setFormData] = useState({
    gamertag: "",
    platform: "",
    gameName: "",
  });

  useEffect(() => {
    setFormData({
      gamertag: signedInUserData.gamertag,
      platform: signedInUserData.platform,
      gameName: signedInUserData.gameName,
    });
  }, [signedInUserData]);

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
    <div className="container">
      <h4>Enter your platform and username</h4>
      <StatsForm
        handleSubmit={handleSubmit}
        onGamertagChange={onGamertagChange}
        formData={formData}
        onPlatformChange={onPlatformChange}
        onGameNameChange={onGameNameChange}
      />
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <Stats statData={stats} gameNames={GAME_NAMES} formData={formData} />
      )}
      <div className="compare">
        {isSignedIn ? (
          <Link to="/Compare">Compare your stats!</Link>
        ) : (
          <div className="loader">Sign in to compare your stats!</div>
        )}
      </div>
    </div>
  );
};
export default Home;
