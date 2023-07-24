import React from "react";

const Stats = ({ statData }) => {
  if (!statData) {
    return <div>Stats not yet fetched.</div>;
  }

  let kills, level, name, rank;
  kills = statData.total.kills.value;
  level = statData.global.level;
  name = statData.global.name;
  rank = statData.global.rank.rankName;

  return (
    <div className="container">
      <div>
        <h1>Apex Legends</h1>
        <h2>Stats:</h2>
        <h3>Name: {name}</h3>
        <h3>Level: {level}</h3>
        <h3>Rank: {rank}</h3>
        <h3>Kills: {kills}</h3>
      </div>
    </div>
  );
};

export default Stats;
