import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      Username: event.target.username.value,
      Password: event.target.password.value,
    };

    try {
      const response = await fetch("http://localhost:3002/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/Home");
        alert("login succesful");
      } else {
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="container">
      <h1>Let's get back into it!</h1>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
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
      <Link to="/SignUp" className="sign-in-redirect">
        Create An Account
      </Link>
    </div>
  );
};
export default SignIn;
