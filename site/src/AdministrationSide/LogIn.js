import React, { Component } from "react";
import axios from 'axios';

import config from '../config.json'

class LogIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      invalid: false
    }

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    axios.post(config.api + 'users/admin/login', { token: this.state.password })
      .then(res => this.props.authorize(res.headers['auth-token']))
      .catch(this.setState({
        invalid: true
      }))
  }

  render() {
    return (
      <div className="login">
        <h3 className="login-label">Login</h3>
        <p>Verify that you're a board member with a passkey below. If you need a key, contact niyer20@andover.edu or whoever is in charge of Smart Andover.</p>
        <input className="admin-pass" type="password" onChange={e => this.setState({ password: e.target.value })}></input>
        <button onClick={this.onSubmit}>Submit</button>
        {this.state.invalid && <p className="error-label">Invalid password.</p>}
      </div>
    )
  }
}

export default LogIn;
