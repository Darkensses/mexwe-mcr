import React from "react";
import "./styles.css";
import { FaGithub, FaFacebook } from "react-icons/fa";

const Emoji = (props) => (
  <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ""}
    aria-hidden={props.label ? "false" : "true"}
  >
    {props.symbol}
  </span>
);

function Footer(props) {
  return (
    <div className="footer">
      <p style={{ textAlign: "center" }}>
        Created with <Emoji symbol={"💖"} label="heart" /> and{" "}
        <Emoji symbol={"🤘"} label="heart" /> by MexWe © 2021.
        <br />
        <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/MexWEdition"><FaGithub size={24} /></a>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/Darkensses/mexwe-mcr"><FaFacebook size={24} /></a>
      </p>
    </div>
  );
}

export default Footer;
