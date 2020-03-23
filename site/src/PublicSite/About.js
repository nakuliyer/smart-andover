import React, { Component } from "react";
import NavBar from './NavBar';

class About extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="fe-root">
          <br/><br/>
          <div class="mini-mission">
            <h1>What is the goal of Smart Andover?</h1>
            <p>
              In the short-term, Smart Andover is establishing a firm foundation with projects that relate to hydroponics,
              connectivity, civic engagement, gamification, and data publicization. For more detail on these projects
              - see below. We are also establishing a connection between different schools such as Princeton and Harvard
              towards our school with webinars, information sharing, and face to face student interaction. This short term
              goal will lead to a long-term relationship between all 3 communities. <br/><br/>In the long-term, we envision Andover’s
              campus to be a blueprint for other campuses and cities. We want to spread the “smart campus” initiative to other
              colleges and high schools to create educational communities that can be living laboratories and sustainable at the
              same time. This can be done by students who will carry on the legacy of Smart Andover as a permanent organization,
              leading to further innovation to mediate environmental and population challenges– creating communities that are human
              and nature-centered.
            </p>
          </div>
          <br/><br/><br/><br/>
          <h1 className="mission-statement">Starting Projects</h1>

          <div class="page-split">
            <div class="mini-mission">
              <h1>Hydroponics</h1>
              <div className="mission-imgs">
                <img alt="" className="project-imgs" src={process.env.PUBLIC_URL + "Hydroponics.png"} />
                <img alt="" className="project-imgs" src ={process.env.PUBLIC_URL + "FirstHarvest.JPG"} />
                <p>First Harvest</p>
              </div>
            </div>
            <div class="mini-mission">
              <h1>Gamification</h1>
              <div className="mission-imgs">
                <img alt="" className="project-imgs" src={process.env.PUBLIC_URL + "SmartAndoverApp.png"} />
              </div>
            </div>
            <div class="mini-mission">
              <h1>Waste and Plastic Management</h1>
              <div className="mission-imgs">
                <img alt="" className="project-imgs" src="https://www.smartcity.press/wp-content/uploads/2018/08/waste-management.jpg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default About;
