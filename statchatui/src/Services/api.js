import { GAME_NAMES } from "../Data/GameNames";

const fetchStats = async (formData) => {
  const apexApiKey = process.env.REACT_APP_API_KEY;
  const baseUrl = "https://api.mozambiquehe.re/bridge?auth=";
  if (
    formData.gamertag === "" ||
    formData.platform === "" ||
    formData.gameName === ""
  ) {
    return null;
  }
  try {
    let response;
    if (formData.gameName === GAME_NAMES.APEX) {
      response = await fetch(
        `${baseUrl}${apexApiKey}&player=${formData.gamertag}&platform=${formData.platform}`
      );
    } else if (formData.gameName === GAME_NAMES.R6) {
      response = await fetch(
        `https://api.henrikdev.xyz/r6/v1/profile/${formData.platform.toLowerCase()}/${
          formData.gamertag
        }`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};

export { fetchStats };
