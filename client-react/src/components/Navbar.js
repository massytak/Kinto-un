/** @format */

// components/Navbar.js

import React from "react";
import { Link } from "react-router-dom";
import { logout } from "./auth/auth-service";

const Navbar = (props) => {
  return (
    <nav className="nav-style">
      {props.userInSession ? (
        <ul>
          <li>{props.userInSession.username} is connected</li>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <Link to="/games">Games</Link>
          <button
            onClick={(e) => {
              logout().then(() => props.updateUser(false));
            }}
          >
            Logout
          </button>
        </ul>
      ) : (
        <ul>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
          <li>
            <Link to="/login">Log in</Link>
          </li>
          <li>
            <Link to="/games">Games</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
