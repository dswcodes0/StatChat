import React from "react";
const Compare = ({ signedInUserData }) => {
  const storedData = JSON.parse(localStorage.getItem("signedInUserData"));
  const userData = signedInUserData || storedData || {};
  console.log(userData);
  return <div>{userData.gamertag}</div>;
};
export default Compare;
