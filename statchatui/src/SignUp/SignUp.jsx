import React from "react";
import "./SignUp.css";

const SignUp = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      Username: event.target.username.value,
      Email: event.target.email.value,
      Password: event.target.password.value,
    };
    try {
      const response = await fetch("http://localhost:3002/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Sign-up successful!");
        //FIXME REDIRECT USER TO HOME WITH THE CREDENTIALS ENTERED
      } else {
        const errorData = await response.json();
        alert(`Sign-up failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
