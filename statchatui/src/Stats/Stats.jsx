import React from "react";

const Stats = ({ statData }) => {
  console.log(statData);
  const kills = statData?.total?.kills?.value;
  const level = statData?.global?.level;
  const name = statData?.global?.name;
  const rank = statData?.global?.rank?.rankName;

  return (
    <div className="container">
      {statData ? (
        <div>
          <h1>Stats:</h1>
          <h3>Name: {name}</h3>
          <h3>Level: {level}</h3>
          <h3>Rank: {rank}</h3>
          <h3>Kills: {kills}</h3>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Stats;
