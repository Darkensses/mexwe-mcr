import React, { Component } from 'react';
import './App.css';
import * as api from './api/api';
//import { Button } from 'evergreen-ui'
import { Dropdown } from 'semantic-ui-react'
import Table from 'antd/lib/table'; // for js
import 'antd/lib/table/style/css';

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
    leagues: [],
    teams: [],
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
    const leagues = await api.getLeagues();
    this.setState({leagues: leagues});
    console.log(this.state);
  }

  getTeams = async (index) => {    
    //const teams = await api.getTeams(this.state.leagues[index].id);
    const teams = await api.getTeams(index);
    this.setState({teams: teams});
    console.log(this.state);
  }

  getPlayers = async (index) => {
    await api.getPlayers(index);
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
    const auxLeagues = this.getArrayValues(this.state.leagues);
    const auxTeams = this.getArrayValues(this.state.teams);
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };
    
    return (
      <div>
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

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          onRow={(record) => ({
            onClick: () => {
              console.log(record);              
            },
          })}
        />
        
      </div>
    );
  }
}

export default App;
