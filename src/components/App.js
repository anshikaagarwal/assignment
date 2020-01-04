import React, { Component } from 'react';
import InputFile from './InputFile'
import Displayuser from './DisplayUsers'

class App extends Component {
	state = { toggle: 0 }
	renderView() {
		console.log(this.state.toggle)
		if (this.state.toggle) {
			return <Displayuser />
		} else {
			return <InputFile />
		}
	}
	setZero() {
		this.setState({ toggle: 0 })
	}
	setOne() {
		this.setState({ toggle: 1 })
	}
	render() {
		return (
			<div style={{ textAlign: 'center' }}>
				<div class="ui buttons" style={{ width: '600px', marginTop: '50px' }}>
					<button class="ui button blue" onClick={this.setZero.bind(this)}>Add Registered Users</button>
					<div className="or"></div>
					<button class="ui positive button" onClick={this.setOne.bind(this)}>View Registered Users</button>
				</div>
				{this.renderView()}
			</div>
		)
	}
}

export default App;