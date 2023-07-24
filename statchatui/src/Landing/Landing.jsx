import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-root">
      <nav className="landing-nav">
        <ul>
          <li>
            <Link to="/SignIn">Sign In</Link>
          </li>
          <li>
            <Link to="/SignUp">Sign Up</Link>
          </li>
        </ul>
      </nav>
      <div className="landing-hero">
        <h1>StatChat</h1>
        <div className="features">
          <div className="feature">
            <h3>Live Statistics</h3>
            <p>Get live fortnite statistics!</p>
          </div>
          <div className="feature">
            <h3>Chat</h3>
            <p>Have conversations with other gamers!</p>
          </div>
          <div className="feature">
            <h3>Community Forums</h3>
            <p>
              Engage in discussions, share strategies, and seek advice from
              fellow players!
            </p>
          </div>
        </div>
        <div>
          <Link to="/Home" className="go-home">
            Get Started
          </Link>
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default Landing;
