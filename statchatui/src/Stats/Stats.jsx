import React from "react";

const Stats = ({ statData }) => {
  const kills = statData?.total?.kills?.value;
  return (
    <div className="container">
      {statData ? (
        <div>
          <h1>Stats:</h1>
          <p>Kills: {kills}</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Stats;
