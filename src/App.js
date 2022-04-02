import React, { useState, useEffect } from "react";
import DropDown from "./components/DropDown";
import PlayerBox from "./components/PlayerBox";
import Modal from "./components/Modal";
import Editor from "./components/Editor";
import "./App.css";


import * as MCR from "./api/converter"
import CreateMCR from "./api/coreMCR";
import leaguesJSON from "./leagues.json";
import teamsJSON from "./teams.json";
import Header from "./components/Header";
import Footer from "./components/Footer";

const API_URL = "https://sheltered-depths-57882.herokuapp.com"
let leagues = leaguesJSON.map((l) => l.name_league);

function App() {
  let [teamsData, setTeamsData] = useState([]);
  let [teams, setTeams] = useState([]);
  let [team, setTeam] = useState([]);
  let [teamName, setTeamName] = useState("");
  let [mcrPlayers, setMCRPlayers] = useState([]);
  let [openModal, setOpenModal] = useState(false)
  let [ indexMCR, setIndexMCR ] = useState(-1);

  useEffect(() => {
    console.log(mcrPlayers);
  }, [mcrPlayers]);

  const handleSelect = (index) => {
    let teamSel = teamsData[index].players;
    setTeamName(teamsData[index].name_team)
    console.log(teamSel)
    setTeam(teamSel)    
  }

  const handleLeagueSelect = (index) => {
    let leagueSel = leaguesJSON[index].id_league;    
    setTeams([]);
    setTeamName('');
    setTeam([]);
    fetch(`${API_URL}/leagues/${leagueSel}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setTeamsData(data);
      setTeams(data.map((t) => {
         const team_id = handleTeamId(leagueSel, t.name_team);
          return { name: t.name_team, id: team_id }
        }
      ));
    })
  }

  const handleTeamId = (league, name) => {
    const league_id = teamsJSON.filter(l => l.id === league)[0];
    const team = league_id.childs.filter(t => t.value === name)[0];
    return team?.id;
  }

  const handleView = (index) => {
    console.log(team[index])
  }

  const handleMCR = (index) => {
    console.log(mcrPlayers[index])
    setOpenModal(true)
    setIndexMCR(index)
  }

  const handleAddPlayer = (player) => {
    if(mcrPlayers.length < 23) {
      let mcrPlayer = MCR.toWE2002([player])
      mcrPlayer[0].shirtNumber = mcrPlayers.length + 1;
      mcrPlayer[0].id_player = player.id_player;
      setMCRPlayers(old => [...old, mcrPlayer[0]]);
    }
  }

  const handleRemovePlayer = (player) => {
    if(mcrPlayers.length === 0) {
      console.log("MCRS PLAYERS EMPTY")
      return;
    }

    setMCRPlayers((old) => old.filter((item) => item !== player));
  };

  const selectAll = () => {
    let players = team.length < 23 ? team.slice(mcrPlayers.length,team.length) : team.slice(mcrPlayers.length,23);
    let index = mcrPlayers.length;
    for(let i=0; i<players.length; i++){
      let mcrPlayer = MCR.toWE2002([players[i]]);
      mcrPlayer[0].shirtNumber = index += 1;
      mcrPlayer[0].id_player = players[i].id_player;
      setMCRPlayers((old) => [...old, mcrPlayer[0]]);
    }
  }

  const handleSliderEditor = (value, stat) => {
    console.log(stat, value);
    let mcrAux = [...mcrPlayers]
    let paux ={...mcrPlayers[indexMCR]};
    paux[stat] = value;
    mcrAux[indexMCR] = paux;    
    setMCRPlayers(mcrAux);
  }

  const handleDownloadMCR = async () => {
    if(mcrPlayers.length === 0) return;

    let mcr = await CreateMCR(mcrPlayers);

    const url = window.URL.createObjectURL(new Blob([mcr]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `mcr.mcr`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);    
  }

  return (
    <div className="App">
      <Header />
      <div className="App__dropdowns">
        <DropDown placeholder="Pick a League..." list={leagues} selected={handleLeagueSelect} />
      </div>
      <div className="App__dropdowns">        
        <DropDown placeholder="Pick a team..." list={teams} selected={handleSelect} />
      </div>
      <div className="App__panel">
        <div className="App__panel__player">
          <h2>{teamName ? teamName : "Team"}</h2>
          <button onClick={selectAll}>Select {23 - mcrPlayers.length} player(s)</button>
          {team.map((player, index) => (
            <PlayerBox
              id={player.id_player}
              key={player.id_player}
              name={player.name}
              number={player.jerseyNumber}
              position={player.position}
              onClickButton={() => handleAddPlayer(player)}
            />
          ))}
        </div>
        <div className="App__panel__mcr">
          <h2>{`Jugadores MCR (${mcrPlayers.length}/23)`}</h2>
          <button onClick={handleDownloadMCR}>Download MCR</button>
          {mcrPlayers.map((player, index) => (
            <PlayerBox
              id={player.id_player}
              key={player.name + index}
              name={player.name}
              number={player.shirtNumber}
              position={player.position}
              clickView={() => handleView(index)}
              clickMCR={() => handleMCR(index)}
              onClickButton={() => handleRemovePlayer(player)}
              editable
            />
          ))}
        </div>
      </div>
      <Modal
        isOpen={openModal}
        title={indexMCR !== -1 ? <PlayerNameNumber onChange={handleSliderEditor} id={mcrPlayers[indexMCR]?.id_player} name={mcrPlayers[indexMCR].name} number={mcrPlayers[indexMCR].shirtNumber}/> : null}
        closeModal={() => setOpenModal(false)}
      >
        {indexMCR !== -1 ? (
          <Editor stats={mcrPlayers[indexMCR]} onSlide={handleSliderEditor} />
        ) : null}
      </Modal>
      <Footer />
    </div>
  );
}

function handleIdPlayer(id){
  if(!id) return;
  const splitted = id.split('');
    return splitted[0]+splitted[1]+splitted[2]+"/"+splitted[3]+splitted[4]+splitted[5];
}

function PlayerNameNumber(props) {
  const handleChange = (e, stat) => {
    props.onChange(e.target.value, stat);
  }
  return(
    <>
    {props?.id && <img src={`https://cdn.sofifa.net/players/${handleIdPlayer(props?.id)}/22_180.png`} alt={props.name}/>}
    <div className="pnn">
      <div style={{width: "200px", position: "relative", marginRight: "1em"}}>
        <input maxLength="10" onChange={e=>handleChange(e,"name")} className="pnn__input" type="text" placeholder="Placeholder Text" value={props.name}/>
        <span className="focus-border"></span>
      </div>
      <div style={{width: "80px", position: "relative"}}>
        <input maxLength="2" onChange={e=>handleChange(e,"shirtNumber")} className="pnn__input" type="text" placeholder="Placeholder Text" value={props.number}/>
        <span className="focus-border"></span>
      </div>
    </div>
    </>
  )
}

export default App;