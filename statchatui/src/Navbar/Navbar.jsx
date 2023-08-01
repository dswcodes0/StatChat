import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li className="links">
          <Link to="/">Landing</Link>
        </li>
        <li className="links">
          <Link to="/SignUp">Sign Up</Link>
        </li>
        <li className="links">
          <Link to="/SignIn">Sign In</Link>
        </li>
        <li className="links">
          <Link to="/Home">Home</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
