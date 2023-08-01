import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = ({ isSignedIn }) => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li className="links">
          <Link to="/">Landing</Link>
        </li>
        <li className="links">
          <Link to="/Home">Home</Link>
        </li>
        {isSignedIn && <li className="links">Signout</li>}
        {!isSignedIn && (
          <li className="links">
            <Link to="/SignIn">Sign In</Link>
          </li>
        )}
        {!isSignedIn && (
          <li className="links">
            <Link to="/SignUp">Sign Up</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
