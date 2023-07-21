import React from "react";

const Home = () => {
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
      console.log(data);
      console.log(response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="container">
      <h4>Enter your platform and epic username</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="user"
          placeholder="Epic Username"
          className="input-field"
        />
        <select name="platform" className="input-field">
          <option value="">Select Platform</option>
          <option value="xbox">Xbox</option>
          <option value="PC">PC</option>
          <option value="playstation">PlayStation</option>
        </select>
        <input type="submit" value="Submit" className="submit-btn" />
      </form>
    </div>
  );
};
export default Home;
