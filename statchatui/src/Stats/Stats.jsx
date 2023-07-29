import React from "react";

const Stats = ({ statData, gameNames, formData }) => {
  if (!statData) {
    return <div>{"Stats not yet fetched."}</div>;
  }
  let kills, level, name, rank;
  if (statData.status === 404) {
    return <div>Error: {statData.errors[0].message}</div>;
    // this handles the error if the r6 username does not exist
  }
  if (statData.Error) {
    return <div>Error: {statData.Error}</div>;
  }
  if (formData.gameName === gameNames.APEX) {
    if (statData.total) {
      kills = statData.total.kills.value;
    }
    if (statData.global) {
      level = statData.global.level;
      name = statData.global.name;
      rank = statData.global.rank.rankName;
    }
  } else if (formData.gameName === gameNames.R6) {
    if (statData.data) {
      name = statData.data.metadata.user;
      level = statData.data.metadata.level;
      rank = statData.data.stats_general.rank.mmr;
      kills = statData.data.stats_general.kills;
    }
  }

  return (
    <div className="container">
      <div>
        {formData.gameName && <h1>{formData.gameName}</h1>}
        <h2>Stats:</h2>
        {name && <h3>Name: {name}</h3>}
        {level && <h3>Level: {level}</h3>}
        {rank && <h3>Rank: {rank}</h3>}
        {kills && <h3>Kills: {kills}</h3>}
      </div>
    </div>
  );
};

export default Stats;
