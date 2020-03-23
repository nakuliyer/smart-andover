import React, { Component } from "react";
import NavBar from './NavBar';

class Join extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="fe-root">
          <div className="mini-mission">
            <h1>Join</h1>
            <p>Smart Andover is open to any Phillips Academy student, <br/>regardless of background or experience.</p>
          </div>
          <br/><br/><br/><br/>
          <h1 class="mission-statement">Mailing List</h1>
          <div align="center">
            <img alt="" src="https://static1.squarespace.com/static/567b0bfb7086d78817a7503e/t/59d130d16f4ca3b208730eb7/1506881755518/Mail.png?format=500w" width="10%" height="auto" />
          </div>
          <br/>
          <p class="description" align="center">The best way to stay informed about when and where the club is meeting is to join the club's mailing list.</p>
          <div align='center'>
            <table width='450' border='0' align='center' cellpadding='3' cellspacing='1'>
              <tr>
                <td><strong>Contact Us</strong></td>
                </tr>
            </table>
            <table width='450' border='0' align='center' cellpadding='3' cellspacing='1'>
              <tr>
                <td>
                  <form action="https://formspree.io/amehta20@andover.edu" method='POST'>
                    <table width="100%" border='0' align='center' cellpadding='3' cellspacing='1'>
                      <tr>
                        <td width="16%">Subject</td>
                        <td width="2%">:</td>
                        <td width="82%"><input name='Subject' type='text' id='subject' size="50" /></td>
                      </tr>

                      <tr>
                        <td>Message</td>
                        <td>:</td>
                        <td><textarea name='Message' cols="50" rows="4" id='message'></textarea></td>
                      </tr>

                      <tr>
                        <td>Name</td>
                        <td>:</td>
                        <td><input name='Name' type='text' id='name' size="50" /></td>
                      </tr>

                      <tr>
                        <td>Email</td>
                        <td>:</td>
                        <td><input name='Email' type='text' id='email' size="50" /></td>
                      </tr>

                      <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td><input type='submit' name='submit' value='Submit' onclick="sendMail()" /><input type='reset' name='submit2' value='Reset' /></td>
                      </tr>
                    </table>
                  </form>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default Join;
