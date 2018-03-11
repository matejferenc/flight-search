import React, {Component} from 'react';
import './App.css';
import 'react-datetime/css/react-datetime.css';
import {Button, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import DateTime from 'react-datetime';
import moment from 'moment'
import {AsyncTypeahead} from 'react-bootstrap-typeahead';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      from: "",
      to: "",
      date: "",
      flights: [],
      loading: false,
      locationLoading: false
    };

    this.updateFrom = this.updateFrom.bind(this);
    this.updateTo = this.updateTo.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.searchFlights = this.searchFlights.bind(this);
    this.searchLocations = this.searchLocations.bind(this);
  }

  updateFrom(options) {
    if (options && options.length) {
      this.setState({
        from: options[0].id
      });
    } else {
      this.setState({
        from: null
      });
    }
  }

  updateTo(options) {
    if (options && options.length) {
      this.setState({
        to: options[0].id
      });
    } else {
      this.setState({
        to: null
      });
    }
  }

  updateDate(value) {
    const date = moment(value);
    if (date.isValid()) {
      this.setState({
        date: date.format('DD/MM/YYYY')
      });
    } else {
      this.setState({
        date: null
      });
    }
  }

  render() {
    let buttonText = null;
    if (this.state.loading) {
      buttonText = "Loading..."
    } else {
      buttonText = "Search"
    }
    return (
      <div className="container">
        <header className="App-header">
          <h1 className="App-title">Flight Search</h1>
        </header>
        <form onSubmit={this.searchFlights}>
          <FormGroup controlId="from">
            <ControlLabel>From</ControlLabel>
            <AsyncTypeahead
              labelKey={option => option.name}
              filterBy={(option, text) => {return true}}
              isLoading={this.state.locationLoading}
              renderMenuItemChildren={(option, props, idx) => (option.name)}
              onSearch={this.searchLocations}
              onChange={this.updateFrom}
              options={this.state.locationOptions}
            />
          </FormGroup>

          <FormGroup controlId="to">
            <ControlLabel>To</ControlLabel>
            <AsyncTypeahead
              labelKey={option => option.name}
              filterBy={(option, text) => {return true}}
              isLoading={this.state.locationLoading}
              renderMenuItemChildren={(option, props, idx) => (option.name)}
              onSearch={this.searchLocations}
              onChange={this.updateTo}
              options={this.state.locationOptions}
            />
          </FormGroup>

          <FormGroup controlId="date">
            <ControlLabel>Date</ControlLabel>
            <DateTime value={this.state.date} dateFormat="DD/MM/YYYY" timeFormat={false} onChange={this.updateDate} closeOnSelect={true}/>
          </FormGroup>

          <Button type="submit">{buttonText}</Button>
        </form>
        <div>
          <table className="table">
            <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Date & Time</th>
              <th>Price</th>
            </tr>
            </thead>
            <tbody>
            {
              this.state.flights.map((flight, i) => {
                return (
                  <tr key={'flight-row-' + i}>
                    <td>
                      <span>{flight.cityFrom}</span>
                    </td>
                    <td>
                      <span>{flight.cityTo}</span>
                    </td>
                    <td>
                      <span>{moment.unix(flight.dTime).format("DD/MM/YYYY   HH:mm:ss")}</span>
                    </td>
                    <td>
                      <span>{flight.price}€</span>
                    </td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  searchLocations(query) {
    this.setState({locationLoading: true});
    fetch(`https://api.skypicker.com/locations/?term=${query}&v=2&limit=10`)
      .then(resp => resp.json())
      .then(json => {
        this.setState({
          locationLoading: false,
          locationOptions: json.locations
            .map(l => {
              return {'name': l.name, 'id': l.id}
            })
            .filter((value, index, arr) => {//unique names
              return arr.map(obj => obj['name']).indexOf(value['name']) === index;
            }),
        })
      });
  }

  searchFlights(e) {
    e.preventDefault();
    const from = this.state.from;
    const to = this.state.to;
    const date = this.state.date;
    if (!from) {
      alert("Please fill in From");
      return;
    }
    if (!to) {
      alert("Please fill in To");
      return;
    }
    if (!date) {
      alert("Invalid date");
      return;
    }
    this.setState({loading: true});
    fetch(`https://api.skypicker.com/flights?flyFrom=${from}&to=${to}&dateFrom=${date}&dateTo=${date}&curr=eur`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({flights: responseJson.data, loading: false});
      })
      .catch(error => {
        this.setState({flights: [], loading: false});
      })
  }
}

export default App;
