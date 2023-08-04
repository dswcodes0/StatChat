import React, { useState, useEffect } from "react";
import Stats from "../Stats/Stats";
import "./Compare.css";

const GAME_NAMES = {
  APEX: "Apex Legends",
  R6: "Rainbow Six Siege",
};
const Compare = ({ signedInUserData, fetchStats }) => {
  const [signedInUserFormData, setSignedInUserFormData] = useState({
    gamertag: "",
    platform: "",
    gameName: "",
  });

  const [otherUserFormData, setOtherUserFormData] = useState({
    gamertag: "",
    platform: "",
    gameName: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [otherUserStats, setOtherUserStats] = useState(null);
  const [signedInUserStats, setSignedInUserStats] = useState(null);

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

    const submitData = {
      gamertag,
      platform,
      gameName,
    };
    const stats1 = await fetchStats(submitData);
    const stats2 = await fetchStats(signedInUserData);
    setOtherUserStats(stats1);
    setSignedInUserStats(stats2);
    setOtherUserFormData(submitData);
    setSignedInUserFormData(signedInUserData);
    setIsLoading(false);
  };

  const onGamertagChange = (event) => {
    const newGamertag = event.target.value;
    setOtherUserFormData({
      ...otherUserFormData,
      gamertag: newGamertag,
    });
  };
  const onPlatformChange = (event) => {
    const newPlatform = event.target.value;
    setOtherUserFormData({
      ...otherUserFormData,
      platform: newPlatform,
    });
  };
  const onGameNameChange = (event) => {
    const newGameName = event.target.value;
    setOtherUserFormData({
      ...otherUserFormData,
      gameName: newGameName,
    });
  };
  return (
    <div>
      <h4>
        Hey {signedInUserData.gamertag}! enter a user to compare your stats
        with!
      </h4>
      <form onSubmit={handleSubmit}>
        <input
          onChange={onGamertagChange}
          type="text"
          name="gamertag"
          placeholder="Username"
          className="input-field"
          value={otherUserFormData.gamertag}
        />
        <select
          onChange={onPlatformChange}
          name="platform"
          className="input-field"
          value={otherUserFormData.platform}
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
          value={otherUserFormData.gameName}
        >
          <option value={GAME_NAMES.APEX}>Apex Legends</option>
          <option value={GAME_NAMES.R6}>Rainbow Six Siege</option>
        </select>
        <input type="submit" value="Submit" className="submit-btn" />
      </form>
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <div>
          <Stats
            statData={signedInUserStats}
            gameNames={GAME_NAMES}
            formData={signedInUserFormData}
          />
          {otherUserStats && (
            <Stats
              statData={otherUserStats}
              gameNames={GAME_NAMES}
              formData={otherUserFormData}
            />
          )}
        </div>
      )}
    </div>
  );
};
export default Compare;
