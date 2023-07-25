import React from "react";
import Stats from "../Stats/Stats";

const Home = ({ onStatsChange, stats }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      gamertag: event.target.gamertag.value,
      platform: event.target.platform.value,
    };

    try {
      await fetch(`http://localhost:3002/users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }

    const gamertag = formData.gamertag;
    const platform = formData.platform;
    const apiKey = process.env.REACT_APP_API_KEY;
    const baseUrl = "https://api.mozambiquehe.re/bridge?auth=";

    try {
      const response = await fetch(
        `${baseUrl}${apiKey}&player=${gamertag}&platform=${platform}`
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
          name="gamertag"
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
