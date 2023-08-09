import React, { useState, useEffect } from "react";
import Stats from "../Stats/Stats";
import "./Compare.css";
import StatsForm from "../StatsForm/StatsForm";
import { GAME_NAMES } from "../Data/GameNames";
import { fetchStats } from "../Services/api";

const Compare = ({ signedInUserData }) => {
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
  const [userQueue, setUserQueue] = useState([]);
  const [showStats, setShowStats] = useState(null);
  const storedUserQueue = sessionStorage.getItem("userQueue");

  //get the previously stored userqueue everytime the page mounts
  useEffect(() => {
    if (storedUserQueue) {
      setUserQueue(JSON.parse(storedUserQueue));
    }
  }, []);

  //everytime userqueue is updated, sessionStorage will be updated with the new value.
  useEffect(() => {
    sessionStorage.setItem("userQueue", JSON.stringify(userQueue));
  }, [userQueue]);

  // const compareStats = async (userStats1, userStats2) => {
  //   const stats1 = await fetchStats(userStats1);
  //   const stats2 = await fetchStats(userStats2);
  // };
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

    //this is the userdata that will be used to populate the queue with previous users
    const newUser = {
      gamertag: submitData.gamertag,
      platform: submitData.platform,
      gameName: submitData.gameName,
      // Assigned the newUser to have the stats of stats1 because otherUser and newUser are the same and I want the stats to be saved in the userQueue
      stats: stats1,
    };

    setUserQueue((prevQueue) => {
      const updatedQueue = [...prevQueue, newUser];
      // if the queue size is over three, remove oldest user which is the first element of the array
      if (updatedQueue.length > 3) {
        updatedQueue.shift();
      }
      return updatedQueue;
    });
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
      <StatsForm
        handleSubmit={handleSubmit}
        formData={otherUserFormData}
        onGamertagChange={onGamertagChange}
        onPlatformChange={onPlatformChange}
        onGameNameChange={onGameNameChange}
      />
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <div className="stats-container">
          <div className="stats">
            <Stats
              statData={signedInUserStats}
              gameNames={GAME_NAMES}
              formData={signedInUserFormData}
            />
          </div>
          <div className="stats">
            {otherUserStats && (
              <Stats
                statData={otherUserStats}
                gameNames={GAME_NAMES}
                formData={otherUserFormData}
              />
            )}
          </div>
        </div>
      )}
      <div className="user-queue">
        {userQueue.map((user, index) => (
          <div key={index} className="user-item">
            <h1
              className="previous-user"
              onMouseOver={() => setShowStats(index)}
              onMouseOut={() => setShowStats(null)}
            >
              {user.gamertag}
            </h1>
            <div className={`stats ${showStats == index ? "" : "hidden"}`}>
              {user.stats && (
                <Stats
                  statData={user.stats}
                  gameNames={GAME_NAMES}
                  formData={user}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Compare;
