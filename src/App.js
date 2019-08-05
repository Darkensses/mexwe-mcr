import React, { Component } from "react";
import * as api from "./api/api";
import * as mcr from "./api/mcr";
import DD from "./components/DD";
//import LoadingOverlay from 'react-loading-overlay';
//import 'semantic-ui-css/semantic.min.css';
import "./App.css";
import Overlay from "./components/Overlay";
import MatrixWaveLoader from "./components/MatrixWaveLoader";
import DivPlayer from "./components/DivPlayer";
import * as ObjectsToCsv from "objects-to-csv";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  
  constructor(props) {
      super(props);
      this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
      this.state = {
      isLoading: false,
      leagues: [],
      teams: [],
      players: [],
      playersWE2002: [],
      checkedListAll: [],
      ItemsChecked: false,
      auxplayer: [{
        name: "J.Orozco",
        position: "GK",
        shirtNumber: 1,
      },
      {
        name: "Abella",
        position: "CB",
        shirtNumber: 4,
      },
      {
        name: "Furch",
        position: "CF",
        shirtNumber: 10,
      }],      
      auxLeagues: [],
      auxTeams: [],
    };    
  }

  getLeagues = async () => {    
    /*fetch("http://localhost:9000/mcr/download")
    .then(res => res)
    .then(res => console.log(res))
    .catch(err => err);*/
    this.setState({ isLoading: true });
    const leagues = await api.getLeagues();
    this.setState({ leagues: leagues, isLoading: false });    
    this.getArrayValues(this.state.leagues, 'auxLeagues');
  };

  getTeams = async index => {
    this.setState({ isLoading: true });
    //const teams = await api.getTeams(this.state.leagues[index].id);
    const teams = await api.getTeams(index);
    this.setState({ teams: teams, isLoading: false });   
    this.getArrayValues(this.state.teams, 'auxTeams'); 
  };

  getPlayers = async index => {
    this.setState({ isLoading: true });
    const players = await api.getPlayers(index);
    let playersWE2002 = mcr.toWE2002(players);
    this.setState({ players: players, playersWE2002: playersWE2002, isLoading: false });
    console.log(playersWE2002);    

    /*fetch("http://localhost:9000/mcr", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(playersWE2002)
    })
      .then(res => res.text())
      .then(res => console.log(res))
      .catch(err => err);*/
  };

  downloadMCR = async () => {
    if(this.state.checkedListAll.length < 23) {
      toast.error(`🤯 Selection has ${this.state.checkedListAll.length} of 23 players: the team doesn't have enough players.`);
      return;
    }    

    let jsonPlayers = [];
    let selectedPlayers = this.state.checkedListAll
    for (var i = 0; i < selectedPlayers.length; i++) {
      jsonPlayers.push(this.state.playersWE2002[selectedPlayers[i]]);            
    }

    console.log(jsonPlayers);

    // http://localhost:9000/mcr
    await fetch("https://snappy-storm-153720.appspot.com/mcr", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonPlayers)
    })
      .then(response => response.blob())
      .then(blob => {
        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `mcr.mcr`);
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      })
      .catch(err => err);
  }

  downloadCSV = async () => {
    if(this.state.players.length === 0) {
      toast.error(`😬 Team is empty. Please Select a team to get all the players.`);
      return;
    }
    let csv = new ObjectsToCsv(this.state.playersWE2002);

    // Return the CSV file as string:
    let csvStr = await csv.toString();
    var universalBOM = "\uFEFF";
    const element = document.createElement("a");
    element.href = encodeURI(
      "data:text/csv;charset=utf-8," + universalBOM + csvStr
    ); 
    element.download = "mcr.csv";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    element.parentNode.removeChild(element);
  }

  getArrayValues = (arr, arrName) => {
    var auxArr = [];
    for (var key in Object.keys(arr)) {
      auxArr.push({
        id: arr[key].id,
        title: arr[key].value,
        key: arrName,
        image: arr[key].img
      });
    }
    console.log(auxArr);
    //return auxArr;
    this.setState({[arrName]: auxArr});
  };

  compareSort ( a, b ){ return a - b; }

  handleCheckboxClick = e => {        
    let { checkedListAll } = this.state;
    const { value, checked } = e.target;
    console.log(value);    
    if (checked && checkedListAll.length < 23) {
      this.setState(prevState => ({
        checkedListAll: [...prevState.checkedListAll, Number(value)].sort(this.compareSort)
      }));
    } else {      
      this.setState(prevState => ({
        checkedListAll: prevState.checkedListAll.filter(item => item !== Number(value))
      }));
      if(checkedListAll.length === 23) {
        toast.info(`🙆‍ Team full: ${checkedListAll.length} of 23 players selected.`);
      }
    }
  }

  selectAll = () => {
    this.setState({checkedListAll: [], ItemsChecked: false})
    let collection = [];
    for(var i = 0; i < 23; i++) {
      collection.push(i)
    }

    this.setState({
      checkedListAll: collection.sort(this.compareSort),
      ItemsChecked: true
    });
  }

  selectedItems(e) {
    const { value, checked } = e.target;
    let { checkedListAll } = this.state;

    if (checked) {
      checkedListAll = [...checkedListAll, value];
    } else {
      checkedListAll = checkedListAll.filter(el => el !== value);
      if (this.state.ItemsChecked) {
        this.setState({
          ItemsChecked: !this.state.ItemsChecked
        });
      }
    }
    this.setState({ checkedListAll });    
  }

  // id: index, key: list
  resetThenSet = (id, key) => {    
    let temp = JSON.parse(JSON.stringify(this.state[key]))
    temp.forEach(item => item.selected = false);
    console.log(temp);
    
    let idx = temp.findIndex(x => x.id === id);
    temp[idx].selected = true;
    console.log(temp[idx])
    this.setState({
      [key]: temp
    })
  }

  render() {    
    const {auxplayer} = this.state;

    return (
      <div>
        <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
        />
     
        <Overlay
          active={this.state.isLoading}
          text="Loading..."
          loader={<MatrixWaveLoader />}
        />
        
        <h1>MexWE</h1>
        <button onClick={this.getLeagues}>Connect</button>
        <DD
            title="Select League"
            list={this.state.auxLeagues}
            resetThenSet={this.resetThenSet}   
            onChange={selected => this.getTeams(selected.id)}         
        />
        <DD
            title="Select Team"
            list={this.state.auxTeams}
            resetThenSet={this.resetThenSet}   
            onChange={selected => this.getPlayers(selected.id)}         
        />
        
        <button onClick={this.selectAll}>Select default</button>
        {/*
          auxplayer.map((player, index) => (
            <DivPlayer
              key={index}
              name={player.name}
              number={player.shirtNumber}
              position={player.position}
              item={index}
              handleCheckboxClick={this.handleCheckboxClick}
              checkedListAll={this.state.checkedListAll}              
              ItemsChecked={this.state.ItemsChecked}
            />
          ))*/
        }
        

        {this.state.players.map((player, index) => (
          <DivPlayer
            key={index}
            name={player.name}
            number={player.shirtNumber}
            position={player.position}
            item={index}
            handleCheckboxClick={this.handleCheckboxClick}
            checkedListAll={this.state.checkedListAll}              
            ItemsChecked={this.state.ItemsChecked}
          />
        ))}
        <button onClick={this.downloadMCR}>Download MCR</button>
        <button onClick={this.downloadCSV}>Download CSV</button>
        {<pre>Selected List: {JSON.stringify(this.state.checkedListAll, null, 2)}</pre>}
      </div>
    );
  }
}

export default App;
