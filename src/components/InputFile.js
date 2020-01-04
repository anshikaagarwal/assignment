import React, { Component } from 'react';
import Papa from 'papaparse';
import db from '../config/fb_config'
class InputFile extends Component {
	state = {
		header: [],
		values: []
	}

	alertAndRemoveExistingUser(data) {
		var inputEmails = data.map(obj => obj["Email Address"]);
		let existingEmails = [];
		return db.firestore().collection('User').get().
			then(users => {
				users.forEach(user => {
					existingEmails.push(user.data()["Email Address"]);
				});
				var alertList = [], count = 0;
				alertList = inputEmails.filter(email => {
					if (existingEmails.includes(email)) {
						data.splice(count, 1);
						return 1;
					} else {
						return 0;
					}
					count++;
				})
				if (alertList.length > 0) {
					alert(`Users with following eamil ID's already exists: ${alertList}`);
				}
				return data;

			});
	}
	submitData(e) {
		e.preventDefault();
		var fields = ["Email Address", "User Name", "Company Name", "Contact Number"]
		var dropdown = e.target.dropdown;
		var count = 0;
		var arr = [];
		dropdown.forEach(data => {
			if (fields.includes(data.value)) {
				arr.push(count);
			}
			count++;
		});
		var data = [];
		this.state.values.forEach(value => {

			let obj = {}, i, index;
			arr.forEach(index => {
				obj[dropdown[index].value] = value[index]
			});
			data.push(obj);

		})

		this.alertAndRemoveExistingUser(data).then(data => {
			if (data.length > 0) {
				data.forEach(obj => { db.firestore().collection('User').add(obj) });
				alert('Your Data has been submitted successfully!!')
			}
			this.setState({ header: [], value: [] });
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		var fileUpload = e.target.filename;

		var header = [], values = [];
		Papa.parse(fileUpload.files[0], {
			complete: function (results) {
				header = results.data[0];
				results.data.shift();
				results.data.pop();
				values = results.data;
				this.setState({ header, values });
			}.bind(this)
		})

	}

	displayFile() {
		let i = 0, template = [], inputFields = [];
		if (this.state.header.length > 0) {
			template[0] = <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Your Response:</h2>;

			for (i = 0; i < this.state.header.length; i++) {
				inputFields.push(
					<div className="item">
						<div className="content">
							<div className="header">
								<div className="left floated">{this.state.header[i]}</div>
								<div className="right floated">
									<select className="ui dropdown" name="dropdown" style={{ marginRight: "20px", width: '200px' }} >
										<option>Yet to map</option>
										<option>Email Address</option>
										<option>User Name</option>
										<option>Company Name</option>
										<option>Contact Number</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				);
			}
			template.push(
				<form onSubmit={this.submitData.bind(this)}>
					<div className="ui relaxed divided list">{inputFields}</div>
					<div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '10px' }}>
						<button className="ui button positive" type="submit" style={{ width: '450px' }}>Submit</button>
					</div>
				</form>
			)
		}
		return template;

	}

	render() {

		return (
			<div>
				<h2 style={{ textAlign: 'center', marginTop: '50px' }}>Upload Your File:</h2>

				<form class="ui form container" style={{ width: '800px' }} onSubmit={this.handleSubmit.bind(this)}>
					<div className="field">
						<input type="file" name="filename" placeholder="upload..." />
					</div>
					<div style={{ textAlign: 'center' }}>
						<button className="ui button blue" type="submit" style={{ width: '450px' }}>Preview</button>
					</div>
				</form>
				<div className="ui container" style={{ width: '800px' }}>{this.displayFile()}</div>
			</div>
		)
	}
}

export default InputFile;