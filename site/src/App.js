import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AdministrationPanel from './AdministrationSide/AdministrationPanel'
import Home from './PublicSite/Home'
import About from './PublicSite/About'
import Join from './PublicSite/Join'
import Leadership from './PublicSite/Leadership'
import Contact from './PublicSite/Contact'

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Home}/>
        <Route path="/about" exact component={About}/>
        <Route path="/join" exact component={Join}/>
        <Route path="/leadership" exact component={Leadership}/>
        <Route path="/contact" exact component={Contact} />
        <Route path="/administration" exact component={AdministrationPanel}/>
      </Router>
    )
  }
}

export default App;
