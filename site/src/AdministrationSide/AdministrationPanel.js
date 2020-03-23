import React, { Component } from "react";

import LogIn from './LogIn'
import LoggedIn from './LoggedIn'

class AdministrationPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jwt: ""
    }

    this.authorize = this.authorize.bind(this);
  }

  authorize(token) {
    this.setState({
      jwt: token
    })
  }

  render() {
    return (
      <div className="App">
        <div className="contents">
          <div className="header">
            <div className="header-title">Smart Andover Application Administration</div>
            <img src={process.env.PUBLIC_URL + "/SmartAndoverLCrop.png"} className="logo-image" alt={"Logo"} />
          </div>
          <div className="root">
            <p>This site is meant for Smart Andover board members to verify submitted images from the mobile application.</p>
            {
              this.state.jwt ?
              <LoggedIn
                jwt={this.state.jwt}
              />
                :
              <LogIn
                authorize={this.authorize}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

export default AdministrationPanel;
