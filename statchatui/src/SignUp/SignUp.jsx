import React from "react";
import "./SignUp.css";

const SignUp = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
  };
  return (
    <div className="container">
      <h1 className="title-signup">Begin your journey!</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
        />
        <input type="submit" value="Submit" className="submit-btn" />
      </form>
    </div>
  );
};

export default SignUp;
