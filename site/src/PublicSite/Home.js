import React, { Component } from "react";
import NavBar from './NavBar';

class Home extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="fe-root">
          <img src="http://www.beyerblinderbelle.com/media/files/2534_phillipsacademy_projpic05.jpg?w=1200" class="parallax img1" alt="" />
          <h1 class="motto-header top-motto-header">A Sustainability Project</h1>
          <div class="mission">
            <h1>Purpose</h1>
            <p>
              Taking inspiration from the burgeoning field of Smart Cities,
              we are transforming Phillips Andover into a “Smart Campus.” This creative
              transformation will allow the student population to grapple with some of
              the world’s largest and most critical global problems, and at the same
              time make impactful contributions to the citizens of the world.
              <br/><br/>We hope to educate others and foster awareness of sustainability here at
              Andover in order to pilot and test smart city initiatives. Through exploration of
              gamification, hydroponics, and waste management, we as Smart Andover aim to
              address some vital and current needs of students and promote collaboration and connectivity.
            </p>
          </div>
          <img src="https://www.andover.edu/images/News/_hero/owhlnest-render.jpg" class="parallax img2" alt="" />
          <h1 class="motto-header join-club-motto-header">Join the Club</h1>
          <a href="/join"><button class="interactive-button join-club-button">Get Involved</button></a>
          <h1 class="motto-header get-in-touch-motto-header">Get in Touch with Us</h1>
          <a href="/contact"><button class="interactive-button get-in-touch-button">Contact Us</button></a>
        </div>
      </div>
    )
  }
}

export default Home;
