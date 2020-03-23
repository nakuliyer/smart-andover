import React, { Component } from "react";

class NavBar extends Component {
  render() {
    return (
      <div className="navbar">
          <ul>
            <li className="navbar-about">
              <a href="/about">About</a>
            </li>
            <li className="navbar-join">
              <a href="/join">Join</a>
            </li>
            <li>
              <a href="/">
                <img src={process.env.PUBLIC_URL + "/SmartAndoverLCrop.png"} className="navbar-img" alt="Logo" />
              </a>
            </li>
            <li className="navbar-contact-us">
              <a href="/contact">Contact Us</a>
            </li>
            <li className="navbar-leadership">
              <a href="/leadership">Leadership</a>
            </li>
          </ul>
        </div>
    )
  }
}

export default NavBar;
