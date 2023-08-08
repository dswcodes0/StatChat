import { fetchStats } from "../Services/api";

export async function fetchInitialData(
  isSignedIn,
  setSignedInUserData,
  onStatsChange
) {
  try {
    if (isSignedIn) {
      const profileResponse = await fetch(
        `http://localhost:3002/users/profile`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const profileData = await profileResponse.json();
      setSignedInUserData(profileData);
      const stats = await fetchStats(profileData);
      onStatsChange(stats);
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
}
