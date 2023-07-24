import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Stats from "../Stats/Stats";

const Home = ({ onStatsChange, stats }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      user: event.target.user.value,
      platform: event.target.platform.value,
    };
    const user = formData.user;
    const platform = formData.platform;
    const apiKey = "230a240b28b946d0adfa08f3a7b6228c";
    const baseUrl = "https://api.mozambiquehe.re/bridge?auth=";

    try {
      const response = await fetch(
        `${baseUrl}${apiKey}&player=${user}&platform=${platform}`
      );
      const data = await response.json();
      onStatsChange(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="container">
      <h4>Enter your platform and username</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="user"
          placeholder="Username"
          className="input-field"
        />
        <select name="platform" className="input-field">
          <option value="">Select Platform</option>
          <option value="Xbox">Xbox</option>
          <option value="PC">PC</option>
          <option value="PS4">PlayStation</option>
        </select>
        <input type="submit" value="Submit" className="submit-btn" />
      </form>
      <Stats statData={stats} />
    </div>
  );
};
export default Home;
