import React, { Component } from "react";
import axios from 'axios';

import PaginatedList from './PaginatedList'
import config from '../config.json'

class LoggedIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      total: 0
    }

    axios.defaults.headers.common = {'auth-token': this.props.jwt}
    this.forceRecount = this.forceRecount.bind(this);
    this.forceRecount();

    // this.getImagesPaginated = this.getImagesPaginated.bind(this);

    // this.getImagesPaginated(1,0);
  }

  forceRecount() {
    console.log('recounting...')
    axios.get(config.api + 'activities/count/')
      .then(e => this.setState({
        total: parseInt(e.data)
      }))
  }

  // getImagesPaginated(limit, page) {
  //   axios.get(config.api + `activities/admin?limit=${limit}&page=${page}`)
  //     .then((res) => this.setState({
  //       images: res.data
  //     }))
  // }

  render() {
    return (
      <div className="logged-in">
        <h3 className="login-label">Welcome!</h3>
        <p>Welcome to the Smart Andover Backend! You have {this.state.total} images to look at</p>
        <button onClick={this.forceRecount}>Click here to refresh</button>
        <PaginatedList
          total={this.state.total}
          forceRecount={this.forceRecount}
          //getFunction={this.getImagesPaginated}
          //images={this.state.images}
        />
        {/*this.state.images.map((image) =>
          <img src={`data:image/png;base64,${image.photo}`}/>
        )*/}
      </div>
    )
  }
}

export default LoggedIn;
