import React, {Component} from 'react';
import './App.css';
import 'react-datetime/css/react-datetime.css';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import DateTime from 'react-datetime';
import moment from 'moment'

class Flights extends Component {

  constructor(props) {
    super(props);
    this.state = {
      from: "",
      to: "",
      date: ""
    };

    this.updateFrom = this.updateFrom.bind(this);
    this.updateTo = this.updateTo.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.searchFlights = this.searchFlights.bind(this);
  }

  updateFrom(event) {
    const value = event.target.value;
    this.setState({
      from: value
    });
  }

  updateTo(event) {
    const value = event.target.value;
    this.setState({
      to: value
    });
  }

  updateDate(value) {
    const date = moment(value);
    if(date.isValid()) {
      this.setState({
        date: date.format('DD/MM/YYYY')
      });
    } else {
      alert("Invalid date");
    }
  }

  render() {
    return (
      <div className="container">
        <header className="App-header">
          <h1 className="App-title">Flight Search</h1>
        </header>
        <form onSubmit={() => this.searchFlights()}>
          <FormGroup controlId="from">
            <ControlLabel>From</ControlLabel>
            <FormControl type="text" value={this.state.from} onChange={this.updateFrom}/>
          </FormGroup>

          <FormGroup controlId="to">
            <ControlLabel>To</ControlLabel>
            <FormControl type="text" value={this.state.to} onChange={this.updateTo}/>
          </FormGroup>

          <FormGroup controlId="date">
            <ControlLabel>Date</ControlLabel>
            <DateTime value={this.state.date} dateFormat="DD/MM/YYYY" timeFormat={false} onChange={this.updateDate} />
          </FormGroup>

          <Button type="submit">Submit</Button>
        </form>
      </div>
    );
  }

  searchFlights() {
    const from = this.state.from;
    const to = this.state.to;
    const date = this.state.date;
    if (!date) {
      alert("Invalid date");
      return;
    }
    fetch(`https://api.skypicker.com/flights?flyFrom=${from}&to=${to}&dateFrom=${date}&dateTo=${date}&curr=eur`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({flights: responseJson});
      })
  }
}

export default App;
