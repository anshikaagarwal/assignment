import React, { Component } from 'react';
import db from '../config/fb_config'

class DisplayUser extends Component {
  state = {
    userdata: []
  }
  componentDidMount() {
    let arr = []
    db.firestore().collection('User').get().
      then(users => {
        users.forEach(user => {
          const data = user.data();
          arr.push(data);
        });
        this.setState({ userdata: arr });
      });
  }

  renderRow() {
    return this.state.userdata.map(data => {
      return (
        <tr>
          <td>{data["Email Address"]}</td>
          <td>{data["User Name"]}</td>
          <td>{data["Company Name"]}</td>
          <td>{data["Contact Number"]}</td>
        </tr>
      )
    })
  }
  render() {
    return (
      <div class="ui one column stackable center aligned page grid" style={{ marginTop: '30px' }}>
        <div class="column forteen wide">
          <h2>List of registered Users:</h2>
          <table className="ui celled table">
            <thead>
              <tr>
                <th>Email ID</th>
                <th>Attendee's Name</th>
                <th>Company's Name</th>
                <th>Contact Number</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRow()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default DisplayUser;