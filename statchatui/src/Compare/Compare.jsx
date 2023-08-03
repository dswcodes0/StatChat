import React from "react";
const Compare = ({ signedInUserData, fetchStats }) => {
  const storedData = JSON.parse(localStorage.getItem("signedInUserData"));
  const userData = signedInUserData || storedData || {};
  console.log(userData);
  return (
    <div>
      Hello {userData.gamertag}! enter a user to compare your stats with!
    </div>
  );
};
export default Compare;
