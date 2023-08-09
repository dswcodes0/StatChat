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
  const [error, setError] = useState(null);

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

  const compareUsers = async (user1, user2) => {
    setIsLoading(true); //sets the state to true before the api call is displaying the stats
    let stats1;
    let stats2;
    let validUser = true;
    try {
      stats1 = await fetchStats(user1);
      stats2 = await fetchStats(user2);
    } catch (error) {
      setError(error?.message);
      validUser = false;
    }
    //if there was an error fetching the stats( meaning that the user does not exist) then it will not be added to the user queue
    if (validUser) {
      setOtherUserStats(stats1);
      setSignedInUserStats(stats2);
      setOtherUserFormData(user1);
      setSignedInUserFormData(user2);

      //checks if the user is in the userqueue already
      const isUserInQueue = userQueue.some(
        (user) => user.gamertag === user1.gamertag
      );
      if (!isUserInQueue) {
        const newUser = {
          gamertag: user1.gamertag,
          platform: user1.platform,
          gameName: user1.gameName,
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
      }
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
              onMouseOver={() => setShowStats(index)}
              onMouseOut={() => setShowStats(null)}
              onClick={() => {
                compareUsers(user, signedInUserData);
              }}
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
