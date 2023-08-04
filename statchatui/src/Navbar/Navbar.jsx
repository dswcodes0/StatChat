import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = ({ isSignedIn, setIsSignedIn }) => {
  const handleSignout = async () => {
    try {
      const response = await fetch("http://localhost:3002/users/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      console.log(data.message);
      setIsSignedIn(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li className="links">
          <Link to="/">Landing</Link>
        </li>
        <li className="links">
          <Link to="/Home">Home</Link>
        </li>
        {isSignedIn && (
          <Link to="/SignIn">
            <li className="links" onClick={handleSignout}>
              Signout
            </li>
          </Link>
        )}
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
