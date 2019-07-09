import React, { Component } from 'react';
import * as api from './api/api';
import * as mcr from './api/mcr';
//import { Button } from 'evergreen-ui'
import { Dropdown } from 'semantic-ui-react'
import Table from 'antd/lib/table'; // for js
import 'antd/lib/table/style/css';
//import LoadingOverlay from 'react-loading-overlay';
//import MatrixWaveLoader from './components/MatrixWaveLoader';
import './App.css';
import Overlay from './components/Overlay';
import MatrixWaveLoader from './components/MatrixWaveLoader';
import DivPlayer from './components/DivPlayer';
import * as ObjectsToCsv from 'objects-to-csv';

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  render: text => <a href="#">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  name: 'Disabled User',
  age: 99,
  address: 'Sidney No. 1 Lake Park',
}];

class App extends Component {
  
  state = {
    isLoading: false,
    leagues: [],
    teams: [],
    players: [],
    selectedRowKeys: [],
  }

  selectRow = (record) => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    this.setState({ selectedRowKeys });
  }
  onSelectedRowKeysChange = (selectedRowKeys) => {
    console.log(selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  getLeagues = async () => {    
    this.setState({isLoading: true});
    const leagues = await api.getLeagues();
    this.setState({leagues: leagues, isLoading: false});
    console.log(this.state);
  }

  getTeams = async (index) => {    
    this.setState({isLoading: true});
    //const teams = await api.getTeams(this.state.leagues[index].id);
    const teams = await api.getTeams(index);
    this.setState({teams: teams, isLoading: false});
    console.log(this.state);
  }

  getPlayers = async (index) => {
    this.setState({isLoading: true});
    const players = await api.getPlayers(index);
    let playersWE2002 = mcr.toWE2002(players);
    this.setState({players: players, isLoading: false});
    console.log(playersWE2002)
    
    let csv = new ObjectsToCsv(playersWE2002);
  
    // Return the CSV file as string:
    let csvStr = await csv.toString();
    //console.log(csvStr);
    var universalBOM = "\uFEFF";
    const element = document.createElement("a");    
    element.href = encodeURI('data:text/csv;charset=utf-8,' + universalBOM + csvStr);//URL.createObjectURL(file);
    element.download = "mcr.csv";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }


  getArrayValues = (arr) => {
    var auxArr = [];
    for(var key in Object.keys(arr)) {
      auxArr.push(
        {
          id: arr[key].id,
          text: arr[key].value, 
          value: arr[key].id,
          image: { avatar: true, src: arr[key].img }
        });
    }
    console.log(auxArr)
    return auxArr;
  }

  render() {
    console.log(this.state.isLoading)
    const auxLeagues = this.getArrayValues(this.state.leagues);
    const auxTeams = this.getArrayValues(this.state.teams);
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };
    
    return (
      <div>        
        <Overlay active={this.state.isLoading} text='Loading...' loader={<MatrixWaveLoader/>}/>
        <h1>Hi</h1>
        <button onClick={this.getLeagues}>Connect</button>
        <Dropdown
          placeholder='Select League'
          fluid
          search
          selection          
          options={auxLeagues}
          onChange={(e, selected) => this.getTeams(selected.value)}
        />
        <Dropdown
          placeholder='Select Team'
          fluid
          search
          selection
          options={auxTeams}
          onChange={(e, selected) => this.getPlayers(selected.value)}
        />        

        {this.state.players.map((player, index) => 
          <DivPlayer key={index} name={player.name} number={player.shirtNumber} position={player.position}/>
        )}        
        
      </div>
    );
  }
}

export default App;
