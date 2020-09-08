import React, { useRef } from "react";
import Slider from "react-input-slider";
import { Checkbox, Radio, RadioGroup, useRadioState } from "pretty-checkbox-react";
import "pretty-checkbox";
import "./styles.css";
import DropDown from "../DropDown";
import { FaRegCheckSquare } from "react-icons/fa";

function Stat(props) {
  const handleOnChange = ({x}) => {
      props.onSlide({x})
  }
  return (
    <div className="Editor__stat">
      <span style={{ flex: 1 }}>{props.skill}</span>
      <Slider
        axis="x"
        xstep={1}
        xmin={props.min ? props.min : 12}
        xmax={props.max ? props.max : 19}
        x={props.val}
        onChange={handleOnChange}
        style={{ flex: 2 }}
      />
      <span className="Editor__stat__val">{props.val}</span>
    </div>
  );
}

function DropStat(props) {
  return (
    <div className="Editor__stat" style={{paddingTop: "1em"}}>
      <span style={{ flex: 1 }}>{props.skill}</span>
      <DropDown style={{minWidth: "120px"}} list={props.list} placeholder={props.placeholder} selected={props.selected}/>
    </div>
  );  
}

function CheckStat(props) {
  return (
    <div className="Editor__stat">
      <span style={{ flex: 1 }}>{props.skill}</span>
      {props.children}
    </div>
  );
}

function Editor(props) {
  //let [stats, setStats] = useState(props.stats)
  let positions = ["GK", "CB", "SB", "DH", "SH", "OH", "CF", "WG"];
  let bodyTypes = ["A", "B", "C", "D", "F", "G", "H"]
  let foots = ["Left", "Right", "Both"]
  let checkOutside = useRef();

  const handleOnSlide = (x, stat) => {
      props.onSlide(x, stat)
      //setStats(old => ({...old, [stat]: x}))
  }

  const handleSelect = (index, stat) => {
    switch (stat) {
      case "position":
        props.onSlide(positions[index], stat);
        break;

      case "body":
        props.onSlide(bodyTypes[index], stat);
        break;

      default:
        break;
    }    
  }

  const handleCheck = (stat) => {    
    props.onSlide(checkOutside.current.checked ? "YES" : "NO", stat);
  }

  return (
    <div className="Editor">
      <Stat skill="Offense" val={props.stats.offense} onSlide={({x}) => handleOnSlide(x, "offense")} />
      <Stat skill="Defense" val={props.stats.defense} onSlide={({x}) => handleOnSlide(x, "defense")} />
      <Stat skill="Body Balance" val={props.stats.bodyBalance} onSlide={({x}) => handleOnSlide(x, "bodyBalance")} />
      <Stat skill="Stamina" val={props.stats.stamina} onSlide={({x}) => handleOnSlide(x, "stamina")} />
      <Stat skill="Speed" val={props.stats.speed} onSlide={({x}) => handleOnSlide(x, "speed")} />
      <Stat skill="Acceleration" val={props.stats.acceleration} onSlide={({x}) => handleOnSlide(x, "acceleration")} />
      <Stat skill="Pass" val={props.stats.passAccuracy} onSlide={({x}) => handleOnSlide(x, "passAccuracy")} />
      <Stat skill="Shoot Power" val={props.stats.shotPower} onSlide={({x}) => handleOnSlide(x, "shotPower")} />
      <Stat skill="Shoot Acc." val={props.stats.shotAccuracy} onSlide={({x}) => handleOnSlide(x, "shotAccuracy")} />
      <Stat skill="Jump" val={props.stats.jumpPower} onSlide={({x}) => handleOnSlide(x, "jumpPower")} />
      <Stat skill="Head" val={props.stats.headAccuracy} onSlide={({x}) => handleOnSlide(x, "headAccuracy")} />
      <Stat skill="Technique" val={props.stats.technique} onSlide={({x}) => handleOnSlide(x, "technique")} />
      <Stat skill="Dribble" val={props.stats.dribble} onSlide={({x}) => handleOnSlide(x, "dribble")} />
      <Stat skill="Curve" val={props.stats.curve} onSlide={({x}) => handleOnSlide(x, "curve")} />
      <Stat skill="Aggresive" val={props.stats.agression} onSlide={({x}) => handleOnSlide(x, "agression")} />
      <Stat skill="Response" val={props.stats.response} onSlide={({x}) => handleOnSlide(x, "response")} />
      <Stat skill="Height" val={props.stats.height} min={148} max={211} onSlide={({x}) => handleOnSlide(x, "height")} />
      <Stat skill="Age" val={props.stats.age} min={15} max={46} onSlide={({x}) => handleOnSlide(x, "age")} />      
      <CheckStat skill="Outside">
        <Checkbox
          ref={checkOutside}
          icon={<FaRegCheckSquare color="#5e72e4" />}
          checked={props.stats.outside === "YES" ? true : false}
          onChange={(e) => handleCheck("outside")}
          shape="curve"
          animation="jelly">
          YES
        </Checkbox>
      </CheckStat>
      <DropStat skill="Foot" placeholder={props.stats.foot} list={foots} selected={(i) => handleSelect(i, "foot")} />
      <DropStat skill="Position" placeholder={props.stats.position} list={positions} selected={(i) => handleSelect(i, "position")} />
      <DropStat skill="Body" placeholder={props.stats.body} list={bodyTypes} selected={(i) => handleSelect(i, "body")} />
    </div>
  );
}

export default Editor;