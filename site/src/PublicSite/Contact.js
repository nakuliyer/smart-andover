import React, { Component } from "react";
import NavBar from './NavBar';

class Contact extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="fe-root">
          <div className="mini-mission">
            <h1>Contact Us</h1>
            <p>We would love to hear from you. Whatever the reason, <br/>we are always open to talk. Just email us at <a id="email" href="mailto:amehta20@gmail.com">smartandover@andover.edu </a> <br/>or reach out to any of the board members.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Contact;
