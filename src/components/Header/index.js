import React from "react";
import "./styles.css";

import logo from "./../../assets/Mexwe_logo-07.png";

function Header(props) {
    return(
        <div className="header">
            <img src={logo} />
        </div>
    )
}

export default Header;