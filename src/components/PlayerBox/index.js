import React from "react";
import { FaEye, FaPlaystation, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import "./styles.css"
//import { Checkbox } from "pretty-checkbox-react";
import "pretty-checkbox"


function PlayerBox(props) {

    const handleClickView = () => {
        props.clickView()
    }

    const handleClickMCR = () => {
      props.clickMCR();
    };

    const handleIdPlayer = (id) => {
      if(!id) return;
      const splitted = id.split('');
        return splitted[0]+splitted[1]+splitted[2]+"/"+splitted[3]+splitted[4]+splitted[5];
    }

    return (
      <div className="PlayerBox">
        {props?.id ? <img src={`https://cdn.sofifa.net/players/${handleIdPlayer(props.id)}/22_60.png`} alt="avatar"/> : ""}
        <div className="PlayerBox__name">{props.name}</div>
        <div className="PlayerBox__num">{props.number}</div>
        <div className="PlayerBox__pos">{props.position}</div>
        {props.editable ? <div className="PlayerBox__view">
            <span onClick={handleClickView}><FaEye /></span>
            <span onClick={handleClickMCR}><FaPlaystation /></span>            
        </div> : undefined}
        <div className="PlayerBox__btn">
            <button onClick={props.onClickButton}>{props.editable ? <FaTrashAlt size="16px"/> : <FaPlusCircle size="16px"/>}</button>
        </div>           
      </div>
    );
}
//<Checkbox onChange={props.onChangeCheck} checked={props.checked} style={{margin: 0}} color="primary" shape="curve" icon={<FaCheck/>} animation="jelly"/>
export default PlayerBox;