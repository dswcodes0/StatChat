import React, { useState, useEffect } from "react";
import Stats from "../Stats/Stats";
import "./Compare.css";
import StatsForm from "../StatsForm/StatsForm";
import { GAME_NAMES } from "../Data/GameNames";
import { fetchStats } from "../Services/api";

const USER_QUEUE = "userQueue";
const USER_QUEUE_LENGTH = 3;

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
  const [error, setError] = useState(null);
  const [currentStatsIndex, setCurrentStatsIndex] = useState(null);
  const storedUserQueue = sessionStorage.getItem(USER_QUEUE);
  const [userQueue, setUserQueue] = useState(JSON.parse(storedUserQueue) || []);

  //everytime userqueue is updated, sessionStorage will be updated with the new value.
  useEffect(() => {
    sessionStorage.setItem("userQueue", JSON.stringify(userQueue));
  }, [userQueue]);

  const compareUsers = async (user1, user2) => {
    setIsLoading(true); //sets the state to true before the api call is displaying the stats
    let stats1;
    let stats2;
    try {
      stats1 = await fetchStats(user1);
      stats2 = await fetchStats(user2);
      //if this code throws an error, it will not be added to the userqueue
      setOtherUserStats(stats1);
      setSignedInUserStats(stats2);
      setOtherUserFormData(user1);
      setSignedInUserFormData(user2);

      const newUser = {
        gamertag: user1.gamertag,
        platform: user1.platform,
        gameName: user1.gameName,
        stats: stats1,
      };

      setUserQueue((prevQueue) => {
        // removes the existing user with the gamertag, will add it at the front later
        const updatedQueueWithoutUser = prevQueue.filter(
          (user) => user.gamertag !== user1.gamertag
        );

        // adds the user to the front
        const updatedQueue = [newUser, ...updatedQueueWithoutUser];

        if (updatedQueue.length > USER_QUEUE_LENGTH) {
          updatedQueue.pop();
        }

        return updatedQueue;
      });
    } catch (error) {
      setError(error?.message);
    }

    setIsLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const gamertag = event.target.gamertag.value;
    let platform = event.target.platform.value;
    const gameName = event.target.gameName.value;

    const submitData = {
      gamertag,
      platform,
      gameName,
    };
    compareUsers(submitData, signedInUserData);
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
        error={error}
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
      <h1>Previously Searched Users</h1>
      <div className="user-queue">
        {userQueue.map((user, index) => (
          <div key={index} className="user-item">
            <h1
              className="previous-user"
              onMouseOver={() => setCurrentStatsIndex(index)}
              onMouseOut={() => setCurrentStatsIndex(null)}
              onClick={() => {
                compareUsers(user, signedInUserData);
              }}
            >
              {user.gamertag}
            </h1>
            <div
              className={`stats ${currentStatsIndex == index ? "" : "hidden"}`}
            >
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
