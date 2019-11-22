import React from "react";
import { Menu as Nav, Icon, Button } from "element-react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, handleSignOut }) => (
  <Nav mode="horizontal" defaultActive="1">
    <div className="nav-container">
      {/* Title */}
      <Nav.Item index="1">
        <NavLink to="/" className="nav-link">
          <span className="app-title">
            <img
              src="https://icon.now.sh/widgets/f90"
              alt="App Icon"
              className="app-icon"
            />
            Marketplace
          </span>
        </NavLink>
      </Nav.Item>

      {/* Navbar Items */}
      <div className="nav-items">
        <Nav.Item index="2">
          <span className="app-user">Hi, {user.attributes.email}</span>
        </Nav.Item>
        <Nav.Item index="3">
          <NavLink to="/profile" className="nav-link">
            <Icon name="setting" />
          </NavLink>
        </Nav.Item>
        <Nav.Item index="4" className="sign-out">
          <Button type="warning" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Nav.Item>
      </div>
    </div>
  </Nav>
);

export default Navbar;
