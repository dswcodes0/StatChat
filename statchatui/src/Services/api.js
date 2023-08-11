import { GAME_NAMES } from "../Data/GameNames";
//formdata is the variable that will hold the user's gamertag, platform and gamename
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
    //i did this because the api requires the apex legends xbox field to be X1 instead of Xbox, but for r6, it needs to stay xbox
    if (formData.gameName === GAME_NAMES.APEX && formData.platform === "Xbox") {
      formData.platform = "X1";
    }
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
    } else {
      throw new Error("Enter valid game name. ", formData);
    }
    if (!response.ok) {
      // Handle specific cases of invalid username
      if (response.status === 404) {
        throw new Error("User not found. Please enter a valid username.");
      } else if (response.status === 400) {
        throw new Error("Bad request. Please provide valid input.");
      } else {
        throw new Error(`API request failed with status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting form:", error);

    throw error;
  }
};

async function fetchInitialData() {
  try {
    const profileResponse = await fetch(`http://localhost:3002/users/profile`, {
      method: "GET",
      credentials: "include",
    });
    if (!profileResponse.ok) {
      throw new Error(
        `API request failed with status: ${profileResponse.status}`
      );
    }
    const profileData = await profileResponse.json();
    const stats = await fetchStats(profileData);
    return { stats: stats, profileData: profileData };
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
}

async function postToDatabase(formData) {
  try {
    await fetch(`http://localhost:3002/users/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
      //this includes any cookies or credentials the server might need to validate the user, without this, the user will not be identified in the post request and will not update the correct user in the database
    });
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}

async function checkSignedIn(setIsSignedIn) {
  try {
    const response = await fetch("http://localhost:3002/users/check", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    setIsSignedIn(data.isSignedIn);
  } catch (error) {
    console.error("Error checking user sign-in status:", error);
  }
}

async function addToPrevUsers(user) {
  try {
    const response = await fetch("http://localhost:3002/users/prevUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    console.log("PrevUser added successfully");
  } catch (error) {
    console.error("Error adding prevUser:", error);
  }
}

export {
  fetchStats,
  fetchInitialData,
  postToDatabase,
  checkSignedIn,
  addToPrevUsers,
};
