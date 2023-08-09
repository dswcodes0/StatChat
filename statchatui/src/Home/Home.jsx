import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Stats from "../Stats/Stats";
import "./Home.css";
import StatsForm from "../StatsForm/StatsForm";
import { GAME_NAMES } from "../Data/GameNames";
import { fetchStats, postToDatabase } from "../Services/api";

const Home = ({ onStatsChange, stats, isSignedIn, signedInUserData }) => {
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
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); //sets the state to true before the api call is displaying the stats

    const gamertag = event.target.gamertag.value;
    let platform = event.target.platform.value;
    const gameName = event.target.gameName.value;

    //i did this because the api requires the apex legends xbox field to be X1 instead of Xbox, but for r6, it needs to stay xbox
    if (gameName === GAME_NAMES.APEX && platform === "Xbox") {
      platform = "X1";
    }

    const formData = {
      gamertag,
      platform,
      gameName,
    };
    //this line pushes the user's info to the database when they submit, updating the database with the newly entered info
    postToDatabase(formData);
    let stats;
    try {
      stats = await fetchStats(formData);
      setFormData(formData);
      onStatsChange(stats);
    } catch (error) {
      setError(error?.message);
    }
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
        error={error}
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
