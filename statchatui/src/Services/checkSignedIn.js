const checkSignedIn = async (setIsSignedIn) => {
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
};

export { checkSignedIn };
