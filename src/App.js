import React, { Component } from 'react';
import './App.css';
import * as api from './api/api';
import { Combobox, Button } from 'evergreen-ui'

class App extends Component {
  
  state = {
    leagues: [],
    teams: []
  }

  getLeagues = async () => {
    const leagues = await api.getLeagues();
    this.setState({leagues: leagues});
    //console.log(this.state);
  }

  getTeams = async (index) => {    
    const teams = await api.getTeams(this.state.leagues[index].id);
    this.setState({teams: teams});
    //console.log(this.state);
  }

  getArrayValues = (arr) => {
    var auxArr = [];
    for(var key in Object.keys(arr)) {
      auxArr.push(arr[key].value);
    }
    return auxArr;
  }

  render() {
    const auxLeagues = this.getArrayValues(this.state.leagues);
    const auxTeams = this.getArrayValues(this.state.teams);
    
    return (
      <div>
        <h1>Hi</h1>
        <Button onClick={this.getLeagues}>Connect</Button>
        <Combobox
          items={auxLeagues}
          onChange={selected => this.getTeams(auxLeagues.indexOf(selected))}
          placeholder="Leagues"
          autocompleteProps={{
            // Used for the title in the autocomplete.
            title: 'LEAGUE'
          }}
        />
        <Combobox
          items={auxTeams}
          onChange={selected => console.log(selected)}
          placeholder="Teams"
          autocompleteProps={{
            // Used for the title in the autocomplete.
            title: 'Team'
          }}
        />
      </div>
    );
  }
}

export default App;
